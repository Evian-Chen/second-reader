using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Enums;

namespace backend.Model
{
    public class UserBook
    {
        public int Id { get; set; }
        public BookCondition BookCondition { get; set; }
        public ICollection<UserBookPayMethod> SellerPayMethods { get; set; } = new List<UserBookPayMethod>();
        public ICollection<UserBookDeliveryMethod> SellerDeliveryMethods { get; set; } = new List<UserBookDeliveryMethod>();
        public PayMethod BuyerPayMethod { get; set; }
        public DeliveryMethod BuyerDeliveryMethod { get; set; }
        public int Price { get; set; } = 0;
        public UserBookStatus UserBookStatus { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;


        public string AccountId { get; set; } = string.Empty;  // FK
        public AppUser? AppUser { get; set; }
        public int BookId { get; set; }  // FK
        public Book? Book { get; set; }
    }

    public class UserBookPayMethod
    {
        public int UserBookId { get; set; }  // FK
        public UserBook? UserBook { get; set; }

        public PayMethod PayMethod { get; set; }
    }

    public class UserBookDeliveryMethod
    {
        public int UserBookId { get; set; }  // FK
        public UserBook? UserBook { get; set; }

        public DeliveryMethod DeliveryMethod { get; set; }
    }
}