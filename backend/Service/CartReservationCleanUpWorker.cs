using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dto.Cart;
using backend.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Service
{
    public class CartReservationCleanUpWorker : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<CartReservationCleanUpWorker> _logger;
        public CartReservationCleanUpWorker(IServiceScopeFactory scopeFactory, ILogger<CartReservationCleanUpWorker> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var timer = new PeriodicTimer(TimeSpan.FromMinutes(10));  // 10分鐘跑一次

            while (await timer.WaitForNextTickAsync(stoppingToken))
            {
                try
                {
                    using var scope = _scopeFactory.CreateScope();
                    var _context = scope.ServiceProvider.GetRequiredService<ApplicationDBContext>();
                    var _notiRepo = scope.ServiceProvider.GetRequiredService<IMeNotificationRepository>();
                    var _cartRepo = scope.ServiceProvider.GetRequiredService<IMeCartRepository>();

                    using var tx = await _context.Database.BeginTransactionAsync(stoppingToken);

                    var now = DateTime.UtcNow;

                    var expiredItems = await _context.CartItems.Include(c => c.UserBook)
                                                                .Include(c => c.Cart).ThenInclude(ci => ci.AppUser)
                                                                .Where(ci => ci.UserBook!.UserBookStatus == Enums.UserBookStatus.Reserved && ci.ExpiredAt < now)
                                                                .ToListAsync(stoppingToken);
                    if (expiredItems.Count == 0) continue;

                    foreach (var item in expiredItems)
                    {
                        // 找出排隊這本書的下一個遞補
                        var waitlist = await _context.Waitlists.Include(w => w.AppUser)
                                                                .Where(w => w.UserBookId == item.UserBookId && w.WaitlistStatus == Enums.WaitlistStatus.Waiting)
                                                                .OrderBy(w => w.CreatedAt).FirstOrDefaultAsync(stoppingToken);
                        if (waitlist == null) continue;

                        // 1. 通知前買家和遞補的人
                        // 2. 移除前買家的購物車
                        // 3. 加入遞補人的購物車
                        await _notiRepo.CreateWaitlistAcceptedAsync(waitlist.AppUser!, waitlist.UserBookId);
                        await _notiRepo.CreateCartItemExpiredAsync(item.Cart!.AppUser!, item.UserBookId);
                        _context.CartItems.Remove(item);
                        await _cartRepo.AddItemToCartByIdAsync(waitlist.AppUser!, waitlist.UserBookId);
                        waitlist.WaitlistStatus = Enums.WaitlistStatus.Accepted;
                    }

                    await _context.SaveChangesAsync(stoppingToken);
                    await tx.CommitAsync(stoppingToken);
                }
                catch (OperationCanceledException) { }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "CartReservationCleanUpWorker failed.");
                }
            }
        }
    }
}