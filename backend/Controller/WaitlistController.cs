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
    [Route("/api/waitlist")]
    [ProducesErrorResponseType(typeof(ApiErrorResponse))]
    [ApiController]
    public class WaitlistController : ControllerBase
    {
        private readonly IWaitlistRepository _waitRepo;
        public WaitlistController(IWaitlistRepository waitRepo)
        {
            _waitRepo = waitRepo;
        }

        /// <summary>
        /// 取得特定書籍的排隊狀態
        /// </summary>
        /// <param name="userBookId"></param>
        /// <returns></returns>
        [HttpGet("{userBookId:guid}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<WaitlistDto>>> GetAll([FromRoute] Guid userBookId)
        {
            var waitlist = await _waitRepo.GetAllByBookIdAsync(userBookId);
            if (waitlist == null) return NotFound();
            return Ok(waitlist.Select(w => w.ToWaitlistDto()).ToList());
        }

        /// <summary>
        /// 加入或取消排隊一本書
        /// </summary>
        /// <param name="userBookId"></param>
        /// <param name="addToWaitlist">是否加入排隊</param>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException"></exception>
        [HttpPost("{userBookId:guid}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<WaitlistDto>> AddOrRemoveWaitlist([FromRoute] Guid userBookId, [FromQuery] bool addToWaitlist)
        {
            // 排某本書或取消排隊
            if (!ModelState.IsValid) return BadRequest();
            var user = HttpContext.Items["AppUser"] as AppUser ?? throw new UnauthorizedAccessException();
            var waitlist = await _waitRepo.AddOrRemoveWaitlistAsync(userBookId, addToWaitlist, user);
            if (waitlist == null) return StatusCode(500, "unable to add or remove waitlist");
            return Ok(waitlist.ToWaitlistDto());
        }
    }
}