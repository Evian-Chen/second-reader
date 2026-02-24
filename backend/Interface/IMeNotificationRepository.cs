using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Notification;
using backend.Enums;
using backend.Model;
using Microsoft.AspNetCore.Http.Metadata;

namespace backend.Interface
{
    public interface IMeNotificationRepository
    {
        Task<List<NotificationDto>?> GetNotificationAsync(bool unReadOnly, AppUser user);
        Task<NotificationDto?> GetNotificationByIdAsync(AppUser user, Guid id);
        Task<NotificationDto> CreateOrderCreatedAsync(AppUser user, Guid? orderId);
        Task<NotificationDto> CreateOrderRequestAsync(AppUser user, Guid? userBookId);
        Task<NotificationDto> CreateOrderRejectedAsync(AppUser user, Guid? userBookId);
        Task<NotificationDto> CreateOrderAcceptedAsync(AppUser user, Guid? userBookId);
        Task<NotificationDto> CompleteOrderItemFromSellerAsync(AppUser user, Guid? userBookId);
        Task<NotificationDto> CreateWaitlistAcceptedAsync(AppUser user, Guid? userBookId);
        Task<NotificationDto> CreateWaitlistCanceledAsync(AppUser user, Guid? userBookId);
        Task<NotificationDto> CreateCartItemExpiredAsync(AppUser user, Guid? userBookId);
        Task<NotificationDto> CompleteOrderItemFromBuyerAsync(AppUser user, Guid? userBookId);
        Task<NotificationDto> CreateWelcomeMessageAsync(AppUser user);
        Task ReadAllAsync(AppUser user);
    }
}