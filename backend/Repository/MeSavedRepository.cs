using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dto.ReadingPost;
using backend.Dto.Saved;
using backend.Dto.UserBook;
using backend.Interface;
using backend.Mapper;
using backend.Model;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class MeSavedRepository : IMeSavedRepository
    {
        private readonly ApplicationDBContext _context;
        public MeSavedRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<SavedBookDto>?> GetAllSavedBooksAsync(AppUser user)
        {
            var books = await _context.SavedBooks
                .Include(s => s.UserBook).ThenInclude(ub => ub.Book)
                .Include(s => s.UserBook).ThenInclude(ub => ub.AppUser)
                .Where(s => s.UserId == user.Id)
                .ToListAsync();
            if (books == null) return null;

            return books.Select(b => b.ToSavedBookDto()).ToList();
        }

        public async Task<List<SavedPostDto>?> GetAllSavedPostsAsync(AppUser user)
        {
            var posts = await _context.SavedPosts
                .Include(s => s.ReadingPost)
                .Where(s => s.UserId == user.Id)
                .ToListAsync();
            if (posts == null) return null;

            return posts.Select(p => p.ToSavedPostDto()).ToList();
        }

        public async Task SavedBookById(AppUser user, Guid bookId)
        {
            // 檢查是否已收藏，避免重複
            var alreadySaved = await _context.SavedBooks
                .AnyAsync(s => s.UserId == user.Id && s.UserBookId == bookId);
            var existing = await _context.UserBooks.FirstOrDefaultAsync(r => r.Id == bookId) ?? throw new Exception("Reading Post not exists");

            if (alreadySaved) return;

            var savedBook = new SavedBooks
            {
                UserId = user.Id,
                UserBookId = bookId,
                CreatedAt = DateTime.UtcNow
            };

            await _context.SavedBooks.AddAsync(savedBook);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> RemoveBookById(AppUser user, Guid bookId)
        {
            var savedBook = await _context.SavedBooks
                .FirstOrDefaultAsync(s => s.UserId == user.Id && s.UserBookId == bookId);

            if (savedBook == null) return false;

            _context.SavedBooks.Remove(savedBook);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task SavedPostById(AppUser user, Guid postId)
        {
            var alreadySaved = await _context.SavedPosts
                .AnyAsync(s => s.UserId == user.Id && s.PostId == postId);

            var existing = await _context.ReadingPosts.FirstOrDefaultAsync(r => r.Id == postId) ?? throw new Exception("Reading Post not exists");
            if (alreadySaved) return;

            var savedPost = new SavedPosts
            {
                UserId = user.Id,
                PostId = postId
            };

            await _context.SavedPosts.AddAsync(savedPost);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> RemovePostById(AppUser user, Guid postId)
        {
            var savedPost = await _context.SavedPosts
                .FirstOrDefaultAsync(s => s.UserId == user.Id && s.PostId == postId);

            if (savedPost == null) return false;

            _context.SavedPosts.Remove(savedPost);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}