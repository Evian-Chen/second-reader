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
        public MeNotificationRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<NotificationDto> CreateNotificationAsync(NotificationType notificationType, AppUser user, int orderId, int? userBookId)
        {
            NotificationDto notification;
            switch (notificationType)
            {
                case NotificationType.OrderCreated:
                    notification = await CreateOrderCreatedAsync(user, orderId);
                    break;

                case NotificationType.OrderRequest:
                    if (userBookId == null) throw new InvalidOperationException("When creating order request notification, userBookId is required.");
                    notification = await CreateOrderRequestAsync(user, userBookId);
                    break;

                case NotificationType.OrderRejected:
                    if (userBookId == null) throw new InvalidOperationException("When creating order rejected notification, userBookId is required.");
                    notification = await CreateOrderRejectedAsync(user, userBookId);
                    break;

                case NotificationType.OrderAccepted:
                    if (userBookId == null) throw new InvalidOperationException("When creating order accepted notification, userBookId is required.");
                    notification = await CreateOrderAcceptedAsync(user, userBookId);
                    break;

                case NotificationType.WaitlistAccepted:
                    if (userBookId == null) throw new InvalidOperationException("When creating waitlist accepted notification, userBookId is required.");
                    notification = await CreateWaitlistAcceptedAsync(user, userBookId);
                    break;

                case NotificationType.WaitlistCanceled:
                    if (userBookId == null) throw new InvalidOperationException("When creating waitlist canceled notification, userBookId is required.");
                    notification = await CreateWaitlistCanceledAsync(user, userBookId);
                    break;

                default:
                    throw new InvalidOperationException();
            }
            return notification;
        }

        public async Task<NotificationDto> CreateOrderAcceptedAsync(AppUser user, int? userBookId)
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
            await _context.SaveChangesAsync();
            return created.Entity.ToDtoFromModel();
        }

        public async Task<NotificationDto> CreateOrderCompletedAsync(AppUser user, int? userBookId)
        {
            var book = await _context.UserBooks.Include(b => b.Book).Include(b => b.AppUser).FirstOrDefaultAsync(b => b.Id == userBookId);
            var content = $"您向 {book.AppUser!.AccountId} 訂購的書《{book!.Book!.Title}》已交付成功！";

            var notification = new Notification
            {
                Title = Util.Literals.OrderCompletedTitle,
                Content = content,
                ReceiverAccountId = user.AccountId,
                ActorAccountId = Util.Accounts.System,
                NotificationType = NotificationType.OrderCompleted
            };
            var created = await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();
            return created.Entity.ToDtoFromModel();
        }

        public async Task<NotificationDto> CreateOrderCreatedAsync(AppUser user, int orderId)
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
            await _context.SaveChangesAsync();
            return created.Entity.ToDtoFromModel();
        }

        public async Task<NotificationDto> CreateOrderRejectedAsync(AppUser user, int? userBookId)
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
            await _context.SaveChangesAsync();
            return created.Entity.ToDtoFromModel();
        }

        public async Task<NotificationDto> CreateOrderRequestAsync(AppUser user, int? userBookId)
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
            await _context.SaveChangesAsync();
            return created.Entity.ToDtoFromModel();
        }

        public Task<NotificationDto> CreateWaitlistAcceptedAsync(AppUser user, int? userBookId)
        {
            throw new NotImplementedException();
        }

        public Task<NotificationDto> CreateWaitlistCanceledAsync(AppUser user, int? userBookId)
        {
            throw new NotImplementedException();
        }

        public async Task<List<NotificationDto>?> GetNotificationAsync(bool unReadOnly, AppUser user)
        {
            var notifications = _context.Notifications.Where(n => n.ReceiverAccountId == user.AccountId).AsQueryable();
            if (notifications == null) return null;
            if (unReadOnly) notifications = notifications.Where(n => n.UnRead == unReadOnly);
            var result = await notifications.ToListAsync();
            return [.. result.Select(n => n.ToDtoFromModel())];
        }

        public async Task<NotificationDto?> GetNotificationByIdAsync(AppUser user, int id)
        {
            var notification = await _context.Notifications.FirstOrDefaultAsync(c => c.Id == id && c.ReceiverAccountId == user.AccountId);
            if (notification == null) return null;
            notification.UnRead = false;
            notification.ReadAt = DateTime.Now;
            await _context.SaveChangesAsync();
            return notification.ToDtoFromModel();
        }
    }
}