using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Model;

namespace backend.Interface
{
    public interface IWaitlistRepository
    {
        Task<List<Waitlist>?> GetAllAsync(int userBookId);
        Task<Waitlist?> AddOrRemoveWaitlistAsync(int userBookId, bool addToWaitlist, AppUser user);
    }
}