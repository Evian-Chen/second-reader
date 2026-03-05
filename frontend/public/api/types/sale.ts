// src/types/sale.ts
// Generated from swagger (OpenAPI) schemas & /api/me/sales endpoints ONLY

import type { OrderItemDto } from "./order";
import type { OrderItemStatus } from "./Enums";

/* ===========================
 * /api/me/sales Endpoints
 * =========================== */

/**
 * GET /api/me/sales
 * Summary: 取得所有此使用者被下單的紀錄
 * 200 -> OrderItemDto[]
 */
export interface GetMySaleByStatusPath {
  status?: OrderItemStatus;
}
export type GetMySalesResponse = OrderItemDto[];

/**
 * GET /api/me/sales/{orderItemId}
 * Summary: 取得特定一本被下單的書
 * 200 -> OrderItemDto
 */
export interface GetMySaleByOrderItemIdPath {
  orderItemId: string; // uuid
}
export type GetMySaleByOrderItemIdResponse = OrderItemDto;

/**
 * POST /api/me/sales/{orderItemId}/accept
 * Summary: 接受特定一本書的下單請求
 * 200 -> OrderItemDto
 */
export interface AcceptSaleOrderItemPath {
  orderItemId: string; // uuid
}
export type AcceptSaleOrderItemResponse = OrderItemDto;

/**
 * POST /api/me/sales/{orderItemId}/reject
 * Summary: 拒絕特定一本書的下單請求
 * 200 -> OrderItemDto
 */
export interface RejectSaleOrderItemPath {
  orderItemId: string; // uuid
}
export type RejectSaleOrderItemResponse = OrderItemDto;

/**
 * POST /api/me/sales/{orderItemId}/complete
 * Summary: 完成特定一本書的下單請求（賣家已出貨/交付）
 * 200 -> OrderItemDto
 */
export interface CompleteSaleOrderItemPath {
  orderItemId: string; // uuid
}
export type CompleteSaleOrderItemResponse = OrderItemDto;
