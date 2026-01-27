using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using backend.Enums;

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

        // ===== snapshot 欄位 =====
        public string BookTitleSnapshot { get; set; } = string.Empty;
        public string BookIsbnSnapshot { get; set; } = string.Empty;
        public string BookAuthorSnapshot { get; set; } = string.Empty;

        public BookCondition BookConditionSnapshot { get; set; }

        public PayMethod BuyerPayMethodSnapshot { get; set; }
        public DeliveryMethod BuyerDeliveryMethodSnapshot { get; set; }

        public string SellerAccountIdSnapshot { get; set; } = string.Empty;
    }
}