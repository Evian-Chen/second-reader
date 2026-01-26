using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Cart;
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

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetCart()
        {
            // 取得這個使用者目前購物車的所有商品，以 CartItemListingDto 做顯示
            var user = HttpContext.Items["AppUser"] as AppUser;
            var cart = await _cartRepo.GetCartAsync(user);
            return Ok(cart);
        }

        [HttpPost("items")]
        [Authorize]
        public async Task<IActionResult> AddItemToCartById([FromBody] CartItemDto itemDto)
        {
            if (!ModelState.IsValid) return BadRequest();

            var user = HttpContext.Items["AppUser"] as AppUser;
            var item = await _cartRepo.AddItemToCartByIdAsync(user, itemDto);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpDelete("items/{userBookId:int}")]
        [Authorize]
        public async Task<IActionResult> DeleteItemFromCartById([FromRoute] int userBookId)
        {
            if (!ModelState.IsValid) return BadRequest();
            var user = HttpContext.Items["AppUser"] as AppUser;
            var item = await _cartRepo.DeleteItemFromCartByIdAsync(user, userBookId);
            if (item == null) return NotFound();
            return NoContent();
        }
    }
}