using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Comment;
using backend.Model;

namespace backend.Mapper
{
    public static class CommentMapper
    {
        public static CommentDto FromCommentModelToCommentDto(this Comment model)
        {
            return new CommentDto
            {
                Id = model.Id,
                Content = model.Content,
                IsDeleted = model.IsDeleted,
                CreatedAt = model.CreatedAt,
                PostId = model.PostId,
                ParentId = model.ParentId,
                RootId = model.RootId,
                Depth = model.Depth,
                ChildCommentCount = model.ChildCommentCount,
                AuthorId = model.AuthorId,
                AuthorAccountId = model.AuthorAccountId
            };
        }
    }
}