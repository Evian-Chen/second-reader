using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.GoogleBook;

namespace backend.Interface
{
    public interface IGoogleBookService
    {
        Task<GoogleBookResultDto?> GetByIsbnAsync(string isbn);
    }
}