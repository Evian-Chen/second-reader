using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Interface;
using backend.Model;
using Microsoft.EntityFrameworkCore;

namespace backend.Service
{
    public class AppUserService : IAppUserService
    {
        private readonly ApplicationDBContext _context;
        private readonly IAppUserRepository _userRepo;
        public AppUserService(ApplicationDBContext context, IAppUserRepository userRepo)
        {
            _context = context;
            _userRepo = userRepo;
        }
        public async Task<AppUser> EnsureLocalUserAsync(string ClerkUserId, string Email)
        {
            var user = await _context.AppUsers.Include(u => u.UserProfile).FirstOrDefaultAsync(x => x.ClerkUserId == ClerkUserId);
            if (user != null) return user;

            var newUser = new AppUser
            {
                ClerkUserId = ClerkUserId,
                Email = Email,
            };
            return await _userRepo.CreateAsync(newUser);

        }
    }
}