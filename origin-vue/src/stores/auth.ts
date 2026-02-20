import { defineStore } from 'pinia'

interface AuthState {
  token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
  }),

  getters: {
    /**
     * 檢查是否有 token
     */
    hasToken(): boolean {
      return this.token !== null
    },
  },

  actions: {
    /**
     * 設定 token
     */
    setToken(token: string | null) {
      this.token = token
    },

    /**
     * 清除 token
     */
    clearToken() {
      this.token = null
    },

    /**
     * 從 Clerk 更新 token
     */
    async updateToken() {
      try {
        // 動態匯入 useAuth，避免在非 Vue 上下文中出錯
        const { useAuth } = await import('@clerk/vue')
        const { getToken, isSignedIn } = useAuth()

        if (isSignedIn.value) {
          const token = await getToken.value()
          this.setToken(token)
        } else {
          this.clearToken()
        }
      } catch (error) {
        // 如果無法取得 token（例如 Clerk 未初始化），清除 token
        this.clearToken()
        console.warn('[AuthStore] Failed to update token:', error)
      }
    },
  },
})
