using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dto.ReadingPost;
using backend.Interface;
using backend.Mapper;
using backend.Model;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class ReadingPostRepository : IReadingPostRepository
    {
        private readonly ApplicationDBContext _context;
        public ReadingPostRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<ReadingPost?> CreatePostAsync(createReadingPostDto postDto, AppUser appUser)
        {
            var model = postDto.ToReadingPostFromCreate();
            model.AppUser = appUser;
            model.AccountId = appUser.AccountId;
            await _context.ReadingPosts.AddAsync(model);
            await _context.SaveChangesAsync();
            return model;
        }

        public async Task<ReadingPost?> DeletePostByIdAsync(Guid id)
        {
            var model = await _context.ReadingPosts.Include(p => p.AppUser).FirstOrDefaultAsync(p => p.Id == id);
            if (model == null) return null;
            _context.ReadingPosts.Remove(model);
            return model;
        }

        public async Task<List<ReadingPostDto>?> GetAllByAccountIdAsync(string accountId)
        {
            var posts = await _context.ReadingPosts.Include(p => p.AppUser).Where(p => p.AccountId == accountId).ToListAsync();
            return posts.Select(p => p.ToReadingPostDto()).ToList();
        }

        public async Task<ReadingPost?> GetPostByIdAsync(Guid id)
        {
            var post = await _context.ReadingPosts.Include(p => p.AppUser).FirstOrDefaultAsync(p => p.Id == id);
            return post;
        }

        public async Task<ReadingPost?> LikePosyByIdAsync(Guid id, LikePostDto likePostDto)
        {
            var model = await _context.ReadingPosts.FirstOrDefaultAsync(p => p.Id == id);
            if (model == null) return null;
            model.Likes += likePostDto.likeCount;
            await _context.SaveChangesAsync();
            return model;
        }

        public async Task<ReadingPost?> UpdatePostByIdAsync(Guid id, createReadingPostDto dto, AppUser appUser)
        {
            var model = await _context.ReadingPosts.Include(p => p.AppUser).FirstOrDefaultAsync(p => p.Id == id);
            if (model == null) return null;
            model.Title = dto.Title;
            model.Content = dto.Content;
            model.Rating = dto.Rating;
            model.UpdatedAt = dto.UpdatedAt;
            await _context.SaveChangesAsync();
            return model;
        }


    }
}