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
            var userBooksModels = new List<UserBook>();
            foreach (var dto in uploadDtos)
            {  // 確認所有要新增的書都存在 Books 資料表
                var book = await _context.Books.FirstOrDefaultAsync(b => b.ISBN == dto.Book.ISBN);
                if (book == null)
                {
                    var bookModel = dto.Book.ToBookModelDto();
                    book = _context.Books.Add(bookModel).Entity;
                }

                var model = dto.ToUserBookModelFromUpload();
                model.AppUser = appUser;
                model.UserId = appUser.Id;
                model.UserBookStatus = Enums.UserBookStatus.Listed;
                model.Book = book;

                userBooksModels.Add(model);
            }
            await _context.UserBooks.AddRangeAsync(userBooksModels);
            await _context.SaveChangesAsync();

            return userBooksModels;
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