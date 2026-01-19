using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dto.Book;
using backend.Interface;
using backend.Mapper;
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

        public async Task<List<UserBook>> CreateUserBookAsync(List<UploadUserBooksDto> uploadDtos, AppUser appUser)
        {
            var userBookModels = uploadDtos.Select(dto =>
            {
                var model = dto.ToUserBookModelFromUpload();
                model.AppUser = appUser;
                model.UserId = appUser.Id;
                return model;
            }).ToList();

            await _context.UserBooks.AddRangeAsync(userBookModels);
            await _context.SaveChangesAsync();

            return userBookModels;
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