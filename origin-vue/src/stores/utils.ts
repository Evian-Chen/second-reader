import type { APIResponse } from '@/types/api'
import { useBase } from '@/stores'

/**
 * 統一的 API 請求處理函數
 * 自動處理 loading 狀態和錯誤處理
 * @param api API 請求函數
 * @returns Promise<T | null> 成功時回傳資料，失敗時回傳 null
 */
export async function useApi<T>(api: () => APIResponse<T>): Promise<T | null> {
  const { isLoading, setIsLoading, handleError } = useBase()
  
  // 如果正在載入中，直接返回 null 避免重複請求
  if (isLoading) return null
  
  setIsLoading(true)
  
  try {
    const response = await api()
    
    // 檢查回應是否為錯誤格式（後端可能回傳 { error: string, code?: number }）
    if (response && typeof response === 'object') {
      if ('error' in response && !('data' in response)) {
        // 如果回應是錯誤格式，處理錯誤
        handleError(response as { error: string; code?: number })
        return null
      }
      // 正常回應，直接回傳
      return response as T
    }
    
    // 非物件回應（可能是字串、數字等），直接回傳
    return response as T
  } catch (err: any) {
    // 處理網路錯誤或超時
    if (err.response?.status === 408 || err.code === 'ECONNABORTED') {
      handleError({
        error: 'ERROR__TIMEOUT',
        code: 408,
      })
    } else if (err.response?.data) {
      // 後端回傳的錯誤訊息
      handleError({
        error: err.response.data.message || err.response.data.error || 'ERROR__SERVER_ERROR',
        code: err.response.status || 500,
      })
    } else {
      // 其他錯誤（網路錯誤等）
      handleError({
        error: err.message || 'ERROR__SERVER_ERROR',
        code: err.response?.status || 500,
      })
    }
    return null
  } finally {
    setIsLoading(false)
  }
}

/**
 * 更新現有 state 的函數
 * 只更新 state 中已存在的欄位，避免新增未定義的欄位
 * @param state 要更新的 state 物件
 * @param response API 回應的資料
 */
export function updateExistState<Type>(
  state: Type | any,
  response: Type | any,
) {
  Object.keys(response).forEach((item) => {
    if (item in state) {
      state[item] = response[item]
    }
  })
}
