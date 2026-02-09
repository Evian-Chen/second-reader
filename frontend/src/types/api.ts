/**
 * API 回應類型定義
 */
export type APIResponse<T> = Promise<T>

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
  code 在 Response.StatusCodes
 */
export interface ErrorResponse {
  error: string
  code: string
  errors?: Record<string, (string[] | null)> | null
}
