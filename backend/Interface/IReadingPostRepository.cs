using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.ReadingPost;
using backend.Model;

namespace backend.Interface
{
    public interface IReadingPostRepository
    {
        Task<List<ReadingPostDto>?> GetAllByAccountIdAsync(string accountId);
        Task<ReadingPost?> CreatePostAsync(createReadingPostDto postDto, AppUser appUser);
        Task<ReadingPost?> GetPostByIdAsync(int id);
        Task<ReadingPost?> DeletePostByIdAsync(int id);
        Task<ReadingPost?> UpdatePostByIdAsync(int id, createReadingPostDto dto, AppUser appUser);
        Task<ReadingPost?> LikePosyByIdAsync(int id, LikePostDto likePostDto);
    }
}