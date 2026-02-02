using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dto.Cart
{
    public class CartDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public string AccountId { get; set; } = string.Empty;

        public List<CartItemListingDto> CartItems { get; set; } = new List<CartItemListingDto>();
    }
}