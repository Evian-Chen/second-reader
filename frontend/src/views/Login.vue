<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import api from '@/api/axiosInstance'
import axios from 'axios'
import type { ErrorResponseDTO } from '@/api/types/ErrorResponseDTO.ts'

const authStore = useAuthStore()
const router = useRouter()

const name = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const login = async () => {
  if (!name.value || !password.value) return alert('Please enter your userId and password.')

  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await api.post('/api/user/login', {
      Name: name.value,
      Password: password.value,
    })
    if (response.data) {
      authStore.loginSuccess(response.data)
      router.push('/')
    }
  } catch (error: any) {
    if (axios.isAxiosError<ErrorResponseDTO>(error)) {
      errorMessage.value = 'Invalid username or password. Please try again.'
    } else if (error.request) {
      errorMessage.value = 'Cannot connect to server.'
    }
    password.value = ''
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h2>Tiramisu</h2>
      </div>

      <div class="form-group">
        <label>User Name</label>
        <input v-model="name" placeholder="Please enter your user name" auto-complete="username" />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="Please enter your password"
          @keyup.enter="login"
          auto-complete="current-password"
        />
      </div>

      <div v-if="errorMessage" class="error-msg">
        {{ errorMessage }}
      </div>

      <button :disabled="isLoading" @click="login">
        {{ isLoading ? 'Login...' : 'Login' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding-top: 10vh;
  background-color: #f8fafc;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-emoji {
  font-size: 3rem;
  display: block;
  margin-bottom: 0.5rem;
}

h2 {
  color: #4a3728;
  font-weight: 700;
  margin: 0;
}

.form-group {
  margin-bottom: 1.25rem;
}

.error-msg {
  background-color: #fef2f2;
  color: #ef4444;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  border: 1px solid #fee2e2;
  text-align: center;
}

label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
}

button {
  width: 100%;
  background: #4a3728;
  color: white;
  border: none;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
  transition: opacity 0.2s;
}

button:hover:not(:disabled) {
  opacity: 0.9;
}

button:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}
</style>
