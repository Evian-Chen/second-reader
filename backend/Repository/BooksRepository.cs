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
            var book = await _context.UserBooks.Include(ub => ub.Book).FirstOrDefaultAsync(u => u.Id == id);
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

        public async Task<List<UserBook>?> GetAllAsync(int pageNum, int pageSize)
        {
            var bookModels = _context.UserBooks.Include(ub => ub.AppUser).Include(ub => ub.Book);
            if (bookModels == null) return null;
            var skipNum = (pageNum - 1) * pageSize;
            return await bookModels.Skip(skipNum).Take(pageSize).ToListAsync();
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

        public async Task<List<UserBook>?> GetBookSearchResult(string? title, string? author, string? sellerAccount, string? sellerDisplayName, BookCategory? bookCategory, string? isbn)
        {
            var userBooks = _context.UserBooks
                .Include(ub => ub.Book)
                .Include(ub => ub.AppUser)
                    .ThenInclude(au => au!.UserProfile)
                .AsQueryable();
            if (!string.IsNullOrWhiteSpace(title))
            {
                userBooks = userBooks.Where(b => b.Book!.Title.Contains(title));
            }
            if (!string.IsNullOrWhiteSpace(author))
            {
                userBooks = userBooks.Where(ub => ub.Book!.Author.Contains(author));
            }
            if (!string.IsNullOrWhiteSpace(sellerAccount))
            {
                userBooks = userBooks.Where(ub => ub.AppUser!.AccountId.Contains(sellerAccount));
            }
            if (!string.IsNullOrWhiteSpace(sellerDisplayName))
            {
                userBooks = userBooks.Where(ub => ub.AppUser!.UserProfile!.DisplayName.Contains(sellerDisplayName));
            }
            if (!string.IsNullOrWhiteSpace(isbn))
            {
                userBooks = userBooks.Where(ub => ub.Book!.ISBN == isbn);
            }
            if (bookCategory.HasValue)
            {
                userBooks = userBooks.Where(ub => ub.Book!.BookCategory == bookCategory);
            }

            return await userBooks.ToListAsync();
        }

    }
}