using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.ReadingPost;

namespace backend.Dto.Saved
{
    public class SavedPostDto
    {
        public ReadingPostDto Post { get; set; }
        public string UserAccountId { get; set; } = string.Empty;
    }
}