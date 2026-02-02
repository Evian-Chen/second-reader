using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using backend.Dto.ReadingPost;
using backend.Interface;
using backend.Mapper;
using backend.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controller
{
    [Route("/api/reading-posts")]
    [ApiController]
    public class ReadingPostController : ControllerBase
    {
        private readonly IReadingPostRepository _postRepo;
        public ReadingPostController(IReadingPostRepository postRepo)
        {
            _postRepo = postRepo;
        }

        [HttpGet("{accountId}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<ReadingPostDto>>> GetAllByAccountId([FromRoute] string accountId)
        {
            var posts = await _postRepo.GetAllByAccountIdAsync(accountId);
            if (posts == null) return NotFound("No reading posts found in this account.");
            return Ok(posts);
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ReadingPostDto>> GetPostById([FromRoute] Guid id)
        {
            var post = await _postRepo.GetPostByIdAsync(id);
            if (post == null) return NotFound();
            return Ok(post.ToReadingPostDto());
        }

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
    }
}