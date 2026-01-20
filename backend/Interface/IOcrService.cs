using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Interface
{
    public interface IOcrService
    {
        Task<string> ExtractTextAsync(IFormFile img);
        Task<string?> ExtractIsbnAsync(IFormFile img);
    }
}