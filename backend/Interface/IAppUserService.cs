using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Model;

namespace backend.Interface
{
    public interface IAppUserService
    {
        Task<AppUser> EnsureLocalUserAsync(string ClerkUserId, string Email);
    }
}