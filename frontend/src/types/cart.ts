// src/types/cart.ts
// Generated from swagger (OpenAPI) schemas & /api/me/cart endpoints


import type { UserBookSummaryDto } from "./book";
import type { BookCondition, DeliveryMethod, PayMethod, UserBookStatus, OrderItemStatus } from "./Enums";


/* ===========================
 * OpenAPI Schemas (Cart)
 * =========================== */

/** OpenAPI: CartDto */
export interface CartDto {
  id?: string; // uuid
  createdAt?: string; // date-time
  accountId?: string | null;
  cartItems?: CartItemListingDto[] | null;
}

/** OpenAPI: CartItemListingDto */
export interface CartItemListingDto {
  cartId?: string; // uuid
  userBookId?: string; // uuid
  price?: number; // int32
  bookCondition?: BookCondition;

  sellerPayMethods?: PayMethod[] | null;
  sellerDeliveryMethods?: DeliveryMethod[] | null;

  buyerPayMethod?: PayMethod;
  buyerDeliveryMethod?: DeliveryMethod;

  userBookStatus?: UserBookStatus;
  sellerAccountId?: string | null;

  book?: UserBookSummaryDto;
}

/** OpenAPI: Methods */
export interface Methods {
  paymentMethod?: PayMethod;
  deliveryMethod?: DeliveryMethod;
}

/**
 * OpenAPI: CheckoutCartDto
 * swagger: bookMethodsPair is an object whose values are Methods
 *（key 是 string；用 userBookId 當 key）
 */
export interface CheckoutCartDto {
  bookMethodsPair?: Record<string, Methods> | null;
}

/* ===========================
 * OpenAPI Schemas (Checkout response uses OrderDto)
 * 因為 checkout 直接回 OrderDto，所以這裡也一併帶上
 * =========================== */

/** OpenAPI: OrderItemDto */
export interface OrderItemDto {
  id?: string; // uuid
  orderId?: string; // uuid
  orderItemStatus?: OrderItemStatus;
  price?: number; // int32
  bookCondition?: BookCondition;
  buyerPayMethod?: PayMethod;
  buyerDeliveryMethod?: DeliveryMethod;

  sellerAccountId?: string | null;
  bookTitle?: string | null;
  bookISBN?: string | null;
  bookAuthor?: string | null;
}

/** OpenAPI: OrderDto */
export interface OrderDto {
  orderId?: string; // uuid
  orderItems: OrderItemDto[]; // required in swagger
  createdAt?: string; // date-time
}

/* ===========================
 * /api/me/cart Endpoints Params
 * =========================== */

/** GET /api/me/cart -> 200 CartDto */
export type GetMyCartResponse = CartDto;

/**
 * DELETE /api/me/cart
 * 204 No Content
 * 404 ApiErrorResponse
 */
export type ClearMyCartResponse = void;

/**
 * POST /api/me/cart/items?userBookId={uuid}
 * 200 CartItemListingDto
 */
export interface AddCartItemQuery {
  userBookId: string; // uuid
}
export type AddCartItemResponse = CartItemListingDto;

/**
 * DELETE /api/me/cart/items/{userBookId}
 * 204 No Content
 */
export interface RemoveCartItemPath {
  userBookId: string; // uuid
}
export type RemoveCartItemResponse = void;

/**
 * POST /api/me/cart/checkout
 * requestBody: CheckoutCartDto
 * 200 OrderDto
 */
export type CheckoutCartResponse = OrderDto;
