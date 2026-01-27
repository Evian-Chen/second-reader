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
    public class OrderRepository : IOrderReporitory
    {
        private readonly ApplicationDBContext _context;
        public OrderRepository(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<List<OrderDto>?> GetAllOrderAsync(AppUser user)
        {
            var orderList = await _context.Orders.Include(o => o.OrderItems).Where(o => o.BuyerId == user.Id).ToListAsync();
            if (orderList == null) return null;

            return [.. orderList.Select(o => o.ToOrderDtoFromOrder())];  // ToList()
        }

        public async Task<OrderDto?> GetOrderByIdAsync(AppUser user, int orderId)
        {
            var order = await _context.Orders.Include(o => o.OrderItems).FirstOrDefaultAsync(o => o.Id == orderId);
            if (order == null) return null;
            return order.ToOrderDtoFromOrder();
        }
    }
}