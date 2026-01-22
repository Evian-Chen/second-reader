using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dto.ReadingPost
{
    public class LikePostDto
    {
        [Range(-1, 1)]
        public int likeCount { get; set; } = 0;
    }
}