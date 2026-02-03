using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Order;
using backend.Model;

namespace backend.Interface
{
    public interface IMeOrderReporitory
    {
        Task<List<OrderDto>?> GetAllOrderAsync(AppUser user);
        Task<OrderDto?> GetOrderByIdAsync(AppUser user, Guid orderId);
        Task<OrderItemDto?> CompleteOrderItemByIdAsync(AppUser user, Guid orderItemId);
        Task<OrderItemDto?> GetOrderItemByIdAsync(Guid orderItemId);
    }
}