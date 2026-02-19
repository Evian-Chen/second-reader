import api from './api'
import type { BookSearchQueryDto, BookResponse } from '@/types/book'

/**
 * API 服務
 * 統一在此定義所有 API 服務函數（參考 bartender 專案架構）
 */
export default {
  /**
   * 取得所有書籍
   */
  getBooks: (): Promise<BookResponse[]> => {
    return api<BookResponse[]>('get', '/books', null)
  },

  /**
   * 搜尋書籍
   * @param query 搜尋查詢參數
   */
  searchBooks: (query: BookSearchQueryDto): Promise<BookResponse[]> => {
    const requestBody: Record<string, any> = { ...query }
    return api<BookResponse[]>('post', '/books/search', requestBody)
  },
}