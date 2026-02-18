using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Enums;

namespace backend.Dto.Waitlist
{
    public class WaitlistDto
    {
        public Guid UserBookId { get; set; }
        public string WaiterAccountId { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public WaitlistStatus WaitlistStatus { get; set; }
    }
}