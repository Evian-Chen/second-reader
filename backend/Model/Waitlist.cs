using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Enums;

namespace backend.Model
{
    public class Waitlist
    {
        public int Id { get; set; }
        public int UserBookId { get; set; }
        public string WaiterAccountId { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public WaitlistStatus WaitlistStatus { get; set; }
    }
}