using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Model
{
    [Table("UserProfile")]
    public class UserProfile
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Bio { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public int FollowerCount { get; set; } = 0;
        public int FollowingCount { get; set; } = 0;

        public Guid UserId { get; set; }  // FK
        public AppUser? AppUser { get; set; } = null;
    }
}