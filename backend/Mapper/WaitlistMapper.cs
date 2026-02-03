using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Waitlist;
using backend.Model;

namespace backend.Mapper
{
    public static class WaitlistMapper
    {
        public static WaitlistDto ToWaitlistDto(this Waitlist list)
        {
            return new WaitlistDto
            {
                UserBookId = list.UserBookId,
                WaiterAccountId = list.AppUser!.AccountId,
                WaitlistStatus = list.WaitlistStatus,
                CreatedAt = list.CreatedAt
            };
        }
    }
}