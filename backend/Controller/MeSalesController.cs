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

        /// <summary>
        /// 取得所有此使用者被下單的紀錄
        /// </summary>
        /// <param name="status">可篩選被下單的狀態</param>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException"></exception>
        [HttpGet]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<OrderItemDto>>> GetSaleItemsByStatus([FromQuery] OrderItemStatus? status)
        {
            // /api/me/sales?status=Pending
            if (!ModelState.IsValid) return BadRequest();

            var user = HttpContext.Items["AppUser"] as AppUser ?? throw new UnauthorizedAccessException();
            var items = await _saleRepo.GetSaleItemsByStatusAsync(user, status);
            if (items == null) return NotFound();
            return Ok(items);
        }

        /// <summary>
        /// 取得特定一本被下單的書
        /// </summary>
        /// <param name="orderItemId"></param>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException"></exception>
        [HttpGet("{orderItemId:guid}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<OrderItemDto>> GetSaleItemById([FromRoute] Guid orderItemId)
        {
            if (!ModelState.IsValid) return BadRequest();
            var user = HttpContext.Items["AppUser"] as AppUser ?? throw new UnauthorizedAccessException();
            var item = await _saleRepo.GetSaleItemByIdAsync(user, orderItemId);
            if (item == null) return NotFound();
            return Ok(item);
        }

        /// <summary>
        /// 接受特定一本書的下單請求
        /// </summary>
        /// <param name="orderItemId"></param>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException"></exception>
        [HttpPost("{orderItemId:guid}/accept")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<OrderItemDto>> AcceptSaleItemById([FromRoute] Guid orderItemId)
        {
            // /api/me/sales/1/accept 接受這筆訂購要求
            if (!ModelState.IsValid) return BadRequest();

            var user = HttpContext.Items["AppUser"] as AppUser ?? throw new UnauthorizedAccessException();
            var item = await _saleRepo.AcceptSaleItemByIdAsync(user, orderItemId);
            if (item == null) return NotFound();
            return Ok(item);
        }

        /// <summary>
        /// 拒絕特定一本書的下單請求
        /// </summary>
        /// <param name="orderItemId"></param>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException"></exception>
        [HttpPost("{orderItemId:guid}/reject")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<OrderItemDto>> RejectSaleItemById([FromRoute] Guid orderItemId)
        {
            // /api/me/sales/1/reject 拒絕這筆訂購要求
            if (!ModelState.IsValid) return BadRequest();

            var user = HttpContext.Items["AppUser"] as AppUser ?? throw new UnauthorizedAccessException();
            var item = await _saleRepo.RejectSaleItemByIdAsync(user, orderItemId);
            if (item == null) return NotFound();
            return Ok(item);
        }

        /// <summary>
        /// 完成特定一本書的下單請求（賣家已出貨/交付）
        /// </summary>
        /// <param name="orderItemId"></param>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException"></exception>
        [HttpPost("{orderItemId:guid}/complete")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<OrderItemDto>> CompleteSaleItemById([FromRoute] Guid orderItemId)
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