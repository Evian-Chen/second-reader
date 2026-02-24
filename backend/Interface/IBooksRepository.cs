using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Book;
using backend.Dto.UserBook;
using backend.Enums;
using backend.Model;

namespace backend.Interface
{
    public interface IBooksRepository
    {
        Task<UserBook?> GetBookByIdAsync(Guid id);  // 點進去該本書的詳細資訊
        Task<UserBook?> DeleteBookByIdAsync(Guid id, bool? hard);
        Task<UserBook?> EditUserBookById(Guid id, UpdateUserBookDto updateUserBookDto);
        Task<List<UserBook>?> GetBookSearchResult(string? title, string? author, string? sellerAccount, string? sellerDisplayName, BookCategory? bookCategory, string? isbn, string? keyword);
        Task<List<UserBook>?> GetAllAsync(int pageNum, int pageSize);
        Task<List<UserBook>?> GetBooksByAccountIdAsync(string accountId, UserBookStatusFilterDto query);
    }
}