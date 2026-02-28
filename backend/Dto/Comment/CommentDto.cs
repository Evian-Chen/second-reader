using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dto.Comment
{
    public class CommentDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public bool IsDeleted { get; set; } = false;  // soft delete
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public Guid PostId { get; set; }
        public Guid? ParentId { get; set; }  // 上一則留言，如果是 null 就是第一則留言
        public Guid RootId { get; set; }  // 主留言:RootId = Id, 其他留言: RootId = Parent.RootId
        public int Depth { get; set; }  // 主留言 depth=0，回覆 depth=parent.Depth+1
        public int ChildCommentCount { get; set; }

        public Guid AuthorId { get; set; }
        public string AuthorAccountId { get; set; }
    }
}