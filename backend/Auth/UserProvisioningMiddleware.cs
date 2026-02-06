using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using backend.Interface;

namespace backend.Auth
{
    public class UserProvisioningMiddleware
    {
        private readonly RequestDelegate _next;

        public UserProvisioningMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IAppUserService userService)
        {
            if (context.User?.Identity?.IsAuthenticated != true)
            {
                await _next(context);
                return;
            }

            var clerkUserId = context.User.FindFirstValue("sub");
            if (string.IsNullOrWhiteSpace(clerkUserId))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("Missing sub claim.");
                return;
            }

            var accountIdTemp = Util.Random.RandomStringGenerator(15);
            var email = $"{Util.Random.RandomStringGenerator(15)}@gmail.com";
            var appUser = await userService.EnsureLocalUserAsync(clerkUserId, email, accountIdTemp);

            // 給 controller 拿
            context.Items["AppUser"] = appUser;

            await _next(context);
        }
    }

}