using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Enums;

namespace backend.Dto.Book
{
    public class UserBookStatusFilterDto
    {
        public UserBookStatus? Status { get; set; }
    }
}