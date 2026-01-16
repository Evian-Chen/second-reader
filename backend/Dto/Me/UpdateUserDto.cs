using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dto.Me
{
    public class UpdateUserDto
    {
        [Required]
        [MaxLength(50)]
        public string AccountId { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        public string InstagramAccount { get; set; } = string.Empty;
        public string ThreadsAccount { get; set; } = string.Empty;
        public UserProfileDto UserProfile { get; set; } = new UserProfileDto();
    }
}