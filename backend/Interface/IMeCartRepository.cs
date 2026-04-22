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
        /// <param name="fromWaitlistOrPromotion">略過「有排隊者則不可手動加購物車」檢查（遞補、結帳、背景工作）</param>
        Task<CartItemListingDto?> AddItemToCartByIdAsync(AppUser user, Guid userBookId, bool fromWaitlistOrPromotion = false);
        Task<CartItemListingDto?> DeleteItemFromCartByIdAsync(AppUser user, Guid userBookId);
        Task<OrderDto> CreateOrderAsync(AppUser user, CheckoutCartDto checkoutDto);
        Task<CartDto?> DeleteAllCartAsync(AppUser user);
    }
}