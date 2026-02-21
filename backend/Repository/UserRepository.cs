using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dto.Me;
using backend.Interface;
using backend.Mapper;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDBContext _context;
        public UserRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<UserFollowDto>> GetAllFollowersAsync(string accountId)
        {
            var user = await _context.AppUsers.FirstOrDefaultAsync(u => u.AccountId == accountId) ?? throw new InvalidOperationException("No such account id exists.");
            var followers = await _context.UserFollows.Where(uf => uf.FollowedId == user.Id).ToListAsync();
            return [.. followers.Select(f => f.ToUserFollowDto())];
        }

        public async Task<List<UserFollowDto>> GetAllFollowingsAsync(string accountId)
        {
            var user = await _context.AppUsers.FirstOrDefaultAsync(u => u.AccountId == accountId) ?? throw new InvalidOperationException("No such account id exists.");
            var followings = await _context.UserFollows.Where(uf => uf.FollowerId == user.Id).ToListAsync();
            return [.. followings.Select(f => f.ToUserFollowDto())];
        }

        public async Task<UserDto> GetUserInfoAsync(string accountId)
        {
            var user = await _context.AppUsers.Include(u => u.UserProfile).FirstOrDefaultAsync(u => u.AccountId == accountId) ?? throw new InvalidOperationException("No such account id exists.");
            return user.ToUserDto();
        }
    }
}