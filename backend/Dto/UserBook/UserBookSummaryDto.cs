using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Enums;

namespace backend.Dto.UserBook
{
    public class UserBookSummaryDto
    {
        public int BookId { get; set; }
        // 單純展示書的簡單資訊
        public string ISBN { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public BookCategory BookCategory { get; set; }

    }
}