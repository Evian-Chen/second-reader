import type { BookSearchQueryDto } from '@/types/book'
import { BookCategory } from '@/types/book'

/**
 * BookCategory enum 數字到字串的映射
 * 對應後端 API 期望的字串格式
 */
const BOOK_CATEGORY_MAP: Record<BookCategory, string> = {
  [BookCategory.Undefined]: 'Undefined',
  [BookCategory.Mandarin]: 'Mandarin',
  [BookCategory.World]: 'World',
  [BookCategory.GenreFic]: 'GenreFic',
  [BookCategory.LightNovel]: 'LightNovel',
  [BookCategory.Manga]: 'Manga',
  [BookCategory.Bl]: 'Bl',
  [BookCategory.Gl]: 'Gl',
  [BookCategory.History]: 'History',
  [BookCategory.Poem]: 'Poem',
  [BookCategory.Art]: 'Art',
  [BookCategory.Philisophy]: 'Philisophy',
  [BookCategory.Religion]: 'Religion',
  [BookCategory.Biography]: 'Biography',
}

/**
 * 防抖函數
 * @param func 要防抖的函數
 * @param wait 等待時間（毫秒）
 * @returns 防抖後的函數
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * 書籍搜尋 Composable
 * 提供搜尋邏輯和查詢建構功能
 */
export function useBookSearch() {
  /**
   * 建立搜尋查詢物件
   * @param query 搜尋關鍵字
   * @param category 分類（可選）
   * @returns BookSearchQueryDto
   */
  const buildSearchQuery = (
    query: string,
    category?: BookCategory | null
  ): BookSearchQueryDto => {
    const trimmedQuery = query.trim()

    const searchQuery: BookSearchQueryDto = {}

    // 判斷是 ISBN、作者還是書名
    // ISBN 通常是 10 或 13 位數字
    const isISBN = /^\d{10,13}$/.test(trimmedQuery)

    if (isISBN) {
      // 如果是 ISBN，搜尋 title（後端可能支援 ISBN 搜尋）
      searchQuery.title = trimmedQuery
    } else if (trimmedQuery) {
      // 否則當作書名或作者搜尋
      // 簡化處理：同時搜尋 title 和 author
      // 後端會處理 OR 邏輯
      searchQuery.title = trimmedQuery
      searchQuery.author = trimmedQuery
    }

    // 如果有分類，加入分類過濾
    // 將 BookCategory enum 轉換為字串形式（API 期望字串，如 "GenreFic"）
    if (category !== undefined && category !== null) {
      searchQuery.bookCategory = BOOK_CATEGORY_MAP[category] || category.toString()
    }

    return searchQuery
  }

  return {
    buildSearchQuery,
    debounce,
  }
}
