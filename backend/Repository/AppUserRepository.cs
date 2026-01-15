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
    public class AppUserRepository : IAppUserRepository
    {
        private readonly ApplicationDBContext _context;
        public AppUserRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<AppUser> CreateAsync(AppUser appUserModel)
        {
            await _context.AddAsync(appUserModel);
            await _context.SaveChangesAsync();
            return appUserModel;
        }

        public Task<AppUser?> GetByClerkUserIdAsync(string ClerkUserId)
        {
            return _context.AppUsers.FirstOrDefaultAsync(x => x.ClerkUserId == ClerkUserId);
        }
    }
}