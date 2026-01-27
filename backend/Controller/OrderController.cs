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
    [Route("/api/order")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderReporitory _orderRepo;
        public OrderController(IOrderReporitory orderRepo)
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