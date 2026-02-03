using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using backend.Enums;

namespace backend.Model
{
    [Table("UserBook")]
    public class UserBook
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public BookCondition BookCondition { get; set; }
        public ICollection<UserBookPayMethod> SellerPayMethods { get; set; } = new List<UserBookPayMethod>();
        public ICollection<UserBookDeliveryMethod> SellerDeliveryMethods { get; set; } = new List<UserBookDeliveryMethod>();
        public int Price { get; set; } = 0;
        public UserBookStatus UserBookStatus { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public Guid UserId { get; set; }  // FK
        public AppUser? AppUser { get; set; }
        public Guid BookId { get; set; }  // FK
        public Book? Book { get; set; }
        public Guid? OrderId { get; set; }  // FK
        public Order? Order { get; set; }
    }

    public class UserBookPayMethod
    {
        public Guid UserBookId { get; set; }  // FK
        public UserBook? UserBook { get; set; }

        public PayMethod PayMethod { get; set; }
    }

    public class UserBookDeliveryMethod
    {
        public Guid UserBookId { get; set; }  // FK
        public UserBook? UserBook { get; set; }

        public DeliveryMethod DeliveryMethod { get; set; }
    }
}