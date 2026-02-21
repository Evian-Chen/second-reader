using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Me;

namespace backend.Interface
{
    public interface IUserRepository
    {
        Task<UserDto> GetUserInfoAsync(string accountId);
        Task<List<UserFollowDto>> GetAllFollowersAsync(string accountId);
        Task<List<UserFollowDto>> GetAllFollowingsAsync(string accountId);
    }
}