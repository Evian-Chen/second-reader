using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Model;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> dbContextOptions) : base(dbContextOptions)
        {

        }
        public DbSet<AppUser> AppUsers => Set<AppUser>();

        public DbSet<Book> Books { get; set; }
        public DbSet<UserBook> UserBooks { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<ReadingPost> ReadingPosts { get; set; }
        public DbSet<Waitlist> Waitlists { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<AppUser>()
                .HasIndex(x => x.AccountId).IsUnique();

            builder.Entity<AppUser>()
                .HasIndex(x => x.Email).IsUnique();


            builder.Entity<UserBookPayMethod>()
                .HasKey(x => new { x.UserBookId, x.PayMethod });

            builder.Entity<UserBookDeliveryMethod>()
                .HasKey(x => new { x.UserBookId, x.DeliveryMethod });

            builder.Entity<Order>()
                .HasOne(o => o.Buyer)                   // 只有一個 buyer
                .WithMany()                             // buyer 可以有很多 order
                .HasForeignKey(o => o.BuyerId)          // FK 
                .OnDelete(DeleteBehavior.Restrict);     // 刪掉 buyer 的時候不能連帶刪掉 order

            // 配置 AppUser 和 UserProfile 之間的一對一關係，刪一個一起刪
            builder.Entity<AppUser>()
                .HasOne(a => a.UserProfile)
                .WithOne(u => u.AppUser)
                .HasForeignKey<UserProfile>(u => u.UserId)
                .HasPrincipalKey<AppUser>(a => a.Id)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<CartItem>()
                .HasOne(ci => ci.Cart)
                .WithMany(c => c.CartItems)
                .HasForeignKey(ci => ci.CartId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<CartItem>()
                .HasOne(ci => ci.UserBook)
                .WithMany()
                .HasForeignKey(ci => ci.UserBookId)
                .OnDelete(DeleteBehavior.NoAction);  // userbook 被刪掉時擁有該書的 cartItem 不會一起刪

            builder.Entity<UserBook>()
                .HasOne(ub => ub.Book)
                .WithMany()
                .HasForeignKey(ub => ub.BookId)
                .OnDelete(DeleteBehavior.NoAction);


            // 同一個 UserBook 只能被加入 Cart 一次:不可以從同個賣家加入兩本 UserBookId 一樣的書
            builder.Entity<CartItem>()
                .HasIndex(ci => new { ci.CartId, ci.UserBookId })
                .IsUnique();

            //  waitlist 會對應到一個 AppUser 作為 FK
            builder.Entity<Waitlist>()
                .HasOne(w => w.AppUser)
                .WithMany()
                .HasForeignKey(w => w.WaiterId);

            // TODO: 可用 HasIndex 建立複合索引，加速查詢
            // example:
            // builder.Entity<UserBook>()
            //     .HasIndex(ub => new { ub.AccountId, ub.UserBookStatus });
        }
    }
}