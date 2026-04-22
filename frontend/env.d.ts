/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  /** 設為 "true" 時離線預覽、不強制登入、不阻擋需登入操作 */
  readonly VITE_DEMO_MODE?: string
}
