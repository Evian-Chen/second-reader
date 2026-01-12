using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Model
{
    [Table("CartItem")]
    public class CartItem
    {
        public int Id { get; set; }
        public int CartId { get; set; }  // FK
        public Cart? Cart { get; set; }
        public int UserBookId { get; set; }  // FK
        public UserBook? UserBook { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}