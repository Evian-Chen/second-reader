using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Model
{
    [Table("Cart")]
    public class Cart
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public string AccountId { get; set; } = string.Empty;
        public AppUser? AppUser { get; set; }
        public List<CartItem> CartItems { get; set; } = new List<CartItem>();
    }
}