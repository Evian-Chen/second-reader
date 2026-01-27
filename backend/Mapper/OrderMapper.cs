using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Order;
using backend.Model;

namespace backend.Mapper
{
    public static class OrderMapper
    {
        public static OrderItemDto ToOrderItemDtoFromOrderItem(this OrderItem item)
        {
            return new OrderItemDto
            {
                Id = item.Id,
                OrderId = item.OrderId,

                Price = item.Price,
                BookCondition = item.BookConditionSnapshot,
                BuyerPayMethod = item.BuyerPayMethodSnapshot,
                BuyerDeliveryMethod = item.BuyerDeliveryMethodSnapshot,
                SellerAccountId = item.SellerAccountIdSnapshot,

                BookTitle = item.BookTitleSnapshot,
                BookISBN = item.BookIsbnSnapshot,
                BookAuthor = item.BookAuthorSnapshot,
            };
        }

        public static OrderDto ToOrderDtoFromOrder(this Order order)
        {
            return new OrderDto
            {
                OrderItems = order.OrderItems.Select(o => o.ToOrderItemDtoFromOrderItem()).ToList(),
                CreatedAt = order.CreatedAt
            };
        }
    }
}
