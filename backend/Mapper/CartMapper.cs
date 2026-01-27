using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Cart;
using backend.Enums;
using backend.Model;
using Clerk.BackendAPI.Models.Components;

namespace backend.Mapper
{
    public static class CartMapper
    {
        public static CartItemListingDto ToCartItemListingFromCartItem(this CartItem item)
        {
            var paymethods = new List<PayMethod>();
            foreach (var method in item.UserBook!.SellerPayMethods)
            {
                paymethods.Add(method.PayMethod);
            }
            var deliveryMethods = new List<DeliveryMethod>();
            foreach (var method in item.UserBook.SellerDeliveryMethods)
            {
                deliveryMethods.Add(method.DeliveryMethod);
            }
            return new CartItemListingDto
            {
                CartId = item.CartId,
                UserBookId = item.UserBookId,
                Price = item.UserBook.Price,
                bookCondition = item.UserBook.BookCondition,
                SellerPayMethods = paymethods,
                SellerDeliveryMethods = deliveryMethods,
                UserBookStatus = item.UserBook.UserBookStatus,
                SellerAccountId = item.UserBook.AppUser!.AccountId,
                Book = item.UserBook.ToUserBookSummaryDto()
            };
        }
        public static CartDto ToCartDtoFromCart(this Cart cart)
        {
            return new CartDto
            {
                Id = cart.Id,
                CreatedAt = cart.CreatedAt,
                AccountId = cart.AccountId,
                CartItems = cart.CartItems
                            .Select(c => c.ToCartItemListingFromCartItem()).ToList()
            };
        }

        public static CartItem ToCartItemFromItemDto(this CartItemDto dto)
        {
            return new CartItem
            {
                UserBookId = dto.UserBookId
            };
        }

        public static OrderItem ToOrderItemFromCartItem(this CartItem cartItem)
        {
            var ub = cartItem.UserBook!;
            var book = ub.Book!;

            var orderItem = new OrderItem
            {
                UserBookId = ub.Id,

                BookTitleSnapshot = book.Title,
                BookIsbnSnapshot = book.ISBN,
                BookAuthorSnapshot = book.Author,

                BookConditionSnapshot = ub.BookCondition,
                Price = ub.Price,

                BuyerPayMethodSnapshot = PayMethod.Undefined,
                BuyerDeliveryMethodSnapshot = DeliveryMethod.Undefined,

                SellerAccountIdSnapshot = ub.AppUser!.AccountId
            };
            return orderItem;
        }
    }
}