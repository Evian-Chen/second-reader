export interface UserProfileDto {
  displayName?: string
  bio?: string
}

export interface UserDto {
  accountId: string
  email: string
  isSuspicious: boolean
  createdAt: string
  instagramAccount: string
  threadsAccount: string
  userProfile?: UserProfileDto | null
}

export interface UserFollowDto {
  followerId: string
  followedId: string
  followerAccountId: string
  followedAccountId: string
  createdAt: string
}

export interface UserBookSummaryDto {
  userBookId: string
  isbn: string
  title: string
  author: string
  description: string
  bookCategory: string
  userBookStatus: string
  sellerAccountId: string
  price: number
  /** 部分列表 API 可帶，用於顯示成新度標籤 */
  bookCondition?: string
}

export interface ReadingPostDto {
  id: string
  title: string
  content: string
  rating: number
  likes: number
  commentCount: number
  updatedAt: string
  accountId: string
}

/** 與後端 SavedPostDto 對應 */
export interface SavedPostDto {
  post: ReadingPostDto
  userAccountId: string
}

/** 與後端 SavedBookDto 對應 */
export interface SavedBookDto {
  book: UserBookSummaryDto
  userAccountId: string
}

export type PayMethod = 'Undefined' | 'Cash' | 'BankTransfer' | 'Other'
export type DeliveryMethod = 'Undefined' | 'FaceToFace' | 'Mail' | 'ConvenienceStore' | 'Other'

/** 與後端 UserBookListinDetailDto 對應 */
export interface UserBookListinDetailDto {
  userBookId: string
  bookCondition: string
  sellerPayMethods: PayMethod[]
  sellerDeliveryMethods: DeliveryMethod[]
  price: number
  userBookStatus: string
  createdAt: string
  sellerAccountId: string
  book: UserBookSummaryDto
}

export interface CartItemListingDto {
  cartId: string
  userBookId: string
  price: number
  bookCondition?: string
  /** 若空陣列或缺省，前端顯示全部選項。 */
  sellerPayMethods?: PayMethod[]
  sellerDeliveryMethods?: DeliveryMethod[]
  buyerPayMethod?: PayMethod
  buyerDeliveryMethod?: DeliveryMethod
  sellerAccountId: string
  userBookStatus: string
  book: UserBookSummaryDto
}

export interface CheckoutMethods {
  paymentMethod: PayMethod
  deliveryMethod: DeliveryMethod
}

export interface CheckoutCartPayload {
  bookMethodsPair: Record<string, CheckoutMethods>
}

export interface CartDto {
  id: string
  createdAt: string
  accountId: string
  cartItems: CartItemListingDto[]
}

export interface CreateReadingPostPayload {
  title: string
  content: string
  rating: number
}

/** 後端 POST /api/books/isbn 回傳，供上架表單預填 */
export interface GoogleBookResultDto {
  title: string
  authors: string[]
  isbn: string
  previewLink: string
}

export interface UploadUserBookPayload {
  bookCondition: 'New' | 'LikelyNew' | 'Good' | 'Fair' | 'Poor' | 'Bad'
  sellerPayMethods: ('Cash' | 'BankTransfer' | 'Other')[]
  sellerDeliveryMethods: ('FaceToFace' | 'Mail' | 'ConvenienceStore' | 'Other')[]
  price: number
  userBookStatus: 'Listed' | 'Drafted'
  createdAt: string
  book: {
    userBookId?: string
    isbn: string
    title: string
    author: string
    description: string
    bookCategory: string
    userBookStatus: string
    sellerAccountId: string
    price: number
  }
}

export interface UpdateMePayload {
  accountId: string
  email: string
  instagramAccount: string
  threadsAccount: string
  userProfile: {
    bio: string
    displayName: string
    updatedAt?: string
    followerCount?: number
    followingCount?: number
  }
}

export interface OrderItemDto {
  id: string
  orderId: string
  orderItemStatus: string
  price: number
  bookCondition: string
  buyerPayMethod: string
  buyerDeliveryMethod: string
  sellerAccountId: string
  bookTitle: string
  bookISBN: string
  bookAuthor: string
}

export interface OrderDto {
  orderId: string
  orderItems: OrderItemDto[]
  createdAt: string
}

export interface NotificationDto {
  id: string
  title: string
  content: string
  receiverAccountId: string
  actorAccountId: string
  notificationType: string
  createdAt: string
  readAt?: string | null
  unRead: boolean
}

export interface WaitlistDto {
  userBookId: string
  waiterAccountId: string
  createdAt: string
  waitlistStatus: string
}

/** 與後端 MyWaitlistEntryDto 對應 */
export interface MyWaitlistEntryDto {
  userBookId: string
  queuedAt: string
  book: UserBookSummaryDto
}

export interface CommentDto {
  id: string
  content: string
  isDeleted: boolean
  createdAt: string
  postId: string
  parentId?: string | null
  rootId: string
  depth: number
  childCommentCount: number
  authorId: string
  authorAccountId: string
}
