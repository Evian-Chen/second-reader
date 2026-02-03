using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using backend.Enums;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace backend.Dto.UserBook
{
    public class UserBookSummaryDto
    {
        [BindNever]  // 阻止 model binding (不用輸入)
        public Guid UserBookId { get; set; }
        // 單純展示書的簡單資訊
        public string ISBN { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public BookCategory BookCategory { get; set; }
        public UserBookStatus UserBookStatus { get; set; }
        public string SellerAccountId { get; set; } = string.Empty;
    }
}