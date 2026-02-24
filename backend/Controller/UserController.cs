using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Error;
using backend.Dto.Me;
using backend.Interface;
using backend.Model;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controller
{
    [Route("api")]
    [ApiController]
    [ProducesErrorResponseType(typeof(ApiErrorResponse))]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepo;
        public UserController(IUserRepository userRepo)
        {
            _userRepo = userRepo;
        }

        [HttpGet("{accountId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<UserDto>> GetUserInfo([FromRoute] string accountId)
        {
            return await _userRepo.GetUserInfoAsync(accountId);
        }

        [HttpGet("{accountId}/followers")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<UserFollowDto>?>> GetAllFollowers([FromRoute] string accountId)
        {
            return await _userRepo.GetAllFollowersAsync(accountId);
        }

        [HttpGet("{accountId}/followings")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<UserFollowDto>?>> GetAllFollowings([FromRoute] string accountId)
        {
            return await _userRepo.GetAllFollowingsAsync(accountId);
        }
    }
}