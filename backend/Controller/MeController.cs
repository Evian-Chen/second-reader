using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Me;
using backend.Interface;
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
        private readonly IMeRepository _meRepo;
        public MeController(IMeRepository meRepo)
        {
            _meRepo = meRepo;
        }

        [HttpGet]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<UserDto>> GetMe()
        {
            // UserProvisioningMiddleware 已經把 AppUser 放到 HttpContext.Items["AppUser"] 裡面了
            // 無論是既有或新的使用者，都確保這是一個 AppUser
            var appUser = HttpContext.Items["AppUser"] as AppUser ?? throw new UnauthorizedAccessException();
            return Ok(appUser.ToUserDto());
        }

        [HttpPut]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<UserDto>> UpdateMe([FromBody] UpdateUserDto updateUserDto)
        {
            if (!ModelState.IsValid) return BadRequest();

            var appUser = HttpContext.Items["AppUser"] as AppUser ?? throw new UnauthorizedAccessException();

            AppUser? newUser;
            if (appUser.UserProfile == null)  // 初次登入，尚未設定使用者資料，強制使用者更新資料
            {
                newUser = await _meRepo.FirstTimeUpdateUserInfoAsync(appUser, updateUserDto);
            }
            else
            {
                newUser = await _meRepo.UpdateUserInfoAsync(appUser, updateUserDto);
            }

            if (newUser == null) return Conflict(new { message = "AccountId already exists." });
            return Ok(newUser.ToUserDto());
        }
    }
}