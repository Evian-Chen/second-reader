import axios, { type AxiosError } from 'axios'
import type { ErrorResponseDTO } from '@/api/types/ErrorResponseDTO.ts'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    // 讓瀏覽器帶上 multipart boundary，勿沿用預設的 application/json
    delete (config.headers as { 'Content-Type'?: string })['Content-Type']
  }
  const token = localStorage.getItem('second_reader_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponseDTO>) => {
    if (error.response) {
      const { status, data } = error.response
      console.log('API error', status, data)
    }
    return Promise.reject(error)
  }
)

export default api
