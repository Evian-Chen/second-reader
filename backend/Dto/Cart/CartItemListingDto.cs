using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Book;
using backend.Dto.UserBook;
using backend.Enums;

namespace backend.Dto.Cart
{
    public class CartItemListingDto
    {
        public Guid CartId { get; set; }
        public Guid UserBookId { get; set; }
        public int Price { get; set; }
        public BookCondition bookCondition { get; set; }
        public List<PayMethod> SellerPayMethods { get; set; } = new List<PayMethod>();
        public List<DeliveryMethod> SellerDeliveryMethods { get; set; } = new List<DeliveryMethod>();
        public PayMethod BuyerPayMethod { get; set; }
        public DeliveryMethod BuyerDeliveryMethod { get; set; }
        public UserBookStatus UserBookStatus { get; set; }

        public string SellerAccountId { get; set; } = string.Empty;

        // 書的細節
        public UserBookSummaryDto Book { get; set; } = null!;
    }
}