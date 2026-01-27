using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Cart;
using backend.Dto.Order;
using backend.Model;

namespace backend.Interface
{
    public interface IMeCartRepository
    {
        Task<CartDto> GetCartAsync(AppUser user);
        Task<CartItemListingDto?> AddItemToCartByIdAsync(AppUser user, CartItemDto itemDto);
        Task<CartItemListingDto?> DeleteItemFromCartByIdAsync(AppUser user, int userBookId);
        Task<OrderDto> CreateOrderAsync(AppUser user, CheckoutCartDto checkoutDto);
    }
}