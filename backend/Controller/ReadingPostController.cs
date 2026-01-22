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
        public async Task<IActionResult> GetAllByAccountId([FromRoute] string accountId)
        {
            var posts = await _postRepo.GetAllByAccountIdAsync(accountId);
            if (posts == null) return NotFound("No reading posts found in this account.");
            return Ok(posts);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetPostById([FromRoute] int id)
        {
            var post = await _postRepo.GetPostByIdAsync(id);
            if (post == null) return NotFound();
            return Ok(post.ToReadingPostDto());
        }

        [HttpPut("{id:int}/like")]
        public async Task<IActionResult> LikePosyById([FromRoute] int id, [FromBody] LikePostDto likePostDto)
        {
            var addedPost = await _postRepo.LikePosyByIdAsync(id, likePostDto);
            if (addedPost == null) return NotFound("no such post to like");
            return Ok(addedPost.ToReadingPostDto());
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreatePost([FromBody] createReadingPostDto postDto)
        {
            if (!ModelState.IsValid) return BadRequest();

            var appUser = HttpContext.Items["AppUser"] as AppUser;
            var createdPost = await _postRepo.CreatePostAsync(postDto, appUser);
            if (createdPost == null) return StatusCode(500, "add new post to database failed");
            return Ok(createdPost.ToReadingPostDto());
        }

        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<IActionResult> DeletePostById([FromRoute] int id)
        {
            var post = await _postRepo.DeletePostByIdAsync(id);
            if (post == null) return NotFound("no such post to delete");
            return Ok();
        }

        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<IActionResult> UpdatePostById([FromRoute] int id, [FromBody] createReadingPostDto postDto)
        {
            if (!ModelState.IsValid) return BadRequest();
            var appUser = HttpContext.Items["AppUser"] as AppUser;
            var updated = await _postRepo.UpdatePostByIdAsync(id, postDto, appUser);
            return Ok(updated.ToReadingPostDto());
        }
    }
}