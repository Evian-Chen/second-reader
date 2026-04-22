using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Error;
using backend.Dto.Me;
using backend.Dto.Waitlist;
using backend.Interface;
using backend.Mapper;
using backend.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controller
{
    [Route("api/me")]
    [ProducesErrorResponseType(typeof(ApiErrorResponse))]
    [ApiController]
    public class MeController : ControllerBase
    {
        private readonly IMeRepository _meRepo;
        private readonly IMeSavedRepository _savedRepo;
        private readonly IWaitlistRepository _waitlistRepo;
        public MeController(IMeRepository meRepo, IMeSavedRepository saveRepo, IWaitlistRepository waitlistRepo)
        {
            _meRepo = meRepo;
            _savedRepo = saveRepo;
            _waitlistRepo = waitlistRepo;
        }
        private AppUser user => HttpContext.Items["AppUser"] as AppUser ?? throw new UnauthorizedAccessException();

        /// <summary>
        /// 取得此使用者的個人資料
        /// </summary>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException"></exception>
        [HttpGet]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<UserDto>> GetMe()
        {
            // UserProvisioningMiddleware 已經把 AppUser 放到 HttpContext.Items["AppUser"] 裡面了
            // 無論是既有或新的使用者，都確保這是一個 AppUser
            return Ok(user.ToUserDto());
        }

        /// <summary>
        /// 更改此使用者的個人資料
        /// </summary>
        /// <param name="updateUserDto"></param>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException"></exception>
        [HttpPut]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<UserDto>> UpdateMe([FromBody] UpdateUserDto updateUserDto)
        {
            if (!ModelState.IsValid) return BadRequest();

            AppUser? newUser;
            if (user.UserProfile == null)  // 初次登入，尚未設定使用者資料，強制使用者更新資料
            {
                newUser = await _meRepo.FirstTimeUpdateUserInfoAsync(user, updateUserDto);
            }
            else
            {
                newUser = await _meRepo.UpdateUserInfoAsync(user, updateUserDto);
            }

            if (newUser == null) return Conflict(new { message = "AccountId already exists." });
            return Ok(newUser.ToUserDto());
        }

        /// <summary>
        /// 獲取當前使用者收藏的所有貼文列表
        /// </summary>
        /// <returns>收藏貼文的 DTO 列表</returns>
        /// <exception cref="UnauthorizedAccessException">當使用者未通過驗證時拋出</exception>
        [HttpGet("saved/posts")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> GetSavedPosts()
        {
            var posts = await _savedRepo.GetAllSavedPostsAsync(user);
            return Ok(posts);
        }

        /// <summary>
        /// 根據貼文 ID 收藏特定貼文
        /// </summary>
        /// <param name="postId">貼文的唯一識別碼 (Guid)</param>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException">當使用者未通過驗證時拋出</exception>
        [HttpPost("saved/posts/{postId}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<ActionResult> SavePostById([FromRoute] Guid postId)
        {
            await _savedRepo.SavedPostById(user, postId);
            return Created();
        }

        /// <summary>
        /// 根據貼文 ID 取消收藏特定貼文
        /// </summary>
        /// <param name="postId">貼文的唯一識別碼 (Guid)</param>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException">當使用者未通過驗證時拋出</exception>
        [HttpDelete("saved/posts/{postId}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult> RemovePostById([FromRoute] Guid postId)
        {
            var success = await _savedRepo.RemovePostById(user, postId);
            if (!success) return NotFound("該收藏紀錄不存在");

            return NoContent();
        }

        /// <summary>
        /// 獲取當前使用者收藏的所有書籍列表
        /// </summary>
        /// <returns>收藏書籍的 DTO 列表</returns>
        /// <exception cref="UnauthorizedAccessException">當使用者未通過驗證時拋出</exception>
        [HttpGet("saved/books")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> GetSavedBooks()
        {
            var books = await _savedRepo.GetAllSavedBooksAsync(user);
            return Ok(books);
        }

        /// <summary>
        /// 根據書籍 ID 收藏特定書籍
        /// </summary>
        /// <param name="bookId">書籍的唯一識別碼 (Guid)</param>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException">當使用者未通過驗證時拋出</exception>
        [HttpPost("saved/books/{bookId}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<ActionResult> SaveBookById([FromRoute] Guid bookId)
        {
            await _savedRepo.SavedBookById(user, bookId);
            return StatusCode(201);
        }

        /// <summary>
        /// 根據書籍 ID 取消收藏特定書籍
        /// </summary>
        /// <param name="bookId">書籍的唯一識別碼 (Guid)</param>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException">當使用者未通過驗證時拋出</exception>
        [HttpDelete("saved/books/{bookId}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> RemoveBookById([FromRoute] Guid bookId)
        {
            var success = await _savedRepo.RemoveBookById(user, bookId);
            if (!success) return NotFound("該收藏紀錄不存在");

            return NoContent();
        }

        /// <summary>目前使用者在排隊中（等待中）的書籍，供訂單／個人管理頁顯示。</summary>
        [HttpGet("waiting/books")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<MyWaitlistEntryDto>>> GetMyWaitingBooks()
        {
            var list = await _waitlistRepo.GetMyWaitingBooksAsync(user);
            return Ok(list);
        }

        [HttpPost("{accountId}/follow")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<UserFollowDto>> FollowByUserId([FromRoute] string accountId)
        {
            var followed = await _meRepo.FollowByUserIdAsync(user, accountId);
            return Ok(followed);
        }

        [HttpDelete("{followedId}/follow")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult> UnfollowByUserId([FromRoute] string accountId)
        {
            await _meRepo.UnfollowByUserIdAsync(user, accountId);
            return NoContent();
        }
    }
}