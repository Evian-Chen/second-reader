using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Notification;
using backend.Model;

namespace backend.Mapper
{
    public static class NotificationMapper
    {
        public static NotificationDto ToDtoFromModel(this Notification notification)
        {
            return new NotificationDto
            {
                Title = notification.Title,
                Content = notification.Content,
                ReceiverAccountId = notification.ReceiverAccountId,
                ActorAccountId = notification.ActorAccountId,
                NotificationType = notification.NotificationType,
                CreatedAt = notification.CreatedAt,
                ReadAt = notification.ReadAt,
                UnRead = notification.UnRead
            };
        }
    }
}