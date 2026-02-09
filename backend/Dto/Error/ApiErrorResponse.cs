using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dto.Error
{
    public record ApiErrorResponse(
        string Error,
        string Code,
        Dictionary<string, string[]>? Errors = null // 表單錯誤
    );
}