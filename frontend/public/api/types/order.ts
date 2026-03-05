// src/types/order.ts
// Generated from swagger (OpenAPI) schemas & order-related endpoints ONLY
// Covers:
// - /api/me/order
// - /api/me/order/{id}
// - /api/me/order/{orderItemId}/complete
// - /item/{orderItemId}

import type { BookCondition, DeliveryMethod, PayMethod, OrderItemStatus } from "./Enums";

/* ===========================
 * OpenAPI Schemas (Order)
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
  createdAt?: string; // date-time (ISO string)

  /** swagger required */
  orderItems: OrderItemDto[];
}

/* ===========================
 * /api/me/order Endpoints
 * =========================== */

/**
 * GET /api/me/order
 * 200 -> OrderDto (依 swagger 定義)
 */
export type GetMyOrdersResponse = OrderDto[];

/**
 * GET /api/me/order/{id}
 * 200 -> OrderDto
 */
export interface GetMyOrderByIdPath {
  id: string; // uuid
}
export type GetMyOrderByIdResponse = OrderDto;

/**
 * POST /api/me/order/{orderItemId}/complete
 * 200 -> OrderItemDto
 */
export interface CompleteMyOrderItemPath {
  orderItemId: string; // uuid
}
export type CompleteMyOrderItemResponse = OrderItemDto;

/* ===========================
 * /item/{orderItemId} Endpoint
 * =========================== */

/**
 * GET api/me/order/item/{orderItemId}
 * 200 -> OrderItemDto
 */
export interface GetOrderItemPath {
  orderItemId: string; // uuid
}
export type GetOrderItemResponse = OrderItemDto;
