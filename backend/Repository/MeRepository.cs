using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dto.Me;
using backend.Interface;
using backend.Mapper;
using backend.Model;
using Clerk.BackendAPI.Models.Components;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class MeRepository : IMeRepository
    {
        private readonly ApplicationDBContext _context;
        public MeRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<AppUser?> FirstTimeUpdateUserInfoAsync(AppUser user, UpdateUserDto updateUserDto)
        {
            var existing = await _context.AppUsers.FirstOrDefaultAsync(x => x.AccountId == updateUserDto.AccountId && x.Id != user.Id);
            if (existing != null)  // 已經存在有相同的 accountId, accountId 不可重複
            {
                return null;
            }

            var userProfile = new UserProfile
            {
                Bio = updateUserDto.UserProfile.Bio,
                DisplayName = updateUserDto.UserProfile.DisplayName,
                UpdatedAt = updateUserDto.UserProfile.UpdatedAt
            };
            user.UserProfile = userProfile;
            user.AccountId = updateUserDto.AccountId;
            user.Email = updateUserDto.Email;
            user.InstagramAccount = updateUserDto.InstagramAccount;
            user.ThreadsAccount = updateUserDto.ThreadsAccount;
            await _context.UserProfiles.AddAsync(userProfile);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<UserFollowDto> FollowByUserIdAsync(AppUser user, string accountId)
        {
            var follwed = await _context.AppUsers.Include(u => u.UserProfile).FirstOrDefaultAsync(u => u.AccountId == accountId) ?? throw new InvalidOperationException("No such account id exists.");
            var existing = await _context.UserFollows.FirstOrDefaultAsync(uf => uf.FollowerId == user.Id && uf.FollowedId == follwed.Id);
            if (existing == null)
            {
                user.UserProfile!.FollowingCount++;

                follwed.UserProfile!.FollowerCount++;

                var userFollow = new UserFollow
                {
                    FollowerId = user.Id,
                    FollowedId = follwed.Id,
                    FollowerAccountId = user.AccountId,
                    FollowedAccountId = follwed.AccountId,
                    CreatedAt = DateTime.UtcNow
                };
                await _context.UserFollows.AddAsync(userFollow);

                await _context.SaveChangesAsync();
                return userFollow.ToUserFollowDto();
            }
            return existing.ToUserFollowDto();
        }

        public async Task UnfollowByUserIdAsync(AppUser user, string accountId)
        {
            var following = await _context.AppUsers.Include(u => u.UserProfile).FirstOrDefaultAsync(u => u.AccountId == accountId) ?? throw new InvalidOperationException("No such account id exists.");
            var existing = await _context.UserFollows.FirstOrDefaultAsync(uf => uf.FollowerId == user.Id && uf.FollowedId == following.Id)
                            ?? throw new InvalidOperationException("Following or follower not exists.");

            user.UserProfile!.FollowingCount--;

            following.UserProfile!.FollowerCount--;

            _context.UserFollows.Remove(existing);
            await _context.SaveChangesAsync();
        }

        public async Task<AppUser?> UpdateUserInfoAsync(AppUser user, UpdateUserDto updateUserDto)
        {
            var existing = await _context.AppUsers.FirstOrDefaultAsync(x => x.AccountId == updateUserDto.AccountId && x.Id != user.Id);
            if (existing != null)  // 已經存在有相同的 accountId, accountId 不可重複
            {
                return null;
            }
            // meController 已經檢查 user.UserProfile 不會是 null (非初次登入)
            if (user.UserProfile != null)
            {
                user.UserProfile.Bio = updateUserDto.UserProfile.Bio;
                user.UserProfile.DisplayName = updateUserDto.UserProfile.DisplayName;
                user.UserProfile.UpdatedAt = updateUserDto.UserProfile.UpdatedAt;
            }
            user.AccountId = updateUserDto.AccountId;
            user.Email = updateUserDto.Email;
            user.InstagramAccount = updateUserDto.InstagramAccount;
            user.ThreadsAccount = updateUserDto.ThreadsAccount;
            await _context.SaveChangesAsync();
            return user;
        }
    }
}