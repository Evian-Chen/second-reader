/**
 * 書籍分類 enum（對應後端的 BookCategory）
 */
export enum BookCategory {
  Undefined = 0,
  Mandarin = 1,
  World = 2,
  GenreFic = 3, // 類型文學
  LightNovel = 4,
  Manga = 5,
  Bl = 6,
  Gl = 7,
  History = 8,
  Poem = 9,
  Art = 10,
  Philisophy = 11,
  Religion = 12,
  Biography = 13,
}

/**
 * 書籍搜尋查詢 DTO
 */
export interface BookSearchQueryDto {
  title?: string
  author?: string
  sellerAccountId?: string
  sellerDisplayName?: string
  bookCategory?: BookCategory
}

/**
 * 書籍資料介面（對應後端的 UserBookSummaryDto）
 */
export interface Book {
  userBookId: number
  isbn: string
  title: string
  author: string
  description: string
  bookCategory: BookCategory
  // userBookStatus: UserBookStatus => TODO: 新增此 enum
  // 以下欄位可能不存在於後端回傳的資料中，需要額外處理
  price?: number
  originalPrice?: number
  image?: string
  condition?: string
  rating?: number
}

/**
 * TODO:
 * 點進去查看書的詳細資訊（對應後端 UserBookListingDto）
 */

export interface BookResponse {
  userBookId: number
  isbn: string
  title: string
  author: string
  description: string
  bookCategory: BookCategory
}
