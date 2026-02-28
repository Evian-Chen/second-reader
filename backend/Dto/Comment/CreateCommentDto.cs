using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dto.Comment
{
    public class CreateCommentDto
    {
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Guid PostId { get; set; }
        public Guid? ParentId { get; set; }  // 上一則留言，如果是 null 就是第一則留言
        public Guid? RootId { get; set; }  // 主留言:RootId = Id, 其他留言: RootId = Parent.RootId
    }
}