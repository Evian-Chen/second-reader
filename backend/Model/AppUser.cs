using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Model
{
    [Table("AppUser")]
    public class AppUser
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string ClerkUserId { get; set; } = string.Empty;  // clerk 自動生成的，作為身分憑證，查詢時使用 accountId
        [Required]
        [MaxLength(50)]
        public string AccountId { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        public bool IsSuspicious { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        // 暫時，在有聊天室之前，先讓使用者提供自己的聯繫方式
        public string InstagramAccount { get; set; } = string.Empty;
        public string ThreadsAccount { get; set; } = string.Empty;

        public UserProfile? UserProfile { get; set; } = null;  // navigation property
    }
}