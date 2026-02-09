using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Error;
using Microsoft.AspNetCore.Mvc;

namespace backend.Service
{
    /// <summary>
    /// 將錯誤輸出格式化，方便與前端溝通
    /// 通用格式: ApiErrorResponse
    /// </summary>
    public class ApiExceptionMiddleware
    {
        private readonly ILogger<ApiExceptionMiddleware> _logger;
        private readonly RequestDelegate _next;
        public ApiExceptionMiddleware(ILogger<ApiExceptionMiddleware> logger, RequestDelegate next)
        {
            _logger = logger;
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (InvalidOperationException ex)
            {
                context.Response.StatusCode = StatusCodes.Status409Conflict;
                await WriteJson(context, new ApiErrorResponse(ex.Message, "InvalidOperationException"));
            }
            catch (UnauthorizedAccessException ex)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await WriteJson(context, new ApiErrorResponse(ex.Message, "UnauthorizedAccessException"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception.");
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                await WriteJson(context, new ApiErrorResponse(ex.Message, "Internal Server Error!"));
            }
        }

        private static Task WriteJson(HttpContext context, ApiErrorResponse payload)
        {
            context.Response.ContentType = "application/json";
            return context.Response.WriteAsJsonAsync(payload);
        }
    }
}