using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
    [ApiController]
    public class WaitlistController : ControllerBase
    {
        private readonly IWaitlistRepository _waitRepo;
        public WaitlistController(IWaitlistRepository waitRepo)
        {
            _waitRepo = waitRepo;
        }

        [HttpGet("{userBookId:guid}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<WaitlistDto>>> GetAll([FromRoute] Guid userBookId)
        {
            var waitlist = await _waitRepo.GetAllByBookIdAsync(userBookId);
            if (waitlist == null) return NotFound();
            return Ok(waitlist.Select(w => w.ToWaitlistDto()).ToList());
        }

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