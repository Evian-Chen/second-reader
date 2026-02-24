using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using backend.Dto.Book;
using backend.Dto.Comment;
using backend.Dto.Error;
using backend.Dto.GoogleBook;
using backend.Dto.UserBook;
using backend.Enums;
using backend.Interface;
using backend.Mapper;
using backend.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;

namespace backend.Controller
{
    [Route("/api/comments")]
    [ProducesErrorResponseType(typeof(ApiErrorResponse))]
    [ApiController]
    public class CommentController : ControllerBase 
    {
        private readonly ICommentRepository _commRepo;
        public CommentController(ICommentRepository commRepo)
        {
            _commRepo = commRepo;            
        }

        private AppUser user => HttpContext.Items["AppUser"] as AppUser ?? throw new UnauthorizedAccessException();

        /// <summary>
        /// 新增一筆留言
        /// </summary>
        /// <param name="commentDto"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        [HttpPost]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<CommentDto>> CreateComment([FromBody] CreateCommentDto createCommentDto)
        {
            if (!ModelState.IsValid) return BadRequest();
            var comment = await _commRepo.CreateCommentAsync(createCommentDto, user);
            return Ok(comment);
        }

        /// <summary>
        /// 刪除一筆留言(soft delete)
        /// </summary>
        /// <param name="commentId"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        [HttpDelete("{commentId}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult> DeleteComment([FromRoute] Guid commentId)
        {
            if (!ModelState.IsValid) return BadRequest();
            await _commRepo.DeleteCommentAsync(commentId, user);
            return NoContent();
        }

        /// 取得某 root comment 底下全部的回覆（child comment）
        [HttpGet("{rootId}/child-comments")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<CommentDto>>> GetChildCommentsByRootId([FromRoute] Guid rootId)
        {
            if (!ModelState.IsValid) return BadRequest();
            var comments = await _commRepo.GetChildCommentsByRootIdAsync(rootId);
            return Ok(comments);
        }
    }
}