using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Model
{
    [Table("SavedBooks")]
    public class SavedBooks
    {
        public AppUser User { get; set; }
        public Guid UserId { get; set; }

        public UserBook UserBook { get; set; }
        public Guid UserBookId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}