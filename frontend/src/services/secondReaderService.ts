import api from '@/api/axiosInstance'
import type {
  CartDto,
  CheckoutCartPayload,
  CommentDto,
  CreateReadingPostPayload,
  GoogleBookResultDto,
  MyWaitlistEntryDto,
  NotificationDto,
  OrderDto,
  OrderItemDto,
  ReadingPostDto,
  SavedBookDto,
  SavedPostDto,
  UpdateMePayload,
  UploadUserBookPayload,
  UserBookListinDetailDto,
  UserBookSummaryDto,
  UserDto,
  UserFollowDto,
  WaitlistDto,
} from '@/api/types/secondReader'

export const secondReaderService = {
  getMe() {
    return api.get<UserDto>('/api/me')
  },

  /** 公開使用者基本資料（後端 GET /api/{accountId}） */
  getUserByAccountId(accountId: string) {
    return api.get<UserDto>(`/api/${encodeURIComponent(accountId)}`)
  },

  getUserFollowers(accountId: string) {
    return api.get<UserFollowDto[]>(`/api/${encodeURIComponent(accountId)}/followers`)
  },

  getUserFollowings(accountId: string) {
    return api.get<UserFollowDto[]>(`/api/${encodeURIComponent(accountId)}/followings`)
  },

  followUser(accountId: string) {
    return api.post<UserFollowDto>(`/api/me/${encodeURIComponent(accountId)}/follow`)
  },

  unfollowUser(accountId: string) {
    return api.delete(`/api/me/${encodeURIComponent(accountId)}/follow`)
  },

  getBooks(pageNum = 1, pageSize = 10) {
    return api.get<UserBookSummaryDto[]>('/api/books', { params: { pageNum, pageSize } })
  },

  /** Guid 專用。勿與 getBooksByAccountId（帳號字串）混淆。 */
  getBookById(userBookId: string) {
    return api.get<UserBookListinDetailDto>(`/api/books/${userBookId}`)
  },

  /** 取得特定使用者上架的書（市集個人層、個人頁「書籍」分頁） */
  getBooksByAccountId(accountId: string, status?: string) {
    return api.get<UserBookSummaryDto[]>(`/api/books/${encodeURIComponent(accountId)}`, {
      params: status ? { Status: status } : undefined,
    })
  },

  searchBooks(keyword: string) {
    return api.post<UserBookSummaryDto[]>('/api/books/search', null, { params: { keyword } })
  },

  getPosts() {
    return api.get<ReadingPostDto[]>('/api/reading-posts')
  },

  /** 單則貼文（路徑為 Guid，勿與帳號列表混淆） */
  getPostById(postId: string) {
    return api.get<ReadingPostDto>(`/api/reading-posts/${postId}`)
  },

  getPostsByAccountId(accountId: string) {
    return api.get<ReadingPostDto[]>(`/api/reading-posts/${encodeURIComponent(accountId)}`)
  },

  getSavedPosts() {
    return api.get<SavedPostDto[]>('/api/me/saved/posts')
  },

  getSavedBooks() {
    return api.get<SavedBookDto[]>('/api/me/saved/books')
  },

  saveBook(userBookId: string) {
    return api.post(`/api/me/saved/books/${userBookId}`)
  },

  unsaveBook(userBookId: string) {
    return api.delete(`/api/me/saved/books/${userBookId}`)
  },

  createPost(payload: CreateReadingPostPayload) {
    return api.post<ReadingPostDto>('/api/reading-posts', payload)
  },

  uploadBooks(payload: UploadUserBookPayload[]) {
    return api.post<UserBookSummaryDto[]>('/api/books', payload)
  },

  /**
   * 上傳 ISBN/條碼照片，後端以 OCR 取 ISBN 並向 Google Books 查書目後回傳預填用欄位。
   * 表單欄位名稱需為 `Img`（見後端 OcrIsbnForm）。
   */
  prefillBookFromIsbnImage(file: File) {
    const data = new FormData()
    data.append('Img', file)
    return api.post<GoogleBookResultDto>('/api/books/isbn', data)
  },

  likePost(postId: string, delta: 1 | -1) {
    return api.put<ReadingPostDto>(`/api/reading-posts/${postId}/like`, { likeCount: delta })
  },

  getCart() {
    return api.get<CartDto>('/api/me/cart')
  },

  addToCart(userBookId: string) {
    return api.post('/api/me/cart/items', null, { params: { userBookId } })
  },

  removeCartItem(userBookId: string) {
    return api.delete(`/api/me/cart/items/${userBookId}`)
  },

  checkoutCart(payload: CheckoutCartPayload) {
    return api.post<OrderDto>('/api/me/cart/checkout', payload)
  },

  updateMe(payload: UpdateMePayload) {
    return api.put<UserDto>('/api/me', payload)
  },

  getOrders() {
    return api.get<OrderDto[]>('/api/me/order')
  },

  getMyWaitingBooks() {
    return api.get<MyWaitlistEntryDto[]>('/api/me/waiting/books')
  },

  getOrderById(orderId: string) {
    return api.get<OrderDto>(`/api/me/order/${orderId}`)
  },

  completePurchaseOrderItem(orderItemId: string) {
    return api.post<OrderItemDto>(`/api/me/order/${orderItemId}/complete`)
  },

  getSales(status?: string) {
    return api.get<OrderItemDto[]>('/api/me/sales', { params: { status } })
  },

  acceptSaleItem(orderItemId: string) {
    return api.post<OrderItemDto>(`/api/me/sales/${orderItemId}/accept`)
  },

  rejectSaleItem(orderItemId: string) {
    return api.post<OrderItemDto>(`/api/me/sales/${orderItemId}/reject`)
  },

  completeSaleItem(orderItemId: string) {
    return api.post<OrderItemDto>(`/api/me/sales/${orderItemId}/complete`)
  },

  getNotifications(unReadOnly = false) {
    return api.get<NotificationDto[]>('/api/me/notification', { params: { unReadOnly } })
  },

  readAllNotifications() {
    return api.get('/api/me/notification/read-all')
  },

  getWaitlist(userBookId: string) {
    return api.get<WaitlistDto[]>(`/api/waitlist/${userBookId}`)
  },

  toggleWaitlist(userBookId: string, addToWaitlist: boolean) {
    return api.post<WaitlistDto>(`/api/waitlist/${userBookId}`, null, { params: { addToWaitlist } })
  },

  getPostComments(postId: string) {
    return api.get<CommentDto[]>(`/api/reading-posts/${postId}/comments`)
  },

  getChildComments(rootId: string) {
    return api.get<CommentDto[]>(`/api/comments/${rootId}/child-comments`)
  },

  createComment(payload: { content: string; postId: string; parentId?: string; rootId?: string }) {
    return api.post<CommentDto>('/api/comments', payload)
  },
}
