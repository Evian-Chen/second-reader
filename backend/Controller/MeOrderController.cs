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

        /// <summary>
        /// 取得所有歷史訂單
        /// </summary>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException"></exception>
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

        /// <summary>
        /// 取得特定一筆訂單
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException"></exception>
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

        [HttpPost("{orderItemId:guid}/complete")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<OrderItemDto>> CompleteOrderItemById([FromRoute] Guid orderItemId)
        {
            // 已經拿到麥加出貨的書了
            var user = HttpContext.Items["AppUser"] as AppUser ?? throw new UnauthorizedAccessException();
            var item = await _orderRepo.CompleteOrderItemByIdAsync(user, orderItemId);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpGet("/item/{orderItemId:guid}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<OrderItemDto>> GetOrderItemById([FromRoute] Guid orderItemId)
        {
            var item = await _orderRepo.GetOrderItemByIdAsync(orderItemId);
            if (item == null) return NotFound();
            return Ok(item);
        }
    }
}