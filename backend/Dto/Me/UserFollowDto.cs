using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dto.Me
{
    public class UserFollowDto
    {
        public Guid FollowerId { get; set; }
        public Guid FollowedId { get; set; }
        public string FollowerAccountId { get; set; }
        public string FollowedAccountId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}