using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dto.Me
{
    public class UserProfileDto
    {
        public string Bio { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}