using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dto.Notification;
using backend.Enums;
using backend.Interface;
using backend.Mapper;
using backend.Model;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class MeNotificationRepository : IMeNotificationRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly ILogger<MeNotificationRepository> _logger;
        public MeNotificationRepository(ApplicationDBContext context, ILogger<MeNotificationRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<NotificationDto> CompleteOrderItemFromBuyerAsync(AppUser user, Guid? userBookId)
        {
            // 買家按確認收到，發送訊息給賣家
            var book = await _context.UserBooks.Include(b => b.Book).Include(b => b.AppUser).FirstOrDefaultAsync(b => b.Id == userBookId);
            var content = $"買家已確認收到書籍《{book!.Book!.Title}》。";

            var notification = new Notification
            {
                Title = Util.Literals.OrderCompletedByBuyerTitle,
                Content = content,
                ReceiverAccountId = book.AppUser!.AccountId,
                ActorAccountId = Util.Accounts.System,
                NotificationType = NotificationType.OrderCompletedByBuyer
            };
            var created = await _context.Notifications.AddAsync(notification);
            return created.Entity.ToDtoFromModel();
        }

        public async Task<NotificationDto> CreateCartItemExpiredAsync(AppUser user, Guid? userBookId)
        {
            var book = await _context.UserBooks.Include(b => b.Book).Include(b => b.AppUser).FirstOrDefaultAsync(b => b.Id == userBookId);
            var content = $"您放在購物車的書《{book!.Book!.Title}》逾期未結帳，已遞補給下一位排隊的使用者。";

            var notification = new Notification
            {
                Title = Util.Literals.CartItemExpiredTitle,
                Content = content,
                ReceiverAccountId = user.AccountId,
                ActorAccountId = Util.Accounts.System,
                NotificationType = NotificationType.CartItemExpired
            };
            var created = await _context.Notifications.AddAsync(notification);
            return created.Entity.ToDtoFromModel();
        }

        public async Task<NotificationDto> CreateOrderAcceptedAsync(AppUser user, Guid? userBookId)
        {
            var book = await _context.UserBooks.Include(b => b.Book).Include(b => b.AppUser).FirstOrDefaultAsync(b => b.Id == userBookId);
            var content = $"您訂購的書《{book!.Book!.Title}》已被賣家 {book.AppUser!.AccountId} 接受。";

            var notification = new Notification
            {
                Title = Util.Literals.OrderAcceptedTitle,
                Content = content,
                ReceiverAccountId = user.AccountId,
                ActorAccountId = Util.Accounts.System,
                NotificationType = NotificationType.OrderAccepted
            };
            var created = await _context.Notifications.AddAsync(notification);
            return created.Entity.ToDtoFromModel();
        }

        public async Task<NotificationDto> CompleteOrderItemFromSellerAsync(AppUser user, Guid? userBookId)
        {
            var book = await _context.UserBooks.Include(b => b.Book).Include(b => b.AppUser).FirstOrDefaultAsync(b => b.Id == userBookId);
            var content = $"您向 {book!.AppUser!.AccountId} 訂購的書《{book!.Book!.Title}》賣家已出貨。";

            var notification = new Notification
            {
                Title = Util.Literals.OrderCompletedBySellerTitle,
                Content = content,
                ReceiverAccountId = user.AccountId,
                ActorAccountId = Util.Accounts.System,
                NotificationType = NotificationType.OrderCompletedBySeller
            };
            var created = await _context.Notifications.AddAsync(notification);
            return created.Entity.ToDtoFromModel();
        }

        public async Task<NotificationDto> CreateOrderCreatedAsync(AppUser user, Guid? orderId)
        {
            var order = await _context.Orders.Include(o => o.OrderItems).ThenInclude(oi => oi.UserBook).ThenInclude(ub => ub.Book).FirstOrDefaultAsync(o => o.Id == orderId);
            if (order == null) throw new InvalidCastException("Order not exists, can not send notification.");
            var orderBooksName = order.OrderItems.Select(o => o.UserBook!.Book!.Title).ToList();
            var content = $"您的訂單已成立。您訂購的書單如下：{string.Join("、", orderBooksName)}";

            var notification = new Notification
            {
                Title = Util.Literals.OrderCreatedTitle,
                Content = content,
                ReceiverAccountId = user.AccountId,
                ActorAccountId = Util.Accounts.System,
                NotificationType = NotificationType.OrderCreated
            };
            var created = await _context.Notifications.AddAsync(notification);
            return created.Entity.ToDtoFromModel();
        }

        public async Task<NotificationDto> CreateOrderRejectedAsync(AppUser user, Guid? userBookId)
        {
            var book = await _context.UserBooks.Include(b => b.Book).Include(b => b.AppUser).FirstOrDefaultAsync(b => b.Id == userBookId);
            var content = $"您訂購的書《{book!.Book!.Title}》已被賣家 {book.AppUser!.AccountId} 拒絕。";

            var notification = new Notification
            {
                Title = Util.Literals.OrderRejectedTitle,
                Content = content,
                ReceiverAccountId = user.AccountId,
                ActorAccountId = Util.Accounts.System,
                NotificationType = NotificationType.OrderRejected
            };
            var created = await _context.Notifications.AddAsync(notification);
            return created.Entity.ToDtoFromModel();
        }

        public async Task<NotificationDto> CreateOrderRequestAsync(AppUser user, Guid? userBookId)
        {
            var book = await _context.UserBooks.Include(b => b.Book).Include(b => b.AppUser).FirstOrDefaultAsync(b => b.Id == userBookId);
            var content = $"您的上架書籍《{book!.Book!.Title}》已被下單！請盡速前往訂單管理中心確認。";

            var notification = new Notification
            {
                Title = Util.Literals.OrderRequestTitle,
                Content = content,
                ReceiverAccountId = book.AppUser!.AccountId,
                ActorAccountId = Util.Accounts.System,
                NotificationType = NotificationType.OrderRequest
            };
            var created = await _context.Notifications.AddAsync(notification);
            return created.Entity.ToDtoFromModel();
        }

        public async Task<NotificationDto> CreateWaitlistAcceptedAsync(AppUser user, Guid? userBookId)
        {
            var book = await _context.UserBooks.Include(b => b.Book).Include(b => b.AppUser).FirstOrDefaultAsync(b => b.Id == userBookId);
            var content = $"您排隊的書籍《{book!.Book!.Title}》已確認！已加入購物車中，請於三日內確認下單，逾期將會遞補給下一位等候者。";

            var notification = new Notification
            {
                Title = Util.Literals.WaitlistAccepted,
                Content = content,
                ReceiverAccountId = user.AccountId,
                ActorAccountId = Util.Accounts.System,
                NotificationType = NotificationType.WaitlistAccepted
            };
            var created = await _context.Notifications.AddAsync(notification);
            return created.Entity.ToDtoFromModel();
        }

        public async Task<NotificationDto> CreateWaitlistCanceledAsync(AppUser user, Guid? userBookId)
        {
            var book = await _context.UserBooks.Include(b => b.Book).Include(b => b.AppUser).FirstOrDefaultAsync(b => b.Id == userBookId);
            var content = $"您排隊的書籍《{book!.Book!.Title}》已不再架上，因此已取消您的排隊。";

            var notification = new Notification
            {
                Title = Util.Literals.WaitlistCanceled,
                Content = content,
                ReceiverAccountId = book.AppUser!.AccountId,
                ActorAccountId = Util.Accounts.System,
                NotificationType = NotificationType.WaitlistCanceled
            };
            var created = await _context.Notifications.AddAsync(notification);
            return created.Entity.ToDtoFromModel();
        }

        public async Task<List<NotificationDto>?> GetNotificationAsync(bool unReadOnly, AppUser user)
        {
            var notifications = _context.Notifications.Where(n => n.ReceiverAccountId == user.AccountId).AsQueryable();
            if (notifications == null) return null;
            if (unReadOnly) notifications = notifications.Where(n => n.UnRead == unReadOnly);
            var result = await notifications.ToListAsync();
            return [.. result.Select(n => n.ToDtoFromModel())];
        }

        public async Task<NotificationDto?> GetNotificationByIdAsync(AppUser user, Guid id)
        {
            var notification = await _context.Notifications.FirstOrDefaultAsync(c => c.Id == id && c.ReceiverAccountId == user.AccountId);
            if (notification == null) return null;
            notification.UnRead = false;
            notification.ReadAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return notification.ToDtoFromModel();
        }

        public async Task ReadAllAsync(AppUser user)
        {
            try
            {
                var models = _context.Notifications.Where(n => n.ReceiverAccountId == user.AccountId).AsQueryable();
                foreach (var m in models)
                {
                    m.UnRead = false;
                    m.ReadAt = DateTime.UtcNow;
                }
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw;
            }

        }

        public async Task<NotificationDto> CreateWelcomeMessageAsync(AppUser user)
        {
            var notification = new Notification
            {
                Title = Util.Literals.WelcomeMsg,
                Content = "歡迎您加入黑白冊，一起來分享您對書本的想法，以及買賣書籍吧！",
                ReceiverAccountId = user.AccountId,
                ActorAccountId = Util.Accounts.System,
                NotificationType = NotificationType.WelcomeMsg
            };
            var created = await _context.Notifications.AddAsync(notification);
            return created.Entity.ToDtoFromModel();
        }

        public async Task<NotificationDto> InformPostCreaterNewCommentAsync(AppUser user, Guid postId)
        {
            var post = await _context.ReadingPosts.Include(c => c.AppUser).FirstOrDefaultAsync(c => c.Id == postId)
                            ?? throw new InvalidOperationException("No such root comment.");
            var content = $"{user.AccountId} 在您的貼文底下留言囉！";

            var notification = new Notification
            {
                Title = Util.Literals.InformPostCreaterNewCommentTitle,
                Content = content,
                ReceiverAccountId = post.AppUser!.AccountId,
                ActorAccountId = Util.Accounts.System,
                NotificationType = NotificationType.InformPostCreaterNewComment
            };
            var created = await _context.Notifications.AddAsync(notification);
            return created.Entity.ToDtoFromModel();
        }

        public async Task<NotificationDto> InformCommentCreaterNewCommentAsync(AppUser user, Guid rootCommentId)
        {
            var comment = await _context.Comments.Include(c => c.Author).FirstOrDefaultAsync(c => c.Id == rootCommentId)
                            ?? throw new InvalidOperationException("No such root comment.");
            var content = $"{user.AccountId} 回覆您的留言！";

            var notification = new Notification
            {
                Title = Util.Literals.InformRootCommentCreaterNewCommentTitle,
                Content = content,
                ReceiverAccountId = comment.Author.AccountId,
                ActorAccountId = Util.Accounts.System,
                NotificationType = NotificationType.InformRootCommentCreaterNewComment
            };
            var created = await _context.Notifications.AddAsync(notification);
            return created.Entity.ToDtoFromModel();
        }
    }
}