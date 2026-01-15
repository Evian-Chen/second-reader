using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dto.Me
{
    public class UserDto
    {

        [Required]
        [MaxLength(50)]
        public string AccountId { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        public bool IsSuspicious { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string InstagramAccount { get; set; } = string.Empty;
        public string ThreadsAccount { get; set; } = string.Empty;
        public UserProfileDto? UserProfile { get; set; }
    }
}