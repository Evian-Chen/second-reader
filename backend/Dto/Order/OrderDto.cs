using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using backend.Model;

namespace backend.Dto.Order
{
    public class OrderDto
    {
        public Guid OrderId { get; set; }
        [Required]
        public List<OrderItemDto> OrderItems { get; set; } = new List<OrderItemDto>();
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}