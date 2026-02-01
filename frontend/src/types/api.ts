/**
 * API 回應類型定義
 */
export type APIResponse<T> = Promise<T | ErrorResponse>

/**
 * 錯誤回應介面
 */
export interface ErrorResponse {
  error: string
  code?: number
}
