using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Me;
using backend.Model;

namespace backend.Interface
{
    public interface IMeRepository
    {
        Task<AppUser?> FirstTimeUpdateUserInfoAsync(AppUser user, UpdateUserDto updateUserDto);
        Task<AppUser?> UpdateUserInfoAsync(AppUser user, UpdateUserDto updateUserDto);
    }
}