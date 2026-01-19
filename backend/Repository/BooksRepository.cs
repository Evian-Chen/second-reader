using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dto.Book;
using backend.Dto.UserBook;
using backend.Interface;
using backend.Mapper;
using backend.Model;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class BooksRepository : IBooksRepository
    {
        private readonly ApplicationDBContext _context;
        public BooksRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<UserBook?>> GetAllAsync()
        {
            var bookModels = await _context.UserBooks.Include(ub => ub.AppUser).Include(ub => ub.Book).ToListAsync();
            return bookModels;
        }

        public async Task<UserBook?> GetBookByIdAsync(int id)
        {
            var bookModel = await _context.UserBooks
                                .Include(ub => ub.AppUser)
                                .Include(ub => ub.Book)
                                .Include(ub => ub.SellerDeliveryMethods)
                                .Include(ub => ub.BuyerDeliveryMethod)
                                .FirstOrDefaultAsync(b => b.Id == id);
            if (bookModel == null) return null;
            return bookModel;
        }

        public async Task<List<UserBook>?> GetBookSearchResult(BookSearchQueryDto queryDto)
        {
            var userBooks = _context.UserBooks.Include(ub => ub.Book).AsQueryable();
            if (!string.IsNullOrWhiteSpace(queryDto.Title))
            {
                userBooks = userBooks.Where(b => b.Book.Title.Contains(queryDto.Title));
            }
            if (!string.IsNullOrWhiteSpace(queryDto.Author))
            {
                userBooks = userBooks.Where(ub => ub.Book.Author.Contains(queryDto.Author));
            }
            if (!string.IsNullOrWhiteSpace(queryDto.SellerAccountId))
            {
                userBooks = userBooks.Where(ub => ub.AppUser.AccountId.Contains(queryDto.SellerAccountId));
            }
            if (!string.IsNullOrWhiteSpace(queryDto.SellerDisplayName))
            {
                userBooks = userBooks.Where(ub => ub.AppUser.UserProfile.DisplayName.Contains(queryDto.SellerDisplayName));
            }
            if (!queryDto.BookCategory.HasValue)
            {
                userBooks = userBooks.Where(ub => ub.Book.BookCategory == queryDto.BookCategory.Value);
            }

            return userBooks.ToList();
        }

    }
}