using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.UserBook;
using backend.Enums;
using backend.Model;

namespace backend.Dto.Book
{
    public class UserBookListinDetailDto
    {
        public int UserBookId { get; set; }
        public BookCondition bookCondition { get; set; }
        public List<PayMethod> SellerPayMethods { get; set; } = new List<PayMethod>();
        public List<DeliveryMethod> SellerDeliveryMethods { get; set; } = new List<DeliveryMethod>();
        public int Price { get; set; }
        public UserBookStatus UserBookStatus { get; set; }
        public DateTime CreatedAt { get; set; }
        public string SellerAccountId { get; set; } = string.Empty;

        // 書的細節
        public UserBookSummaryDto Book { get; set; } = null!;
    }
}