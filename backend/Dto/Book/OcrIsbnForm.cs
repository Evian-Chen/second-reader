using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dto.Book
{
    public class OcrIsbnForm
    {
        public IFormFile Img { get; set; } = default;
    }
}