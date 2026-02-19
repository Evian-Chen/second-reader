import { http, HttpResponse } from 'msw'
import type { BookSearchQueryDto, BookResponse } from '@/types/book'
import { mockBooks } from './data/books'

/**
 * MSW API Mock Handlers
 * 用於開發環境模擬後端 API
 */
export const handlers = [
  // POST /api/books/search - 書籍搜尋
  // 使用 ** 模式匹配所有域名下的該路徑
  http.post<never, BookSearchQueryDto, BookResponse[]>(
    '**/api/books/search',
    async ({ request }) => {
      // 模擬 API 延遲（500ms）
      await new Promise((resolve) => setTimeout(resolve, 500))

      try {
        const body = await request.json()

        // 從所有 mock 書籍開始過濾
        let filteredBooks = [...mockBooks]

        // 根據 bookCategory 過濾（優先）
        // API 請求中的 bookCategory 是字串（如 "GenreFic"），需要轉換為 enum 數字進行比較
        if (body.bookCategory !== undefined && body.bookCategory !== null) {
          const categoryMap: Record<string, number> = {
            'Undefined': 0,
            'Mandarin': 1,
            'World': 2,
            'GenreFic': 3,
            'LightNovel': 4,
            'Manga': 5,
            'Bl': 6,
            'Gl': 7,
            'History': 8,
            'Poem': 9,
            'Art': 10,
            'Philisophy': 11,
            'Religion': 12,
            'Biography': 13,
          }
          
          // 將字串轉換為數字（如果已經是數字則直接使用）
          const categoryValue = typeof body.bookCategory === 'string' 
            ? categoryMap[body.bookCategory] 
            : body.bookCategory
          
          if (categoryValue !== undefined) {
            filteredBooks = filteredBooks.filter(
              (book) => book.bookCategory === categoryValue
            )
          }
        }

        // 根據 title 和 author 過濾（OR 邏輯：書名或作者包含關鍵字）
        const hasTitle = body.title && body.title.trim()
        const hasAuthor = body.author && body.author.trim()

        if (hasTitle || hasAuthor) {
          const titleLower = hasTitle ? body.title!.toLowerCase().trim() : ''
          const authorLower = hasAuthor ? body.author!.toLowerCase().trim() : ''

          filteredBooks = filteredBooks.filter((book) => {
            const bookTitleMatch = hasTitle
              ? book.title?.toLowerCase().includes(titleLower)
              : false
            const bookAuthorMatch = hasAuthor
              ? book.author?.toLowerCase().includes(authorLower)
              : false

            // OR 邏輯：書名或作者任一匹配即可
            return bookTitleMatch || bookAuthorMatch
          })
        }

        return HttpResponse.json(filteredBooks)
      } catch (error) {
        // 模擬錯誤回應
        return HttpResponse.json(
          { error: 'Invalid request body', code: 400 },
          { status: 400 }
        )
      }
    }
  ),

  // 可以加入更多 mock handlers...
]
