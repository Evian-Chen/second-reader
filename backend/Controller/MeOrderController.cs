using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Interface;
using backend.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controller
{
    [Route("/api/me/order")]
    [ApiController]
    public class MeOrderController : ControllerBase
    {
        private readonly IMeOrderReporitory _orderRepo;
        public MeOrderController(IMeOrderReporitory orderRepo)
        {
            _orderRepo = orderRepo;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            var user = HttpContext.Items["AppUser"] as AppUser;
            var orderDtos = await _orderRepo.GetAllOrderAsync(user);
            if (orderDtos == null) return NotFound();
            return Ok(orderDtos);
        }

        [HttpGet("{id:int}")]
        [Authorize]
        public async Task<IActionResult> GetOrderById([FromRoute] int id)
        {
            var user = HttpContext.Items["AppUser"] as AppUser;
            var orderDto = await _orderRepo.GetOrderByIdAsync(user, id);
            if (orderDto == null) return NotFound();
            return Ok(orderDto);
        }
    }
}