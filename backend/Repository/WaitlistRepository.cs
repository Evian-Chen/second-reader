using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Interface;
using backend.Model;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class WaitlistRepository : IWaitlistRepository
    {
        private readonly ApplicationDBContext _context;
        public WaitlistRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Waitlist?> AddOrRemoveWaitlistAsync(int userBookId, bool addToWaitlist, AppUser user)
        {
            var existing = await _context.Waitlists.FirstOrDefaultAsync(w => w.UserBookId == userBookId && w.WaiterAccountId == user.AccountId);
            if (addToWaitlist)
            {
                // 加入等待清單 
                if (existing != null) throw new InvalidOperationException("Waitlist exist or the user is already waiting");

                var waitlist = new Waitlist
                {
                    UserBookId = userBookId,
                    WaiterAccountId = user.AccountId,
                    WaitlistStatus = Enums.WaitlistStatus.Waiting
                };
                var saved = await _context.Waitlists.AddAsync(waitlist);
                await _context.SaveChangesAsync();
                return saved.Entity;
            }
            else
            {
                if (existing == null) throw new InvalidOperationException("Waitlist not found. Can not remove waitlist.");
                existing.WaitlistStatus = Enums.WaitlistStatus.Canceled;
                await _context.SaveChangesAsync();
                return existing;
            }
        }

        public async Task<List<Waitlist>?> GetAllAsync(int userBookId)
        {
            var waitlist = await _context.Waitlists.Where(w => w.UserBookId == userBookId).ToListAsync();
            return waitlist;
        }
    }
}