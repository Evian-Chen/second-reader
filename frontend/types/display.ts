/**
 * Mock 型別：Post、Order 尚未實作接 API，暫用此結構
 * TODO: 接 API 後改為與後端一致的型別
 */

export interface Post {
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

export interface Order {
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
