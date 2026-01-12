using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace backend.Model
{
    public class AppUser : IdentityUser
    {
        public string AccountId { get; set; } = string.Empty;
        public bool IsSuspicios { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        // 暫時，在有聊天室之前，先讓使用者提供自己的聯繫方式
        public string InstagramAccount { get; set; } = string.Empty;
        public string ThreadsAccount { get; set; } = string.Empty;

        public UserProfile? UserProfile { get; set; } = null;  // navigation property
    }
}