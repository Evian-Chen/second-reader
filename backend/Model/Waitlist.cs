using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Enums;

namespace backend.Model
{
    public class Waitlist
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserBookId { get; set; }
        public Guid WaiterId { get; set; }  // FK
        public AppUser? AppUser { get; set; }  // navigation
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public WaitlistStatus WaitlistStatus { get; set; }
    }
}