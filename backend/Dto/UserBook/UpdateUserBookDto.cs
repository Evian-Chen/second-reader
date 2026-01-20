using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Enums;

namespace backend.Dto.UserBook
{
    public class UpdateUserBookDto
    {
        public BookCondition bookCondition { get; set; }
        public List<PayMethod> SellerPayMethods { get; set; } = new List<PayMethod>();
        public List<DeliveryMethod> SellerDeliveryMethods { get; set; } = new List<DeliveryMethod>();
        public int Price { get; set; }
        public UserBookStatus UserBookStatus { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}