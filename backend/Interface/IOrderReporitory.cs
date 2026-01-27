using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Order;
using backend.Model;

namespace backend.Interface
{
    public interface IOrderReporitory
    {
        Task<List<OrderDto>?> GetAllOrderAsync(AppUser user);
        Task<OrderDto?> GetOrderByIdAsync(AppUser user, int orderId);
    }
}