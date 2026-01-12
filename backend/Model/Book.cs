using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Enums;

namespace backend.Model
{
    public class Book
    {
        public string ISBN { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Introduction { get; set; } = string.Empty;
        public BookCategory BookCategory { get; set; }
    }
}