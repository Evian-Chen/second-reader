/**
 * 設為 true 時：不強制導向登入、不阻擋需登入操作、可離線用假資料預覽畫面。
 * 在 `.env` 或 `.env.local` 設定：VITE_DEMO_MODE=true
 */
export const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'
