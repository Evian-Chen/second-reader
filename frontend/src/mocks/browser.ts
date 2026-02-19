import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

/**
 * MSW Worker for browser environment
 * 用於開發環境攔截 API 請求
 */
export const worker = setupWorker(...handlers)
