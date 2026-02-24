using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Comment;
using backend.Model;

namespace backend.Interface
{
    public interface ICommentRepository
    {
        Task<CommentDto> CreateCommentAsync(CreateCommentDto createCommentDto, AppUser user);
        Task DeleteCommentAsync(Guid commentId, AppUser user);
        Task<List<CommentDto>> GetRootCommentsByPostIdAsync(Guid postId);
        Task<List<CommentDto>> GetChildCommentsByRootIdAsync(Guid rootId);
    }
}