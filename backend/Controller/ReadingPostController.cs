using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using backend.Dto.Error;
using backend.Dto.ReadingPost;
using backend.Interface;
using backend.Mapper;
using backend.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace backend.Controller
{
    [Route("/api/reading-posts")]
    [ProducesErrorResponseType(typeof(ApiErrorResponse))]
    [ApiController]
    public class ReadingPostController : ControllerBase
    {
        private readonly IReadingPostRepository _postRepo;
        public ReadingPostController(IReadingPostRepository postRepo)
        {
            _postRepo = postRepo;
        }

        /// <summary>
        /// 取得所有的閱讀貼文
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<ReadingPostDto>?>> GetAll()
        {
            var posts = await _postRepo.GetAllAsync();
            if (posts == null) return NotFound();
            return posts;
        }

        /// <summary>
        /// 取得某使用者的所有貼文
        /// </summary>
        /// <param name="accountId"></param>
        /// <returns></returns>
        [HttpGet("{accountId}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<ReadingPostDto>>> GetAllByAccountId([FromRoute] string accountId)
        {
            var posts = await _postRepo.GetAllByAccountIdAsync(accountId);
            if (posts == null) return NotFound("No reading posts found in this account.");
            return Ok(posts);
        }

        /// <summary>
        /// 取得特定一筆貼文
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ReadingPostDto>> GetPostById([FromRoute] Guid id)
        {
            var post = await _postRepo.GetPostByIdAsync(id);
            if (post == null) return NotFound();
            return Ok(post.ToReadingPostDto());
        }

        /// <summary>
        /// 按或取消一筆貼文的讚
        /// </summary>
        /// <param name="id"></param>
        /// <param name="likePostDto"></param>
        /// <returns></returns>
        [HttpPut("{id:guid}/like")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ReadingPostDto>> LikePosyById([FromRoute] Guid id, [FromBody] LikePostDto likePostDto)
        {
            if (!ModelState.IsValid) return BadRequest();
            var addedPost = await _postRepo.LikePosyByIdAsync(id, likePostDto);
            if (addedPost == null) return NotFound("no such post to like");
            return Ok(addedPost.ToReadingPostDto());
        }

        /// <summary>
        /// 發布一則貼文
        /// </summary>
        /// <param name="postDto"></param>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException"></exception>
        [HttpPost]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ReadingPostDto>> CreatePost([FromBody] createReadingPostDto postDto)
        {
            if (!ModelState.IsValid) return BadRequest();

            var appUser = HttpContext.Items["AppUser"] as AppUser ?? throw new UnauthorizedAccessException();
            var createdPost = await _postRepo.CreatePostAsync(postDto, appUser);
            if (createdPost == null) return StatusCode(500, "add new post to database failed");
            return Ok(createdPost.ToReadingPostDto());
        }

        /// <summary>
        /// 刪除一則貼文
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id:guid}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> DeletePostById([FromRoute] Guid id)
        {
            var post = await _postRepo.DeletePostByIdAsync(id);
            if (post == null) return NotFound("no such post to delete");
            return Ok();
        }

        /// <summary>
        /// 更改一則貼文的內容
        /// </summary>
        /// <param name="id"></param>
        /// <param name="postDto"></param>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException"></exception>
        [HttpPut("{id:guid}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ReadingPostDto>> UpdatePostById([FromRoute] Guid id, [FromBody] createReadingPostDto postDto)
        {
            if (!ModelState.IsValid) return BadRequest();
            var appUser = HttpContext.Items["AppUser"] as AppUser ?? throw new UnauthorizedAccessException();
            var updated = await _postRepo.UpdatePostByIdAsync(id, postDto, appUser!);
            return Ok(updated!.ToReadingPostDto());
        }

        /// <summary>
        /// 用關鍵字尋找貼文
        /// </summary>
        /// <param name="keyword"></param>
        /// <returns></returns>
        [HttpGet("search")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<ReadingPostDto>>> SearchPostsByKeyWords([FromQuery] string keyword)
        {
            if (!ModelState.IsValid) return BadRequest();
            var posts = await _postRepo.SearchByKeyWordsAsync(keyword);
            if (posts == null) return NotFound();
            return Ok(posts);
        }
    }
}