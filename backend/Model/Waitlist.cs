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
        public string WaiterAccountId { get; set; } = string.Empty;
        public AppUser? AppUser { get; set; }  // navigation
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public WaitlistStatus WaitlistStatus { get; set; }
    }
}