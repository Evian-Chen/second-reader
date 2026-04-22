import { defineStore } from 'pinia'
import { ref } from 'vue'
import { secondReaderService } from '@/services/secondReaderService'
import type { UserDto } from '@/api/types/secondReader'
import { isDemoMode } from '@/config/demoMode'
import { demoUser } from '@/data/demoMocks'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const userProfile = ref<UserDto | null>(null)
  const isInitialized = ref(false)
  const token = ref(localStorage.getItem('second_reader_token') || '')

  function setToken(newToken: string) {
    token.value = newToken.trim()
    localStorage.setItem('second_reader_token', token.value)
  }

  async function checkAuth() {
    if (isDemoMode) {
      userProfile.value = { ...demoUser }
      isLoggedIn.value = true
      isInitialized.value = true
      return
    }

    if (!token.value) {
      isLoggedIn.value = false
      userProfile.value = null
      isInitialized.value = true
      return
    }

    try {
      const res = await secondReaderService.getMe()
      userProfile.value = res.data
      isLoggedIn.value = true
    } catch (error) {
      userProfile.value = null
      isLoggedIn.value = false
    } finally {
      isInitialized.value = true
    }
  }

  function logout() {
    token.value = ''
    localStorage.removeItem('second_reader_token')
    isLoggedIn.value = false
    userProfile.value = null
  }

  return { isLoggedIn, userProfile, isInitialized, token, setToken, logout, checkAuth }
})
