using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Cart;
using backend.Dto.Me;
using backend.Dto.Waitlist;
using backend.Model;

namespace backend.Interface
{
    public interface IWaitlistRepository
    {
        Task<List<Waitlist>> GetAllByBookIdAsync(Guid userBookId);
        Task<Waitlist?> AddOrRemoveWaitlistAsync(Guid userBookId, bool addToWaitlist, AppUser user);
        Task<List<UserDto>?> RemoveWaitlistAsync(Guid userBookId);
        Task<CartItemListingDto?> ProcessNextInWaitlistAsync(AppUser formerBuyer, AppUser seller, Guid userBookId);
        Task<List<MyWaitlistEntryDto>> GetMyWaitingBooksAsync(AppUser user);
    }
}