import { defineStore } from 'pinia'

interface ErrorResponse {
  error: string
  code?: number
}

interface BaseState {
  isLoading: boolean
  errorMsg: string | null
  errorCode: number
}

export const useBaseStore = defineStore('base', {
  state: (): BaseState => ({
    isLoading: false,
    errorMsg: null,
    errorCode: 0,
  }),

  actions: {
    /**
     * 設定載入狀態
     */
    setIsLoading(isLoading: boolean) {
      this.isLoading = isLoading
    },

    /**
     * 設定錯誤訊息
     */
    setError({ error, code = 0 }: ErrorResponse) {
      this.errorMsg = error
      this.errorCode = code
    },

    /**
     * 處理錯誤（可擴展為顯示錯誤提示等）
     */
    handleError({ error, code = 0 }: ErrorResponse) {
      this.setError({ error, code })
      // 可以在這裡加入錯誤提示的邏輯，例如顯示 toast 或 modal
      console.error(`[API Error] ${error} (code: ${code})`)
    },

    /**
     * 清除錯誤狀態
     */
    clearError() {
      this.errorMsg = null
      this.errorCode = 0
    },
  },
})
