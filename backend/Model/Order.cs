using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using backend.Enums;

namespace backend.Model
{
    [Table("Order")]
    public class Order
    {
        public int Id { get; set; }
        public OrderStatus OrderStatus { get; set; }
        public int TotalAmount { get; set; } = 0;
        public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public int BuyerId { get; set; }
        public AppUser? Buyer { get; set; }
    }
}