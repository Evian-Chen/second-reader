import api from "../api";

import type {
  CompleteMyOrderItemPath,
  CompleteMyOrderItemResponse,
  GetMyOrderByIdPath,
  GetMyOrderByIdResponse,
  GetMyOrdersResponse,
  GetOrderItemPath,
  GetOrderItemResponse
} from "@/types/order";

export default {
  getAllOrders: () =>
    api<GetMyOrdersResponse>('get', '/me/order'),

  getOrderById: (param: GetMyOrderByIdPath) => {
    if (!param.id) throw new Error("Order Id is required.");
    return api<GetMyOrderByIdResponse>('get', `/me/order/${param.id}`);
  },

  getOrderItemByItemId: (param: GetOrderItemPath) => {
    if (!param.orderItemId) throw new Error("Order item Id is required.");
    return api<GetOrderItemResponse>('get', `/me/order/item/${param.orderItemId}`);
  },

  completeOrderItemById: (param: CompleteMyOrderItemPath) =>{
    if (!param.orderItemId) throw new Error("Order item Id is required.");
    return api<CompleteMyOrderItemResponse>('post', `/me/order/${param.orderItemId}/complete`)
  }
}
