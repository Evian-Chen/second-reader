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
        Task<NotificationDto?> GetNotificationById(int id);
        Task<NotificationDto> CreateNotificationAsync(NotificationType notificationType, AppUser user, int orderId, int? userBookId);
        Task<NotificationDto> CreateOrderCreatedAsync(AppUser user, int orderId);
        Task<NotificationDto> CreateOrderRequestAsync(AppUser user, int? userBookId);
        Task<NotificationDto> CreateOrderRejectedAsync(AppUser user, int? userBookId);
        Task<NotificationDto> CreateOrderAcceptedAsync(AppUser user, int? userBookId);
        Task<NotificationDto> CreateWaitlistAcceptedAsync(AppUser user, int? userBookId);
        Task<NotificationDto> CreateWaitlistCanceledAsync(AppUser user, int? userBookId);
    }
}