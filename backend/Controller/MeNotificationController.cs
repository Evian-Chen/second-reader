using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Notification;
using backend.Enums;
using backend.Interface;
using backend.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controller
{
    [Route("/api/me/notification")]
    [ApiController]
    public class MeNotificationController : ControllerBase
    {
        private readonly IMeNotificationRepository _notiRepo;
        public MeNotificationController(IMeNotificationRepository notiRepo)
        {
            _notiRepo = notiRepo;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<List<NotificationDto>>> GetNotification([FromQuery] bool UnReadOnly)
        {
            // 取得通知（篩選未讀或不篩選拿全部）
            if (!ModelState.IsValid) return BadRequest();

            var user = HttpContext.Items["AppUser"] as AppUser ?? throw new UnauthorizedAccessException();
            var notifications = await _notiRepo.GetNotificationAsync(UnReadOnly, user);
            if (notifications == null) return NotFound();
            return Ok(notifications);
        }

        [HttpGet("{id:int}")]
        [Authorize]
        public async Task<ActionResult<NotificationDto>> GetNotificationById([FromRoute] int id)
        {
            if (!ModelState.IsValid) return BadRequest();
            // 取得特定一筆通知，並且將其改成已讀 
            var user = HttpContext.Items["AppUser"] as AppUser ?? throw new UnauthorizedAccessException();
            var notification = await _notiRepo.GetNotificationByIdAsync(user, id);
            if (notification == null) return NotFound();
            return Ok(notification);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<NotificationDto>> CreateNotification([FromQuery] NotificationType notificationType, int orderId, int? userBookId)
        {
            // 建立一筆站內通知, /api/me/notification?notificationType=OrderCreated&orderId=1&userBookId=
            // 在 MeCartRepo 的 CreateOrderAsync 在建立 order 的同時也會寄出通知（automic）
            if (!ModelState.IsValid) return BadRequest();

            var user = HttpContext.Items["AppUser"] as AppUser ?? throw new UnauthorizedAccessException();
            var _ = await _notiRepo.CreateNotificationAsync(notificationType, user, orderId, userBookId);
            return StatusCode(204);
        }
    }
}