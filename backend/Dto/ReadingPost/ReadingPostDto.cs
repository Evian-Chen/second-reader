using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace backend.Dto.ReadingPost
{
    public class ReadingPostDto
    {
        [BindNever]
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int Rating { get; set; }
        public int Likes { get; set; }
        public int CommentCount { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string AccountId { get; set; } = string.Empty;
    }
}