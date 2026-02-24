using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Me;
using backend.Model;

namespace backend.Mapper
{
    public static class UserMapper
    {
        public static UserFollowDto ToUserFollowDto(this UserFollow userFollow)
        {
            return new UserFollowDto
            {
                FollowerId = userFollow.FollowerId,
                FollowedId = userFollow.FollowedId,
                FollowerAccountId = userFollow.FollowerAccountId,
                FollowedAccountId = userFollow.FollowedAccountId,
                CreatedAt = userFollow.CreatedAt
            };
        }
    }
}