using System;
using backend.Dto.UserBook;

namespace backend.Dto.Waitlist
{
    public class MyWaitlistEntryDto
    {
        public Guid UserBookId { get; set; }
        public DateTime QueuedAt { get; set; }
        public UserBookSummaryDto Book { get; set; } = null!;
    }
}
