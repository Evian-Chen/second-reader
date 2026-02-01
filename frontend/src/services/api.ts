import axios, { type AxiosResponse, type AxiosError } from 'axios'

// JSON 資料型別定義
type AnyJson =
  | boolean
  | number
  | string
  | null
  | undefined
  | JsonArray
  | JsonMap

interface JsonMap {
  [key: string]: AnyJson
}

type JsonArray = Array<AnyJson>

// API 基礎 URL（從環境變數讀取，如果沒有則使用預設值）
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://second-reader.onrender.com/api'

// 創建 axios instance
export const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 秒超時
})

// 請求攔截器：在發送請求前處理
instance.interceptors.request.use(
  async (config) => {
    // 從 Pinia store 取得 token
    try {
      const { useAuthStore } = await import('../stores/auth')
      const authStore = useAuthStore()
      const token = authStore.token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      // 如果無法取得 token，繼續發送請求（允許未登入的使用者呼叫公開 API）
      // 這通常發生在 Pinia 尚未初始化時
    }
    
    // 如果是 FormData，移除 Content-Type 讓瀏覽器自動設定（包含 boundary）
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 回應攔截器：處理回應資料
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 直接回傳後端資料，不做任何轉換
    return response
  },
  (error: AxiosError) => {
    // 直接回傳錯誤，不做任何轉換
    return Promise.reject(error)
  }
)

/**
 * 通用的 API 請求函數
 * @param method HTTP 方法
 * @param url API 路徑
 * @param data 請求資料（直接使用，不做任何轉換）
 * @param headers 額外的請求標頭
 * @returns Promise<T>
 */
export default function api<T>(
  method: string,
  url: string,
  data: AnyJson | FormData = null,
  headers?: Record<string, string>
): Promise<T> {
  const requestType = method.toLowerCase()

  switch (requestType) {
    case 'get':
      return instance.get(url, { params: data }).then((res) => res.data) as Promise<T>
    case 'put':
      return instance.put(url, data, { headers }).then((res) => res.data) as Promise<T>
    case 'delete':
      return instance.delete(url, { params: data }).then((res) => res.data) as Promise<T>
    case 'post':
      const config: any = {}
      if (headers) {
        config.headers = headers
      }
      return instance.post(url, data, config).then((res) => res.data) as Promise<T>
    default:
      throw new Error(`Unknown request method: ${method}!`)
  }
}
