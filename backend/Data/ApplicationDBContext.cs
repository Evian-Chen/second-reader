using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Model;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class ApplicationDBContext : IdentityDbContext<AppUser>
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> dbContextOptions) : base(dbContextOptions)
        {

        }

        public DbSet<Book> Books { get; set; }
        public DbSet<UserBook> UserBooks { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<ReadingPost> ReadingPosts { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<UserBookPayMethod>()
                .HasKey(x => new { x.UserBookId, x.PayMethod });

            builder.Entity<UserBookDeliveryMethod>()
                .HasKey(x => new { x.UserBookId, x.DeliveryMethod });

            builder.Entity<Order>()
                .HasOne(o => o.Buyer)                   // 只有一個 buyer
                .WithMany()                             // buyer 可以有很多 order
                .HasForeignKey(o => o.BuyerAccountId)   // FK > BuyerAccountId
                .OnDelete(DeleteBehavior.Restrict);     // 刪掉 buyer 的時候不能連帶刪掉 order

            builder.Entity<Order>()
                .HasOne(o => o.Seller)
                .WithMany()
                .HasForeignKey(o => o.SellerAccountId)
                .OnDelete(DeleteBehavior.Restrict);

            // 同一個 UserBook 只能被加入 Cart 一次:不可以從同個賣家加入兩本 UserBookId 一樣的書
            builder.Entity<CartItem>()
                .HasIndex(ci => new { ci.CartId, ci.UserBookId })
                .IsUnique();

            // TODO: 可用 HasIndex 建立複合索引，加速查詢
            // example:
            // builder.Entity<UserBook>()
            //     .HasIndex(ub => new { ub.AccountId, ub.UserBookStatus });
        }
    }
}