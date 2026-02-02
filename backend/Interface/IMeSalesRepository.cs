using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Order;
using backend.Enums;
using backend.Model;

namespace backend.Interface
{
    public interface IMeSalesRepository
    {
        Task<List<OrderItemDto>?> GetSaleItemsByStatusAsync(AppUser user, OrderItemStatus? status);
        Task<OrderItemDto?> GetSaleItemByIdAsync(AppUser user, Guid id);
        Task<OrderItemDto?> AcceptSaleItemByIdAsync(AppUser user, Guid id);
        Task<OrderItemDto?> RejectSaleItemByIdAsync(AppUser user, Guid id);
        Task<OrderItemDto?> CompleteSaleItemByIdAsync(AppUser user, Guid id);

    }
}