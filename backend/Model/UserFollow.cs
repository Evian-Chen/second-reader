using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Model
{
    public class UserFollow
    {
        public Guid FollowerId { get; set; }
        public Guid FollowedId { get; set; }
        public string FollowerAccountId { get; set; } = string.Empty;
        public string FollowedAccountId { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}