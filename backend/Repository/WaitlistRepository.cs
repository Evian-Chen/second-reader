using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dto.Cart;
using backend.Dto.Me;
using backend.Interface;
using backend.Mapper;
using backend.Model;
using Clerk.BackendAPI;
using Clerk.BackendAPI.Models.Components;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class WaitlistRepository : IWaitlistRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly IMeNotificationRepository _notiRepo;
        private readonly IMeCartRepository _cartRepo;
        public WaitlistRepository(ApplicationDBContext context, IMeNotificationRepository notiRepo, IMeCartRepository cartRepo)
        {
            _context = context;
            _notiRepo = notiRepo;
            _cartRepo = cartRepo;
        }

        public async Task<Waitlist?> AddOrRemoveWaitlistAsync(Guid userBookId, bool addToWaitlist, AppUser user)
        {
            Waitlist? existing;
            existing = await _context.Waitlists.FirstOrDefaultAsync(w => w.UserBookId == userBookId && w.AppUser!.AccountId == user.AccountId);
            if (addToWaitlist)
            {
                // 加入等待清單 
                if (existing != null && existing.WaitlistStatus == Enums.WaitlistStatus.Waiting) throw new InvalidOperationException("User is already waiting");
                else if (existing != null && existing.WaitlistStatus == Enums.WaitlistStatus.Rejected) throw new InvalidOperationException("User is rejected");
                else if (existing != null && existing.WaitlistStatus == Enums.WaitlistStatus.Canceled) existing.WaitlistStatus = Enums.WaitlistStatus.Waiting;
                else
                {
                    var waitlist = new Waitlist
                    {
                        UserBookId = userBookId,
                        WaiterId = user.Id,
                        AppUser = user,
                        WaitlistStatus = Enums.WaitlistStatus.Waiting
                    };
                    var saved = await _context.Waitlists.AddAsync(waitlist);
                    existing = saved.Entity;
                }

                await _context.SaveChangesAsync();
                return existing;
            }
            else
            {
                if (existing == null) throw new InvalidOperationException("Waitlist not found. Can not remove waitlist.");
                existing.WaitlistStatus = Enums.WaitlistStatus.Canceled;
                await _context.SaveChangesAsync();
                return existing;
            }
        }

        public async Task<List<Waitlist>> GetAllByBookIdAsync(Guid userBookId)
        {
            var waitlist = await _context.Waitlists.Include(w => w.AppUser).Where(w => w.UserBookId == userBookId).ToListAsync();
            return waitlist;
        }

        public async Task<CartItemListingDto?> ProcessNextInWaitlistAsync(AppUser formerBuyer, AppUser seller, Guid userBookId)
        {
            var waitlist = await _context.Waitlists.Include(w => w.AppUser).Where(w => w.UserBookId == userBookId && w.WaitlistStatus == Enums.WaitlistStatus.Waiting).OrderBy(w => w.CreatedAt).FirstOrDefaultAsync();
            if (waitlist == null) return null;

            // 書本從別人的 cartItem 或者 orderItem 中移除，加入自己的購物車
            // 1. 加入等待者的 cart 中
            // 2. 通知買家
            using var tx = await _context.Database.BeginTransactionAsync();
            try
            {
                var nextBuyer = waitlist.AppUser;
                var cartItemListing = await _cartRepo.AddItemToCartByIdAsync(nextBuyer!, waitlist.UserBookId);
                await _notiRepo.CreateWaitlistAcceptedAsync(nextBuyer!, userBookId);  // 買家
                waitlist.WaitlistStatus = Enums.WaitlistStatus.Accepted;
                await _context.SaveChangesAsync();
                await tx.CommitAsync();
                return cartItemListing;
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }

        }

        public async Task<List<UserDto>?> RemoveWaitlistAsync(Guid userBookId)
        {
            var waitlists = await _context.Waitlists.Include(w => w.AppUser).Where(w => w.UserBookId == userBookId).ToListAsync();
            if (waitlists.Count == 0) return null;

            List<UserDto> users = [];
            foreach (var waiter in waitlists)
            {
                waiter.WaitlistStatus = Enums.WaitlistStatus.Canceled;
                var user = waiter.AppUser!;
                users.Add(user.ToUserDto());
                await _notiRepo.CreateWaitlistCanceledAsync(user, userBookId);
            }
            await _context.SaveChangesAsync();
            return users;
        }
    }
}