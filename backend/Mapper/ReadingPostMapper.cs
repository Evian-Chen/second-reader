using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.ReadingPost;
using backend.Model;

namespace backend.Mapper
{
    public static class ReadingPostMapper
    {
        public static ReadingPostDto ToReadingPostDto(this ReadingPost model)
        {
            return new ReadingPostDto
            {
                Id = model.Id,
                Title = model.Title,
                Content = model.Content,
                Rating = model.Rating,
                Likes = model.Likes,
                CommentCount = model.CommentCount,
                UpdatedAt = model.UpdatedAt,
                AccountId = model.AppUser!.AccountId
            };
        }

        public static ReadingPost ToReadingPostFromCreate(this createReadingPostDto dto)
        {
            return new ReadingPost
            {
                Title = dto.Title,
                Content = dto.Content,
                Rating = dto.Rating,
                CommentCount = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = dto.UpdatedAt,
            };
        }
    }
}