using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Me;
using backend.Mapper;
using backend.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controller
{
    [Route("api/me")]
    [ApiController]
    public class MeController : ControllerBase
    {
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetMe()
        {
            // UserProvisioningMiddleware 已經把 AppUser 放到 HttpContext.Items["AppUser"] 裡面了
            // 無論是既有或新的使用者，都確保這是一個 AppUser
            var appUser = HttpContext.Items["AppUser"] as AppUser;

            if (appUser == null) return Unauthorized();

            return Ok(appUser.ToUserDto());
        }
    }
}