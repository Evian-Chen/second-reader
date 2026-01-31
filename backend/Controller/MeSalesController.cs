using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Order;
using backend.Enums;
using backend.Interface;
using backend.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controller
{
    [Route("/api/me/sales")]
    [ApiController]
    public class MeSalesController : ControllerBase
    {
        private readonly IMeSalesRepository _saleRepo;
        public MeSalesController(IMeSalesRepository saleRepo)
        {
            _saleRepo = saleRepo;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<List<OrderItemDto>>> GetSaleItemsByStatus([FromQuery] OrderItemStatus? status)
        {
            // /api/me/sales?status=Pending
            if (!ModelState.IsValid) return BadRequest();

            var user = HttpContext.Items["AppUser"] as AppUser ?? throw new UnauthorizedAccessException();
            var items = await _saleRepo.GetSaleItemsByStatusAsync(user, status);
            if (items == null) return NotFound();
            return Ok(items);
        }

        [HttpGet("{orderItemId:int}")]
        [Authorize]
        public async Task<ActionResult<OrderItemDto>> GetSaleItemById([FromRoute] int orderItemId)
        {
            if (!ModelState.IsValid) return BadRequest();
            var user = HttpContext.Items["AppUser"] as AppUser ?? throw new UnauthorizedAccessException();
            var item = await _saleRepo.GetSaleItemByIdAsync(user, orderItemId);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost("{orderItemId:int}/accept")]
        [Authorize]
        public async Task<ActionResult<OrderItemDto>> AcceptSaleItemById([FromRoute] int orderItemId)
        {
            // /api/me/sales/1/accept 接受這筆訂購要求
            if (!ModelState.IsValid) return BadRequest();

            var user = HttpContext.Items["AppUser"] as AppUser ?? throw new UnauthorizedAccessException();
            var item = await _saleRepo.AcceptSaleItemByIdAsync(user, orderItemId);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost("{orderItemId:int}/reject")]
        [Authorize]
        public async Task<ActionResult<OrderItemDto>> RejectSaleItemById([FromRoute] int orderItemId)
        {
            // /api/me/sales/1/reject 拒絕這筆訂購要求
            if (!ModelState.IsValid) return BadRequest();

            var user = HttpContext.Items["AppUser"] as AppUser ?? throw new UnauthorizedAccessException();
            var item = await _saleRepo.RejectSaleItemByIdAsync(user, orderItemId);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost("{orderItemId:int}/complete")]
        [Authorize]
        public async Task<ActionResult<OrderItemDto>> CompleteSaleItemById([FromRoute] int orderItemId)
        {
            // /api/me/sales/1/complete 已出貨，完成這筆訂購 => 發送通知給買家
            if (!ModelState.IsValid) return BadRequest();

            var user = HttpContext.Items["AppUser"] as AppUser ?? throw new UnauthorizedAccessException();
            var item = await _saleRepo.CompleteSaleItemByIdAsync(user, orderItemId);
            if (item == null) return NotFound();
            return Ok(item);
        }
    }
}