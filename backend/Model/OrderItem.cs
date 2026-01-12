using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Model
{
    [Table("OrderItem")]
    public class OrderItem
    {
        public int Id { get; set; }
        public int Price { get; set; }

        public int OrderId { get; set; }  // FK
        public Order? Order { get; set; }
        public int UserBookId { get; set; }  // FK
        public UserBook? UserBook { get; set; }
    }
}