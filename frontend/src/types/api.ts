/**
 * API 回應類型定義
 */
export type APIResponse<T> = Promise<T | ErrorResponse>

/**
 * 錯誤回應介面
 *
 * Error Response Body Example:
 *
  {
    "error": "cart is empty.",
    "code": "InvalidOperationException",
    "errors": null
  }
 */
export interface ErrorResponse {
  error: string
  code?: number
}
