import api from "../api";

import type {
  AddCartItemQuery,
  AddCartItemResponse,
  CheckoutCartResponse,
  ClearMyCartResponse,
  GetMyCartResponse,
  RemoveCartItemPath,
  RemoveCartItemResponse
} from "@/types/cart";

export default {
  getMyCart: () =>
    api<GetMyCartResponse>('get', '/me/cart'),

  clearMyCart: () =>
    api<ClearMyCartResponse>('delete', 'me/cart'),

  addItemToCartByItemId: (param: AddCartItemQuery) => {
    if (!param.userBookId) throw new Error("Book Id is required.");
    return api<AddCartItemResponse>('post', `/me/cart/items?userBookId=${param.userBookId}`)
  },

  removeItemFromCartByItemId: (param: RemoveCartItemPath) => {
    if (!param.userBookId) throw new Error("Book Id is required.");
    return api<RemoveCartItemResponse>('delete', `/me/cart/items?userBookId=${param.userBookId}`)
  },

  checkoutCart: () =>
    api<CheckoutCartResponse>('post', 'me/cart/checkout')
}
