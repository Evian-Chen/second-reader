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
        private readonly IAppUserService _userService;

        public UserProvisioningMiddleware(RequestDelegate next, IAppUserService userService)
        {
            _next = next;
            _userService = userService;
        }

        public async Task InvokeAsync(HttpContext context)
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

            var email = context.User.FindFirstValue("email");
            var appUser = await _userService.EnsureLocalUserAsync(clerkUserId, email);

            // 給 controller 拿
            context.Items["AppUser"] = appUser;

            await _next(context);
        }
    }

}