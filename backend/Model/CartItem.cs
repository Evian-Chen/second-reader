using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using backend.Enums;

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
        public DateTime CreatedAt { get; set; } = DateTime.Now;  // 用來檢查排隊的次序

        // 過期，防止有人佔用商品
        public DateTime ExperiedAt { get; set; }
        public DateTime LockedAt { get; set; }
    }
}