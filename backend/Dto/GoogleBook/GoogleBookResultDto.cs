using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dto.GoogleBook
{
    public class GoogleBookResultDto
    {
        public string Title { get; set; } = string.Empty;
        public List<string> Authors { get; set; } = new List<string>();
        public string ISBN { get; set; } = string.Empty;
        public string PreviewLink { get; set; } = string.Empty;
    }
}