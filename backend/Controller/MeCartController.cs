using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Cart;
using backend.Dto.Order;
using backend.Interface;
using backend.Mapper;
using backend.Model;
using backend.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controller
{
    [Route("/api/me/cart")]
    [ApiController]
    public class MeCartController : ControllerBase
    {
        private readonly IMeCartRepository _cartRepo;
        public MeCartController(IMeCartRepository cartRepo)
        {
            _cartRepo = cartRepo;
        }

        /// <summary>
        /// 取得使用者購物車中所有商品
        /// </summary>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException"></exception>
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<CartDto>> GetCart()
        {
            // 取得這個使用者目前購物車的所有商品，以 CartItemListingDto 做顯示
            var user = HttpContext.Items["AppUser"] as AppUser ?? throw new UnauthorizedAccessException();
            var cart = await _cartRepo.GetCartAsync(user);
            return Ok(cart);
        }

        /// <summary>
        /// 將一商品加入購物車
        /// </summary>
        /// <param name="itemDto"></param>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException"></exception>
        [HttpPost("items")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<CartItemListingDto>> AddItemToCartById([FromBody] CartItemDto itemDto)
        {
            if (!ModelState.IsValid) return BadRequest();

            var user = HttpContext.Items["AppUser"] as AppUser ?? throw new UnauthorizedAccessException();
            var item = await _cartRepo.AddItemToCartByIdAsync(user, itemDto);
            if (item == null) return NotFound();
            return Ok(item);
        }

        /// <summary>
        /// 將一商品移除購物車
        /// </summary>
        /// <param name="userBookId"></param>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException"></exception>
        [HttpDelete("items/{userBookId:guid}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> DeleteItemFromCartById([FromRoute] Guid userBookId)
        {
            if (!ModelState.IsValid) return BadRequest();
            var user = HttpContext.Items["AppUser"] as AppUser ?? throw new UnauthorizedAccessException();
            var item = await _cartRepo.DeleteItemFromCartByIdAsync(user!, userBookId);
            if (item == null) return NotFound();
            return NoContent();
        }

        /// <summary>
        /// 將購物車的商品結帳
        /// </summary>
        /// <param name="checkoutDto"></param>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException">買家需選擇書本交付與付款方式</exception>
        [HttpPost("checkout")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<OrderDto>> CreateOrder([FromBody] CheckoutCartDto checkoutDto)
        {
            if (!ModelState.IsValid) return BadRequest();
            // 每個使用者只會有一個購物車，建立訂單後刪除購物車
            var user = HttpContext.Items["AppUser"] as AppUser ?? throw new UnauthorizedAccessException();
            var orderDto = await _cartRepo.CreateOrderAsync(user, checkoutDto);
            return Ok(orderDto);
        }
    }
}