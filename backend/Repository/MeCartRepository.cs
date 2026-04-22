using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dto.Cart;
using backend.Dto.Order;
using backend.Enums;
using backend.Interface;
using backend.Mapper;
using backend.Model;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class MeCartRepository : IMeCartRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly IMeNotificationRepository _notiRepo;
        public MeCartRepository(ApplicationDBContext context, IMeNotificationRepository notiRepo)
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

        public async Task<CartItemListingDto?> AddItemToCartByIdAsync(AppUser user, Guid userBookId, bool fromWaitlistOrPromotion = false)
        {
            // 確認要加入購物車的書籍存在
            var bookExists = await _context.UserBooks.Include(ub => ub.Book).Include(c => c.AppUser).FirstOrDefaultAsync(ub => ub.Id == userBookId)
                                    ?? throw new InvalidOperationException("Can not add book that does not exists in databse to cart.");
            if (bookExists.AppUser!.Id == user.Id) throw new InvalidOperationException("User can not add their listed book to their own carts.");
            if (bookExists.UserBookStatus != Enums.UserBookStatus.Listed) throw new InvalidOperationException("Can not add book that is not listed.");

            if (!fromWaitlistOrPromotion)
            {
                var anyoneWaiting = await _context.Waitlists.AnyAsync(w =>
                    w.UserBookId == userBookId && w.WaitlistStatus == WaitlistStatus.Waiting);
                if (anyoneWaiting)
                    throw new InvalidOperationException("Can not add to cart while others are in the waitlist.");
            }

            // abort: 已經有背景 worker 定期檢查所有購物車裡的item是否過期
            // 如果在其他購物車找到，代表此書在其他購物車尚未過期
            var inOtherCart = await _context.CartItems.Include(c => c.UserBook).FirstOrDefaultAsync(c => c.UserBookId == bookExists.Id);
            if (inOtherCart != null) throw new InvalidOperationException("Book is reserved by others");

            var cartModel = await _context.Carts.FirstOrDefaultAsync(c => c.AppUser!.AccountId == user.AccountId);
            if (cartModel == null)  // 此使用者沒有建立購物車
            {
                var newCart = new Cart
                {
                    AppUser = user
                };
                await _context.Carts.AddAsync(newCart);
                await _context.SaveChangesAsync();
                cartModel = await _context.Carts.FirstOrDefaultAsync(c => c.AppUser!.AccountId == user.AccountId);
            }

            // 防重複加入（idempotent）
            var existing = await CartItemForDisplay().FirstOrDefaultAsync(ci => ci.CartId == cartModel!.Id && ci.UserBookId == userBookId);

            if (existing != null)  // 如果已經存在就直接回傳已經存在的
                return existing.ToCartItemListingFromCartItem();

            var cartItem = new CartItem
            {
                CartId = cartModel!.Id,
                UserBookId = bookExists.Id,
                LockedAt = DateTime.UtcNow,
                ExpiredAt = DateTime.UtcNow.AddSeconds(Util.Constants.ExpiredTime)  // 對商品上鎖
            };
            bookExists.UserBookStatus = Enums.UserBookStatus.Reserved;
            _context.CartItems.Add(cartItem);
            await _context.SaveChangesAsync();

            // 回傳 listing dto（再查一次把 navigation 載齊）
            var created = await CartItemForDisplay().FirstOrDefaultAsync(ci => ci.CartId == cartModel.Id && ci.UserBookId == userBookId);

            return created!.ToCartItemListingFromCartItem();
        }

        public async Task<CartItemListingDto?> DeleteItemFromCartByIdAsync(AppUser user, Guid userBookId)
        {
            var cartModel = await _context.Carts.Include(c => c.CartItems).FirstOrDefaultAsync(c => c.AppUser!.AccountId == user.AccountId);
            if (cartModel == null) return null;

            var item = await CartItemForDisplay().FirstOrDefaultAsync(i => i.UserBookId == userBookId && i.CartId == cartModel.Id);
            if (item == null) return null;

            item.UserBook!.UserBookStatus = Enums.UserBookStatus.Listed;
            _context.CartItems.Remove(item);

            // 檢查要移除的這本書是否是排隊排來的
            var waiter = await _context.Waitlists.FirstOrDefaultAsync(w => w.UserBookId == userBookId && w.AppUser!.Id == user.Id);
            waiter?.WaitlistStatus = Enums.WaitlistStatus.Canceled;
            await _context.SaveChangesAsync();  // 先存，後面 AddItemToCartByIdAsync 才抓得到

            // 檢查移出後，有沒有人在排隊，可能如果有排隊的話要用通知
            var waitlist = await _context.Waitlists.Include(w => w.AppUser).Where(w => w.UserBookId == userBookId && w.WaitlistStatus == Enums.WaitlistStatus.Waiting).OrderBy(w => w.CreatedAt).FirstOrDefaultAsync();
            if (waitlist != null)
            {
                // 1. 加入等待者的 cart 中
                // 2. 通知買家
                try
                {
                    var nextBuyer = waitlist.AppUser;
                    var cartItemListing = await AddItemToCartByIdAsync(nextBuyer!, waitlist.UserBookId, fromWaitlistOrPromotion: true);
                    await _notiRepo.CreateWaitlistAcceptedAsync(nextBuyer!, userBookId);  // 買家
                    waitlist.WaitlistStatus = Enums.WaitlistStatus.Accepted;
                    await _context.SaveChangesAsync();
                }
                catch
                {
                    throw;
                }
            }
            return item.ToCartItemListingFromCartItem();
        }

        public async Task<CartDto> GetCartAsync(AppUser user)
        {
            var cart = await _context.Carts.Include(c => c.AppUser).FirstOrDefaultAsync(c => c.AppUser!.AccountId == user.AccountId);
            if (cart == null)  // 此使用者沒有建立購物車
            {
                var newCart = new Cart
                {
                    AppUser = user
                };
                await _context.Carts.AddAsync(newCart);
                await _context.SaveChangesAsync();
            }
            var cartModel = await CartQueryForDisplay().FirstOrDefaultAsync(c => c.AppUser!.AccountId == user.AccountId);
            return cartModel!.ToCartDtoFromCart();
        }

        public async Task<OrderDto> CreateOrderAsync(AppUser user, CheckoutCartDto checkoutDto)
        {
            using var tx = await _context.Database.BeginTransactionAsync();

            try
            {
                var cart = await CartQueryForDisplay().FirstOrDefaultAsync(c => c.AppUser!.Id == user.Id);

                if (cart == null || cart.CartItems.Count == 0) throw new InvalidOperationException("cart is empty.");
                if (cart.CartItems.Any(c => c.ExpiredAt < DateTime.UtcNow)) throw new InvalidOperationException("Book(s) is expired.");

                // 建立 order
                var order = new Order
                {
                    Buyer = user,
                    BuyerId = user.Id,
                    OrderItems = []
                };
                var orderItems = new List<OrderItem>();
                foreach (var item in cart.CartItems)
                {
                    // 建立 order item
                    var orderItem = item.ToOrderItemFromCartItem();
                    orderItem.OrderItemStatus = Enums.OrderItemStatus.Pending;

                    // 買家選擇付款與收費方式
                    var paymethod = checkoutDto.BookMethodsPair[item.UserBookId].PaymentMethod;
                    var deliveryMethod = checkoutDto.BookMethodsPair[item.UserBookId].DeliveryMethod;

                    if (!item.UserBook!.SellerPayMethods.Any(pm => pm.PayMethod == paymethod)) throw new InvalidOperationException("buyer paymethod not in seller paymethod");
                    if (!item.UserBook!.SellerDeliveryMethods.Any(dm => dm.DeliveryMethod == deliveryMethod)) throw new InvalidOperationException("buyer deliverymethod not in seller deliverymethod");

                    // 設定買家付費與收書方式
                    orderItem.BuyerPayMethodSnapshot = paymethod;
                    orderItem.BuyerDeliveryMethodSnapshot = deliveryMethod;

                    order.OrderItems.Add(orderItem);
                    orderItems.Add(orderItem);
                    order.TotalAmount += orderItem.Price;

                    item.UserBook.UserBookStatus = Enums.UserBookStatus.WaitForConfirmation;
                }

                // 將 order 加入資料庫並移除目前的購物車
                await _context.Orders.AddAsync(order);
                await _context.SaveChangesAsync(); // 先存，這樣才能發送通知

                // 明確刪除所有購物車項目
                foreach (var cartItem in cart.CartItems)
                {
                    _context.CartItems.Remove(cartItem);
                }

                _context.Carts.Remove(cart);

                // 寄送通知給買家和賣家
                await _notiRepo.CreateOrderCreatedAsync(user, order.Id);
                foreach (var book in orderItems)
                {
                    await _notiRepo.CreateOrderRequestAsync(user, book.UserBookId);
                    // 前端賣家打開通知 => 導到 /sales/items/{orderItemId} 或 /sales?status=Reserved
                }
                await _context.SaveChangesAsync();
                await tx.CommitAsync();
                return order.ToOrderDtoFromOrder();
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }
        }

        public async Task<CartDto?> DeleteAllCartAsync(AppUser user)
        {
            var cart = await _context.Carts.Include(c => c.CartItems).ThenInclude(ci => ci.UserBook).FirstOrDefaultAsync(c => c.AppUser!.AccountId == user.AccountId);
            if (cart == null) return null;

            List<Guid> bookIds = [];
            foreach (var item in cart.CartItems)
            {
                item.UserBook!.UserBookStatus = Enums.UserBookStatus.Listed;
                _context.CartItems.Remove(item);
                bookIds.Add(item.UserBookId);
            }
            cart.CartItems = [];

            foreach (var id in bookIds)
            { // 檢查是否有人在等待這些書，有的話發送通知並直接加入那人的購物車
                var nextWaiter = await _context.Waitlists.Include(w => w.AppUser).FirstOrDefaultAsync(w => w.UserBookId == id);
                if (nextWaiter != null)
                {
                    await _notiRepo.CreateWaitlistAcceptedAsync(nextWaiter.AppUser!, id);
                    await AddItemToCartByIdAsync(nextWaiter.AppUser!, id, fromWaitlistOrPromotion: true);
                }
            }

            await _context.SaveChangesAsync();
            return cart.ToCartDtoFromCart();
        }
    }
}