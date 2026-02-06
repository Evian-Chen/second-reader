using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dto.Order;
using backend.Interface;
using backend.Mapper;
using backend.Model;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class MeOrderRepository : IMeOrderReporitory
    {
        private readonly ApplicationDBContext _context;
        private readonly IMeNotificationRepository _notiRepo;
        public MeOrderRepository(ApplicationDBContext context, IMeNotificationRepository notiRepo)
        {
            _context = context;
            _notiRepo = notiRepo;
        }

        public async Task<OrderItemDto?> CompleteOrderItemByIdAsync(AppUser user, Guid orderItemId)
        {
            // 買家的功能，更改orderItem狀態、userbook狀態、發送站內通知、看狀況更改整個 order 狀態
            var item = await _context.OrderItems.Include(o => o.UserBook).ThenInclude(ub => ub.AppUser).Include(o => o.Order).ThenInclude(o => o.Buyer).FirstOrDefaultAsync(o => o.Id == orderItemId && o.Order!.Buyer!.Id == user.Id);
            if (item == null) return null;

            if (item.OrderItemStatus != Enums.OrderItemStatus.SellerSent) throw new InvalidOperationException("Seller should sned the item first. Status should be SellerSent");
            item.OrderItemStatus = Enums.OrderItemStatus.Completed;
            item.UserBook!.UserBookStatus = Enums.UserBookStatus.Completed;
            await _notiRepo.CompleteOrderItemFromBuyerAsync(user, item.UserBookId);
            await _context.SaveChangesAsync();

            foreach (var oi in item.Order!.OrderItems)
            {
                if (oi.OrderItemStatus != Enums.OrderItemStatus.Completed)
                {
                    return item.ToOrderItemDtoFromOrderItem();
                }
            }
            // 全部的 orderItem 都完成了
            item.Order.OrderStatus = Enums.OrderStatus.Completed;
            await _context.SaveChangesAsync();
            return item.ToOrderItemDtoFromOrderItem();
        }

        public async Task<List<OrderDto>?> GetAllOrderAsync(AppUser user)
        {
            var orderList = await _context.Orders.Include(o => o.OrderItems).ThenInclude(oi => oi.UserBook).ThenInclude(ub => ub.AppUser).Where(o => o.Buyer!.Id == user.Id).ToListAsync();
            if (orderList == null) return null;

            return [.. orderList.Select(o => o.ToOrderDtoFromOrder())];  // ToList()
        }

        public async Task<OrderDto?> GetOrderByIdAsync(AppUser user, Guid orderId)
        {
            var order = await _context.Orders.Include(o => o.OrderItems).ThenInclude(oi => oi.UserBook).ThenInclude(ub => ub.AppUser).FirstOrDefaultAsync(o => o.Id == orderId);
            if (order == null) return null;
            return order.ToOrderDtoFromOrder();
        }

        public async Task<OrderItemDto?> GetOrderItemByIdAsync(Guid orderItemId)
        {
            var item = await _context.OrderItems.Include(oi => oi.UserBook).ThenInclude(ub => ub.AppUser).FirstOrDefaultAsync(oi => oi.Id == orderItemId);
            if (item == null) return null;
            return item.ToOrderItemDtoFromOrderItem();
        }
    }
}