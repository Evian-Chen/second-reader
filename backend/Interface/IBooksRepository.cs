using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Book;
using backend.Dto.UserBook;
using backend.Model;

namespace backend.Interface
{
    public interface IBooksRepository
    {
        Task<UserBook?> GetBookByIdAsync(int id);  // 點進去該本書的詳細資訊
        Task<List<UserBook>?> GetBookSearchResult(BookSearchQueryDto bookSearchQueryDto);
        Task<List<UserBook?>> GetAllAsync();
    }
}