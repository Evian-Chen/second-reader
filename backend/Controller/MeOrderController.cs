using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Order;
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
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<OrderDto>> GetAll()
        {
            var user = HttpContext.Items["AppUser"] as AppUser ?? throw new UnauthorizedAccessException();
            var orderDtos = await _orderRepo.GetAllOrderAsync(user);
            if (orderDtos == null) return NotFound();
            return Ok(orderDtos);
        }

        [HttpGet("{id:guid}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<OrderDto>> GetOrderById([FromRoute] Guid id)
        {
            var user = HttpContext.Items["AppUser"] as AppUser ?? throw new UnauthorizedAccessException();
            var orderDto = await _orderRepo.GetOrderByIdAsync(user, id);
            if (orderDto == null) return NotFound();
            return Ok(orderDto);
        }
    }
}