using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        [HttpGet("UserBookId:int")]
        public async Task<ActionResult<List<WaitlistDto>>> GetAll([FromRoute] int userBookId)
        {
            var waitlist = await _waitRepo.GetAllAsync(userBookId);
            if (waitlist == null) return NotFound();
            return Ok(waitlist.Select(w => w.ToWaitlistDto()).ToList());
        }

        [HttpPost("UserBookId:int")]
        [Authorize]
        public async Task<ActionResult<WaitlistDto>> AddOrRemoveWaitlist([FromRoute] int userBookId, [FromQuery] bool addToWaitlist)
        {
            // 排某本書或取消排隊
            var user = HttpContext.Items["AppUser"] as AppUser ?? throw new UnauthorizedAccessException();
            var waitlist = await _waitRepo.AddOrRemoveWaitlistAsync(userBookId, addToWaitlist, user);
            if (waitlist == null) return StatusCode(500, "unable to add or remove waitlist");
            return Ok(waitlist.ToWaitlistDto());
        }
    }
}