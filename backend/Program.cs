using System.Text.Json.Serialization;
using backend.Auth;
using backend.Data;
using backend.Interface;
using backend.Model;
using backend.Repository;
using backend.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Converters;
using Microsoft.OpenApi.Models;
using TesseractOCR;
using TesseractOCR.Enums;
using Microsoft.AspNetCore.Mvc;
using backend.Dto.Error;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        // 如果是 modelState validation 的問題，需要轉通用格式
        var errors = context.ModelState
            .Where(kvp => kvp.Value?.Errors.Count > 0)
            .ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value!.Errors.Select(e => e.ErrorMessage).ToArray()
            );

        var payload = new ApiErrorResponse(
            Error: "Validation failed.",
            Code: "VALIDATION_ERROR",
            Errors: errors
        );

        return new BadRequestObjectResult(payload); // StatusCodes.Status400BadRequest
    };
});


// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "SecondReader API", Version = "v1" });

    // 讀取 XML 文檔註釋
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }

    // 讓右上角出現 Authorize 按鈕
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter: Bearer {token}"
    });

    // 讓所有有 [Authorize] 的 endpoint 會帶上鎖頭，並支援送 token
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
builder.Services.AddSwaggerGenNewtonsoftSupport();

// add controller
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.Converters.Add(new StringEnumConverter());
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    })
    .ConfigureApiBehaviorOptions(options =>
    {
        options.SuppressMapClientErrors = true;
    });

// 設定CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("RenderCorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://192.168.1.103:3000")
                .AllowAnyHeader()
                .AllowAnyMethod();
    });
});

// 使用 PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDBContext>(options =>
    options.UseNpgsql(connectionString));

// add scope，每個 request 一個 scope
builder.Services.AddScoped<IAppUserRepository, AppUserRepository>();
builder.Services.AddScoped<IAppUserService, AppUserService>();
builder.Services.AddScoped<IMeRepository, MeRepository>();
builder.Services.AddScoped<IBooksRepository, BooksRepository>();
builder.Services.AddScoped<IOcrService, OcrService>();
builder.Services.AddHttpClient<IGoogleBookService, GoogleBookService>();
builder.Services.AddScoped<IReadingPostRepository, ReadingPostRepository>();
builder.Services.AddScoped<IMeCartRepository, MeCartRepository>();
builder.Services.AddScoped<IMeNotificationRepository, MeNotificationRepository>();
builder.Services.AddScoped<IWaitlistRepository, WaitlistRepository>();
builder.Services.AddScoped<IMeOrderReporitory, MeOrderRepository>();
builder.Services.AddScoped<IMeSalesRepository, MeSalesRepository>();
builder.Services.AddScoped<IMeSavedRepository, MeSavedRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICommentRepository, CommentRepository>();
// builder.Services.AddHostedService<CartReservationCleanUpWorker>();

// Auth switch
var useDevFakeAuth = builder.Configuration.GetValue<bool>("Auth:UseDevFakeAuth");

if (useDevFakeAuth)  // dev
{
    builder.Services
        .AddAuthentication("Dev")
        .AddScheme<Microsoft.AspNetCore.Authentication.AuthenticationSchemeOptions, DevAuthHandler>("Dev", _ => { });
}
else  // production
{
    var issuer = builder.Configuration["Clerk:Issuer"];

    builder.Services
        .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.Authority = issuer;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = issuer,
                ValidateAudience = false,
                ValidateLifetime = true,
                NameClaimType = "sub",
            };
        });
}

builder.Services.AddAuthorization();

// CORS：允許前端 origin（localhost 開發、正式網域上線時再補）
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("RenderCorsPolicy");

app.UseMiddleware<ApiExceptionMiddleware>();
app.UseAuthentication();
// 應用程式啟動時建立一次，對每個 request 都會做，但裡面有檢查該 API 是否是 [Authorize]
app.UseMiddleware<UserProvisioningMiddleware>();
app.UseAuthorization();

app.MapControllers();

// === test OCR === //

// var tessdataPath = Path.Combine(AppContext.BaseDirectory, "tessdata");
// var imagePath = Path.Combine(AppContext.BaseDirectory, "test_images", "test6.png");

// Console.WriteLine($"Tessdata path: {tessdataPath}");
// Console.WriteLine($"Image path: {imagePath}");

// using var engine = new Engine(tessdataPath, Language.ChineseTraditional | Language.English, EngineMode.Default);

// using var img = TesseractOCR.Pix.Image.LoadFromFile(imagePath);
// using var page = engine.Process(img);

// var text = page.Text;

// Console.WriteLine("===== OCR RESULT =====");
// Console.WriteLine(text);
// Console.WriteLine("======================");

// === test OCR === //

app.Run();




