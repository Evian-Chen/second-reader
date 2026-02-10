import api from "../api";

import type {
  AcceptSaleOrderItemPath,
  AcceptSaleOrderItemResponse,
  CompleteSaleOrderItemPath,
  CompleteSaleOrderItemResponse,
  GetMySaleByOrderItemIdPath,
  GetMySaleByOrderItemIdResponse,
  GetMySaleByStatusPath,
  GetMySalesResponse,
  RejectSaleOrderItemPath,
  RejectSaleOrderItemResponse
} from "@/types/sale";

export default {
  getSalesByStatus: (query?: GetMySaleByStatusPath) =>
    api<GetMySalesResponse>('get', `/me/sales?status=${query?.status}`),

  getSaleByItemId: (param: GetMySaleByOrderItemIdPath) =>
    api<GetMySaleByOrderItemIdResponse>('get', `/me/sales/${param.orderItemId}`),

  acceptSaleByItemId: (param: AcceptSaleOrderItemPath) =>
    api<AcceptSaleOrderItemResponse>('post', `/me/sales/${param.orderItemId}/accept`),

  rejectSaleByItemId: (param: RejectSaleOrderItemPath) =>
    api<RejectSaleOrderItemResponse>('post', `/me/sales/${param.orderItemId}/reject`),

  completeSaleByItemId: (param: CompleteSaleOrderItemPath) =>
    api<CompleteSaleOrderItemResponse>('post', `/me/sales/${param.orderItemId}/complete`)
}
