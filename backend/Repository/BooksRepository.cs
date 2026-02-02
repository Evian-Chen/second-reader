using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dto.Book;
using backend.Dto.UserBook;
using backend.Enums;
using backend.Interface;
using backend.Mapper;
using backend.Model;
using Clerk.BackendAPI.Models.Components;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class BooksRepository : IBooksRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly IWaitlistRepository _waitRepo;
        public BooksRepository(ApplicationDBContext context, IWaitlistRepository waitRepo)
        {
            _context = context;
            _waitRepo = waitRepo;
        }

        public async Task<UserBook?> DeleteBookByIdAsync(Guid id, bool? hard)
        {
            // TODO: 如果賣家刪除書本，則所有在cart裡面或者排隊中的人都要被通知，並將cartitem刪除
            var book = await _context.UserBooks.FirstOrDefaultAsync(u => u.Id == id);
            if (book == null) return null;
            if (hard == true)
            {
                _context.UserBooks.Remove(book);
            }
            else
            {
                book.UserBookStatus = UserBookStatus.Delisted;  // 下架書籍
            }
            await _waitRepo.RemoveWaitlistAsync(id);  // 通知並移除所有等待這本書的使用者
            await _context.SaveChangesAsync();
            return book;
        }

        public async Task<UserBook?> EditUserBookById(Guid id, UpdateUserBookDto updateUserBookDto)
        {
            var userBook = await _context.UserBooks
                    .Include(ub => ub.SellerPayMethods)
                    .Include(ub => ub.SellerDeliveryMethods)
                    .Include(b => b.Book).FirstOrDefaultAsync(b => b.Id == id);
            if (userBook == null) return null;
            userBook.BookCondition = updateUserBookDto.bookCondition;
            userBook.Price = updateUserBookDto.Price;
            userBook.UserBookStatus = updateUserBookDto.UserBookStatus;
            userBook.SellerDeliveryMethods.Clear();
            userBook.SellerPayMethods.Clear();
            foreach (var d in updateUserBookDto.SellerDeliveryMethods)
            {
                userBook.SellerDeliveryMethods.Add(new UserBookDeliveryMethod { DeliveryMethod = d });
            }
            foreach (var p in updateUserBookDto.SellerPayMethods)
            {
                userBook.SellerPayMethods.Add(new UserBookPayMethod { PayMethod = p });
            }
            await _context.SaveChangesAsync();
            return userBook;
        }

        public async Task<List<UserBook?>> GetAllAsync()
        {
            var bookModels = await _context.UserBooks.Include(ub => ub.AppUser).Include(ub => ub.Book).ToListAsync();
            return bookModels;
        }

        public async Task<UserBook?> GetBookByIdAsync(Guid id)
        {
            var bookModel = await _context.UserBooks
                                .Include(ub => ub.AppUser)
                                .Include(ub => ub.Book)
                                .Include(ub => ub.SellerPayMethods)
                                .Include(ub => ub.SellerDeliveryMethods)
                                .FirstOrDefaultAsync(b => b.Id == id);
            if (bookModel == null) return null;
            return bookModel;
        }

        public async Task<List<UserBook>?> GetBooksByAccountIdAsync(string accountId, UserBookStatusFilterDto query)
        {
            var books = _context.UserBooks.Include(b => b.Book)
                                            .Include(b => b.AppUser)
                                            .Where(b => b.AppUser!.AccountId == accountId)
                                            .AsQueryable();
            if (query.Status.HasValue)
            {
                books = books.Where(b => b.UserBookStatus == query.Status.Value);
            }
            return await books.ToListAsync();
        }

        public async Task<List<UserBook>?> GetBookSearchResult(BookSearchQueryDto queryDto)
        {
            var userBooks = _context.UserBooks.Include(ub => ub.Book).AsQueryable();
            if (!string.IsNullOrWhiteSpace(queryDto.Title))
            {
                userBooks = userBooks.Where(b => b.Book!.Title.Contains(queryDto.Title));
            }
            if (!string.IsNullOrWhiteSpace(queryDto.Author))
            {
                userBooks = userBooks.Where(ub => ub.Book!.Author.Contains(queryDto.Author));
            }
            if (!string.IsNullOrWhiteSpace(queryDto.SellerAccountId))
            {
                userBooks = userBooks.Where(ub => ub.AppUser!.AccountId.Contains(queryDto.SellerAccountId));
            }
            if (!string.IsNullOrWhiteSpace(queryDto.SellerDisplayName))
            {
                userBooks = userBooks.Where(ub => ub.AppUser!.UserProfile!.DisplayName.Contains(queryDto.SellerDisplayName));
            }
            if (!string.IsNullOrWhiteSpace(queryDto.Isbn))
            {
                userBooks = userBooks.Where(ub => ub.Book!.ISBN == queryDto.Isbn);
            }
            if (queryDto.BookCategory.HasValue)
            {
                userBooks = userBooks.Where(ub => ub.Book!.BookCategory == queryDto.BookCategory.Value);
            }

            return userBooks.ToList();
        }

    }
}