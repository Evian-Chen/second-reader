import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/axiosInstance'

export interface LoginResponseEDTO {
  UserId: string
  Name: string
}

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const userProfile = ref<LoginResponseEDTO | null>(null)
  const isInitialized = ref(false)

  function loginSuccess(data: LoginResponseEDTO) {
    isLoggedIn.value = true
    userProfile.value = data
  }

  async function checkAuth() {
    try {
      const res = await api.get<LoginResponseEDTO>('/api/user/checkAuthToken')
      userProfile.value = res.data
      isLoggedIn.value = true
    } catch (error) {
      userProfile.value = null
      isLoggedIn.value = false
    } finally {
      isInitialized.value = true
    }
  }

  async function logout() {
    try {
      await api.post('/api/user/logout')
    } finally {
      isLoggedIn.value = false
      userProfile.value = null
      window.location.href = '/login'
    }
  }

  return { isLoggedIn, userProfile, isInitialized, loginSuccess, logout, checkAuth }
})
