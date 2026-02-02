using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Permissions;
using System.Threading.Tasks;
using backend.Data;
using backend.Dto.Order;
using backend.Enums;
using backend.Interface;
using backend.Mapper;
using backend.Model;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class MeSalesRepository : IMeSalesRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly IMeNotificationRepository _notiRepo;
        private readonly IWaitlistRepository _waitRepo;
        public MeSalesRepository(ApplicationDBContext context, IMeNotificationRepository notiRepo, IWaitlistRepository waitRepo)
        {
            _context = context;
            _notiRepo = notiRepo;
            _waitRepo = waitRepo;
        }

        public async Task<OrderItemDto?> AcceptSaleItemByIdAsync(AppUser user, Guid id)
        {
            // 賣家接受買家的訂單 => 更改orderItem狀態、userbook狀態、發送站內通知
            var item = await _context.OrderItems.Include(o => o.UserBook).Include(o => o.Order).ThenInclude(o => o.Buyer).FirstOrDefaultAsync(o => o.Id == id && o.SellerAccountIdSnapshot == user.AccountId);
            if (item == null) return null;
            if (item.OrderItemStatus != OrderItemStatus.Pending) throw new InvalidOperationException("Item not allow to be proccessed");

            using var tx = await _context.Database.BeginTransactionAsync();

            try
            {
                item.OrderItemStatus = OrderItemStatus.Accepted;
                item.UserBook!.UserBookStatus = UserBookStatus.InProgress;
                var buyer = item.Order!.Buyer;
                await _notiRepo.CreateOrderAcceptedAsync(buyer!, item.UserBookId);
                await _context.SaveChangesAsync();

                await tx.CommitAsync();
                return item.ToOrderItemDtoFromOrderItem();
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }
        }

        public async Task<OrderItemDto?> CompleteSaleItemByIdAsync(AppUser user, Guid id)
        {
            // 更改orderItem狀態、userbook狀態、發送站內通知、更改排隊狀態
            var item = await _context.OrderItems.Include(o => o.UserBook).Include(o => o.Order).ThenInclude(o => o.Buyer).FirstOrDefaultAsync(o => o.Id == id && o.SellerAccountIdSnapshot == user.AccountId);
            if (item == null) return null;

            using var tx = await _context.Database.BeginTransactionAsync();

            try
            {
                item.OrderItemStatus = OrderItemStatus.Completed;
                item.UserBook!.UserBookStatus = UserBookStatus.Completed;

                var buyer = item.Order!.Buyer;
                await _notiRepo.CreateOrderCompletedAsync(buyer!, item.UserBookId);  // 發送訊息給買家，已成功訂購
                await _waitRepo.RemoveWaitlistAsync(item.UserBookId);  // 發送訊息給等待這本書的使用者，取消排隊
                await _context.SaveChangesAsync();
                await tx.CommitAsync();
                return item.ToOrderItemDtoFromOrderItem();
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }
        }

        public async Task<OrderItemDto?> GetSaleItemByIdAsync(AppUser user, Guid id)
        {
            // return 特定一筆訂購書的資訊，做為顯示用
            var item = await _context.OrderItems.FirstOrDefaultAsync(i => i.Id == id && i.SellerAccountIdSnapshot == user.AccountId);
            if (item == null) return null;
            return item.ToOrderItemDtoFromOrderItem();
        }

        public async Task<List<OrderItemDto>?> GetSaleItemsByStatusAsync(AppUser user, OrderItemStatus? status)
        {
            // 賣家查看別人訂購自己的書訂單，status 篩選狀態
            var items = _context.OrderItems.Where(oi => oi.SellerAccountIdSnapshot == user.AccountId).AsQueryable();
            if (status != null && Enum.IsDefined(typeof(OrderItemStatus), status))
            {
                items = items.Where(i => i.OrderItemStatus == status);
            }
            var result = await items.ToListAsync();
            return [.. result.Select(r => r.ToOrderItemDtoFromOrderItem())];
        }

        public async Task<OrderItemDto?> RejectSaleItemByIdAsync(AppUser user, Guid id)
        {
            // 更改orderItem狀態、userbook狀態、發送站內通知、更改排隊狀態
            var item = await _context.OrderItems.Include(o => o.UserBook).Include(o => o.Order).ThenInclude(o => o.Buyer).FirstOrDefaultAsync(o => o.Id == id && o.SellerAccountIdSnapshot == user.AccountId);
            if (item == null) return null;

            using var tx = await _context.Database.BeginTransactionAsync();

            try
            {
                item.OrderItemStatus = OrderItemStatus.Rejected;
                item.UserBook!.UserBookStatus = UserBookStatus.Listed;
                var buyer = item.Order!.Buyer;
                await _notiRepo.CreateOrderRejectedAsync(buyer!, item.UserBookId);

                // 更改排隊狀態
                await _waitRepo.ProcessNextInWaitlistAsync(user, item.UserBook.AppUser!, item.UserBookId);

                await _context.SaveChangesAsync();
                await tx.CommitAsync();
                return item.ToOrderItemDtoFromOrderItem();
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }
        }
    }
}