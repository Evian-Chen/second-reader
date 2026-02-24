using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.UserBook;
using backend.Model;

namespace backend.Dto.Saved
{
    public class SavedBookDto
    {
        public UserBookSummaryDto Book { get; set; }
        public string UserAccountId { get; set; } = string.Empty;
    }
}