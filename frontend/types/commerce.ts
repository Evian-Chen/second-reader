import type {
  BookCondition,
  DeliveryMethod,
  PayMethod,
  UserBookStatus,
  OrderItemStatus,
} from "./enums";
import type { UserBookSummary } from "./book";

// --- Cart ---
export interface Methods {
  paymentMethod?: PayMethod;
  deliveryMethod?: DeliveryMethod;
}

export interface CartItem {
  cartId: string;
  userBookId: string;
  price: number;
  bookCondition?: BookCondition;
  sellerPayMethods?: PayMethod[] | null;
  sellerDeliveryMethods?: DeliveryMethod[] | null;
  buyerPayMethod?: PayMethod;
  buyerDeliveryMethod?: DeliveryMethod;
  userBookStatus?: UserBookStatus;
  sellerAccountId?: string | null;
  book?: UserBookSummary;
}

export interface Cart {
  id?: string;
  createdAt?: string;
  accountId?: string | null;
  cartItems?: CartItem[] | null;
}

export interface CheckoutCart {
  bookMethodsPair?: Record<string, Methods> | null;
}

// --- Order ---
export interface OrderItem {
  id: string;
  orderId: string;
  orderItemStatus?: OrderItemStatus;
  price?: number;
  bookCondition?: BookCondition;
  buyerPayMethod?: PayMethod;
  buyerDeliveryMethod?: DeliveryMethod;
  sellerAccountId?: string | null;
  bookTitle?: string | null;
  bookISBN?: string | null;
  bookAuthor?: string | null;
  /** 以下為 UI 顯示用，API 不回傳 */
  type?: "purchase" | "sale";
  bookCover?: string;
  buyerName?: string;
  sellerName?: string;
  createdAt?: string;
}

export interface Order {
  orderId?: string;
  orderItems: OrderItem[];
  createdAt?: string;
}
