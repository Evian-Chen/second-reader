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
        Task<OrderItemDto?> GetSaleItemByIdAsync(AppUser user, int id);
        Task<OrderItemDto?> AcceptSaleItemByIdAsync(AppUser user, int id);
        Task<OrderItemDto?> RejectSaleItemByIdAsync(AppUser user, int id);
        Task<OrderItemDto?> CompleteSaleItemByIdAsync(AppUser user, int id);

    }
}