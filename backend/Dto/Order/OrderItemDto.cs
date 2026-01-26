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
        public int Price { get; set; }
        public int OrderId { get; set; }  // FK
        public BookCondition bookCondition { get; set; }
        public List<PayMethod> SellerPayMethods { get; set; } = new List<PayMethod>();
        public List<DeliveryMethod> SellerDeliveryMethods { get; set; } = new List<DeliveryMethod>();
        public PayMethod BuyerPayMethod { get; set; }
        public DeliveryMethod BuyerDeliveryMethod { get; set; }
        public UserBookStatus UserBookStatus { get; set; }
        public DateTime CreatedAt { get; set; }
        
        public string SellerAccountId { get; set; } = string.Empty;
        public int UserId { get; set; }  

        // 書的細節
        public UserBookSummaryDto Book { get; set; } = null!;
    }
}