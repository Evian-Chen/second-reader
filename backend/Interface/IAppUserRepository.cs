using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Model;

namespace backend.Interface
{
    public interface IAppUserRepository
    {
        Task<AppUser?> GetByClerkUserIdAsync(string ClerkUserId);
        Task<AppUser> CreateAsync(AppUser appUser);
    }
}