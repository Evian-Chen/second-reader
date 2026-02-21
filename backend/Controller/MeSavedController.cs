using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Error;
using backend.Interface;
using backend.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controller
{
    namespace backend.Controller
    {
        [Route("/api/me/saved")]
        [ProducesErrorResponseType(typeof(ApiErrorResponse))]
        [ApiController]
        public class MeSavedController : ControllerBase
        {
            private readonly IMeSavedRepository _savedRepo;
            public MeSavedController(IMeSavedRepository saveRepo)
            {
                _savedRepo = saveRepo;
            }

            private AppUser CurrentUser => HttpContext.Items["AppUser"] as AppUser
                ?? throw new UnauthorizedAccessException();

            /// <summary>
            /// 獲取當前使用者收藏的所有貼文列表
            /// </summary>
            /// <returns>收藏貼文的 DTO 列表</returns>
            /// <exception cref="UnauthorizedAccessException">當使用者未通過驗證時拋出</exception>
            [HttpGet("posts")]
            [Authorize]
            [ProducesResponseType(StatusCodes.Status200OK)]
            public async Task<ActionResult> GetSavedPosts()
            {
                var posts = await _savedRepo.GetAllSavedPostsAsync(CurrentUser);
                return Ok(posts);
            }

            /// <summary>
            /// 根據貼文 ID 收藏特定貼文
            /// </summary>
            /// <param name="postId">貼文的唯一識別碼 (Guid)</param>
            /// <returns></returns>
            /// <exception cref="UnauthorizedAccessException">當使用者未通過驗證時拋出</exception>
            [HttpPost("post/{postId}")]
            [Authorize]
            [ProducesResponseType(StatusCodes.Status201Created)]
            public async Task<ActionResult> SavePostById([FromRoute] Guid postId)
            {
                await _savedRepo.SavedPostById(CurrentUser, postId);
                return Created();
            }

            /// <summary>
            /// 根據貼文 ID 取消收藏特定貼文
            /// </summary>
            /// <param name="postId">貼文的唯一識別碼 (Guid)</param>
            /// <returns></returns>
            /// <exception cref="UnauthorizedAccessException">當使用者未通過驗證時拋出</exception>
            [HttpDelete("post/{postId}")]
            [Authorize]
            [ProducesResponseType(StatusCodes.Status200OK)]
            [ProducesResponseType(StatusCodes.Status404NotFound)]
            [ProducesResponseType(StatusCodes.Status204NoContent)]
            public async Task<ActionResult> RemovePostById([FromRoute] Guid postId)
            {
                var success = await _savedRepo.RemovePostById(CurrentUser, postId);
                if (!success) return NotFound("該收藏紀錄不存在");

                return NoContent();
            }

            /// <summary>
            /// 獲取當前使用者收藏的所有書籍列表
            /// </summary>
            /// <returns>收藏書籍的 DTO 列表</returns>
            /// <exception cref="UnauthorizedAccessException">當使用者未通過驗證時拋出</exception>
            [HttpGet("books")]
            [Authorize]
            [ProducesResponseType(StatusCodes.Status200OK)]
            public async Task<ActionResult> GetSavedBooks()
            {
                var books = await _savedRepo.GetAllSavedBooksAsync(CurrentUser);
                return Ok(books);
            }

            /// <summary>
            /// 根據書籍 ID 收藏特定書籍
            /// </summary>
            /// <param name="bookId">書籍的唯一識別碼 (Guid)</param>
            /// <returns></returns>
            /// <exception cref="UnauthorizedAccessException">當使用者未通過驗證時拋出</exception>
            [HttpPost("book/{bookId}")]
            [Authorize]
            [ProducesResponseType(StatusCodes.Status201Created)]
            public async Task<ActionResult> SaveBookById([FromRoute] Guid bookId)
            {
                await _savedRepo.SavedBookById(CurrentUser, bookId);
                return StatusCode(201);
            }

            /// <summary>
            /// 根據書籍 ID 取消收藏特定書籍
            /// </summary>
            /// <param name="bookId">書籍的唯一識別碼 (Guid)</param>
            /// <returns></returns>
            /// <exception cref="UnauthorizedAccessException">當使用者未通過驗證時拋出</exception>
            [HttpDelete("book/{bookId}")]
            [Authorize]
            [ProducesResponseType(StatusCodes.Status204NoContent)]
            [ProducesResponseType(StatusCodes.Status404NotFound)]
            public async Task<ActionResult> RemoveBookById([FromRoute] Guid bookId)
            {
                var success = await _savedRepo.RemoveBookById(CurrentUser, bookId);
                if (!success) return NotFound("該收藏紀錄不存在");

                return NoContent();
            }
        }
    }
}