using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Me;
using backend.Model;

namespace backend.Mapper
{
    public static class MeMapper
    {
        public static UserDto ToUserDto(this AppUser appUser)
        {
            return new UserDto
            {
                AccountId = appUser.AccountId,
                Email = appUser.Email,
                IsSuspicious = appUser.IsSuspicious,
                CreatedAt = appUser.CreatedAt,
                InstagramAccount = appUser.InstagramAccount,
                ThreadsAccount = appUser.ThreadsAccount,
                UserProfile = appUser.UserProfile == null ? null : new UserProfileDto
                {
                    Bio = appUser.UserProfile.Bio,
                    DisplayName = appUser.UserProfile.DisplayName,
                    UpdatedAt = appUser.UserProfile.UpdatedAt
                }
            };
        }
    }
}