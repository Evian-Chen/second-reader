using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.UserBook;
using backend.Enums;

namespace backend.Dto.Order
{
    public class OrderItemDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }

        // snapshot
        public int Price { get; set; }
        public BookCondition BookCondition { get; set; }
        public PayMethod BuyerPayMethod { get; set; }
        public DeliveryMethod BuyerDeliveryMethod { get; set; }
        public string SellerAccountId { get; set; } = string.Empty;

        public string BookTitle { get; set; } = string.Empty;
        public string BookISBN { get; set; } = string.Empty;
        public string BookAuthor { get; set; } = string.Empty;
    }
}
