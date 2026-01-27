using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Enums;

namespace backend.Dto.Order
{
    public class CheckoutCartDto
    {
        public Dictionary<int, Methods> BookMethodsPair { get; set; } = new Dictionary<int, Methods>();
    }

    public class Methods
    {
        public PayMethod PaymentMethod { get; set; }
        public DeliveryMethod DeliveryMethod { get; set; }
    }
}