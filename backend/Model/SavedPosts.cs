using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Model
{
    [Table("SavedPosts")]
    public class SavedPosts
    {
        public AppUser User { get; set; }
        public Guid UserId { get; set; }

        public ReadingPost ReadingPost { get; set; }
        public Guid PostId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}