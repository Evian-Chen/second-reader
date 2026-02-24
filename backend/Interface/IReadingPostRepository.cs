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
        Task<ReadingPost?> GetPostByIdAsync(Guid id);
        Task<ReadingPost?> DeletePostByIdAsync(Guid id);
        Task<ReadingPost?> UpdatePostByIdAsync(Guid id, createReadingPostDto dto, AppUser appUser);
        Task<ReadingPost?> LikePosyByIdAsync(Guid id, LikePostDto likePostDto);
        Task<List<ReadingPostDto>?> GetAllAsync();
        Task<List<ReadingPostDto>?> SearchByKeyWordsAsync(string keyword);
    }
}