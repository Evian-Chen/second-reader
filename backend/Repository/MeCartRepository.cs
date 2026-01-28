using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dto.Cart;
using backend.Dto.Order;
using backend.Interface;
using backend.Mapper;
using backend.Model;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class MeCartRepository : IMeCartRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly MeNotificationRepository _notiRepo;
        public MeCartRepository(ApplicationDBContext context, MeNotificationRepository notiRepo)
        {
            _context = context;
            _notiRepo = notiRepo;
        }

        private IQueryable<Cart> CartQueryForDisplay()
        {
            return _context.Carts
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.UserBook)
                        .ThenInclude(ub => ub!.AppUser)
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.UserBook)
                        .ThenInclude(ub => ub!.Book)
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.UserBook)
                        .ThenInclude(ub => ub!.SellerPayMethods)
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.UserBook)
                        .ThenInclude(ub => ub!.SellerDeliveryMethods);
        }

        private IQueryable<CartItem> CartItemForDisplay()
        {
            return _context.CartItems
                .Include(ci => ci.UserBook).ThenInclude(ub => ub!.AppUser)
                .Include(ci => ci.UserBook).ThenInclude(ub => ub!.Book)
                .Include(ci => ci.UserBook).ThenInclude(ub => ub!.SellerPayMethods)
                .Include(ci => ci.UserBook).ThenInclude(ub => ub!.SellerDeliveryMethods);
        }

        public async Task<CartItemListingDto?> AddItemToCartByIdAsync(AppUser user, CartItemDto itemDto)
        {
            // 確認要加入購物車的書籍存在
            var bookExists = await _context.UserBooks.Include(ub => ub.Book).FirstOrDefaultAsync(ub => ub.Id == itemDto.UserBookId)
                                    ?? throw new InvalidOperationException("Can not add book that does not exists in databse to cart.");
            if (bookExists.UserId == user.Id) throw new InvalidOperationException("User can not add their listed book to their own carts.");

            // 查看此書是否已被放入別的購物車
            var inOtherCart = await _context.CartItems.Include(c => c.UserBook).FirstOrDefaultAsync(c => c.UserBookId == bookExists.Id);
            if (inOtherCart != null)
            {
                if (inOtherCart.ExperiedAt < DateTime.Now)
                {  // 這本書在其他人的購物車中過期了
                    bookExists.UserBookStatus = Enums.UserBookStatus.Listed;
                    _context.CartItems.Remove(inOtherCart);
                    await _context.SaveChangesAsync();
                    // 把別人購物車的東西刪掉了，要發送訊息給使用者說之前加入購物車的書過期了
                    // TODO: 發送訊息給該購物車的使用者
                }
                else
                {
                    throw new InvalidOperationException("Book is reserved by others");
                }
            }

            var cartModel = await _context.Carts.FirstOrDefaultAsync(c => c.AccountId == user.AccountId);
            if (cartModel == null)  // 此使用者沒有建立購物車
            {
                var newCart = new Cart
                {
                    AccountId = user.AccountId
                };
                await _context.Carts.AddAsync(newCart);
                await _context.SaveChangesAsync();
                cartModel = await _context.Carts.FirstOrDefaultAsync(c => c.AccountId == user.AccountId);
            }

            // 防重複加入（idempotent）
            var existing = await CartItemForDisplay().FirstOrDefaultAsync(ci => ci.CartId == cartModel!.Id && ci.UserBookId == itemDto.UserBookId);

            if (existing != null)  // 如果已經存在就直接回傳已經存在的
                return existing.ToCartItemListingFromCartItem();

            var cartItem = new CartItem
            {
                CartId = cartModel!.Id,
                UserBookId = bookExists.Id,
                LockedAt = DateTime.Now,
                ExperiedAt = DateTime.Now.AddSeconds(Util.Constants.ExpiredTime)  // 對商品上鎖
            };
            bookExists.UserBookStatus = Enums.UserBookStatus.Reserved;
            _context.CartItems.Add(cartItem);
            await _context.SaveChangesAsync();

            // 回傳 listing dto（再查一次把 navigation 載齊）
            var created = await CartItemForDisplay().FirstOrDefaultAsync(ci => ci.CartId == cartModel.Id && ci.UserBookId == itemDto.UserBookId);

            return created!.ToCartItemListingFromCartItem();
        }

        public async Task<CartItemListingDto?> DeleteItemFromCartByIdAsync(AppUser user, int userBookId)
        {
            // TODO 檢查移出的時候，有沒有人在排隊，可能如果有排隊的話要用通知
            var cartModel = await _context.Carts.Include(c => c.CartItems).FirstOrDefaultAsync(c => c.AccountId == user.AccountId);
            if (cartModel == null) return null;
            var item = await CartItemForDisplay().FirstOrDefaultAsync(i => i.UserBookId == userBookId && i.CartId == cartModel.Id);
            if (item == null) return null;
            item.UserBook!.UserBookStatus = Enums.UserBookStatus.Listed;
            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();
            return item.ToCartItemListingFromCartItem();
        }

        public async Task<CartDto> GetCartAsync(AppUser user)
        {
            var cart = await _context.Carts.FirstOrDefaultAsync(c => c.AccountId == user.AccountId);
            if (cart == null)  // 此使用者沒有建立購物車
            {
                var newCart = new Cart
                {
                    AccountId = user.AccountId
                };
                await _context.Carts.AddAsync(newCart);
                await _context.SaveChangesAsync();
            }
            var cartModel = await CartQueryForDisplay().FirstOrDefaultAsync(c => c.AccountId == user.AccountId);
            return cartModel!.ToCartDtoFromCart();
        }

        public async Task<OrderDto> CreateOrderAsync(AppUser user, CheckoutCartDto checkoutDto)
        {
            using var tx = await _context.Database.BeginTransactionAsync();

            try
            {
                var cart = await CartQueryForDisplay().FirstOrDefaultAsync(c => c.AccountId == user.AccountId);

                if (cart == null || cart.CartItems.Count == 0) throw new InvalidOperationException("cart is empty.");
                if (cart.CartItems.Any(c => c.ExperiedAt < DateTime.Now)) throw new InvalidOperationException("Book(s) is expired.");

                // 建立 order
                var order = new Order
                {
                    BuyerId = user.Id,
                    OrderItems = new List<OrderItem>()
                };
                var orderItems = new List<OrderItem>();
                foreach (var item in cart.CartItems)
                {
                    // 建立 order item
                    var orderItem = item.ToOrderItemFromCartItem();

                    // 買家選擇付款與收費方式
                    var paymethod = checkoutDto.BookMethodsPair[item.UserBookId].PaymentMethod;
                    var deliveryMethod = checkoutDto.BookMethodsPair[item.UserBookId].DeliveryMethod;

                    if (!item.UserBook!.SellerPayMethods.Any(pm => pm.PayMethod == paymethod)) throw new InvalidOperationException("buyer paymethod not in seller paymethod");
                    if (!item.UserBook!.SellerDeliveryMethods.Any(dm => dm.DeliveryMethod == deliveryMethod)) throw new InvalidOperationException("buyer deliverymethod not in seller deliverymethod");

                    // 設定買家付費與收書方式
                    orderItem.BuyerPayMethodSnapshot = paymethod;
                    orderItem.BuyerDeliveryMethodSnapshot = deliveryMethod;

                    order.OrderItems.Add(orderItem);
                    order.TotalAmount += orderItem.Price;

                    item.UserBook.UserBookStatus = Enums.UserBookStatus.WaitForConfirmation;
                }

                // 將 order 加入資料庫並移除目前的購物車
                await _context.Orders.AddAsync(order);
                _context.Carts.Remove(cart);
                await _context.SaveChangesAsync();

                // 寄送通知給買家和賣家
                await _notiRepo.CreateNotificationAsync(Enums.NotificationType.OrderCreated, user, order.Id, null);
                foreach (var book in orderItems)
                {
                    await _notiRepo.CreateNotificationAsync(Enums.NotificationType.OrderRequest, user, order.Id, book.UserBookId);
                    // 前端賣家打開通知 => 導到 /sales/items/{orderItemId} 或 /sales?status=Reserved
                }

                await tx.CommitAsync();
                return order.ToOrderDtoFromOrder();
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }
        }
    }
}