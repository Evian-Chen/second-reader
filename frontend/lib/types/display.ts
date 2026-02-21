/**
 * UI display types: used by pages and components after DTO → display adapters.
 * Keep aligned with Confetti mock shapes so components can stay the same.
 */

export interface UserDisplay {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  followers?: number;
  following?: number;
}

/** Book card/list and detail view. Optional fields when from list API. */
export interface BookDisplay {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  author: string;
  isbn?: string;
  cover: string;
  price: number;
  condition: "全新" | "近全新" | "良好" | "普通" | "較差";
  description: string;
  category: string;
  createdAt: string;
  queueCount?: number;
  isReserved?: boolean;
  isQueued?: boolean;
  shippingMethods?: string[];
  paymentMethods?: string[];
}

/** Post (mock only until API exists). TODO: 接 Post API */
export interface PostDisplay {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  username: string;
  content: string;
  bookTitle?: string;
  bookAuthor?: string;
  bookCover?: string;
  images?: string[];
  likes: number;
  comments: number;
  createdAt: string;
  isLiked?: boolean;
  isSaved?: boolean;
}

/** Order (mock only until API exists). TODO: 接 Order API */
export interface OrderDisplay {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCover: string;
  buyerId?: string;
  buyerName?: string;
  sellerId?: string;
  sellerName?: string;
  price: number;
  status: "待確認" | "已確認" | "已出貨" | "已完成" | "已取消";
  createdAt: string;
  type: "purchase" | "sale";
}
