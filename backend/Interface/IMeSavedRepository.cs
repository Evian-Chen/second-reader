using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.ReadingPost;
using backend.Dto.Saved;
using backend.Dto.UserBook;
using backend.Model;
using Clerk.BackendAPI.Models.Components;

namespace backend.Interface
{
    public interface IMeSavedRepository
    {
        Task<List<SavedPostDto>?> GetAllSavedPostsAsync(AppUser user);
        Task<List<SavedBookDto>?> GetAllSavedBooksAsync(AppUser user);
        Task SavedPostById(AppUser user, Guid postId);
        Task<bool> RemovePostById(AppUser user, Guid postId);
        Task SavedBookById(AppUser user, Guid bookId);
        Task<bool> RemoveBookById(AppUser user, Guid bookId);
    }
}