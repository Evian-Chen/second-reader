using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Enums;

namespace backend.Dto.Book
{
    public class BookSearchQueryDto
    {
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string SellerAccountId { get; set; } = string.Empty;
        public string SellerDisplayName { get; set; } = string.Empty;
        public BookCategory? BookCategory { get; set; }
        public string Isbn { get; set; } = string.Empty;
    }
}