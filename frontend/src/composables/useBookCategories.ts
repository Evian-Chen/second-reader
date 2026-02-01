import { BookCategory } from '../types/book'

/**
 * 分類標籤定義
 */
export interface CategoryTag {
  label: string
  value: BookCategory | null // null 表示「全部」
}

/**
 * 分類標籤列表
 * 注意：這裡的分類名稱是前端顯示用的，需要對應到後端的 BookCategory enum
 * 目前後端的分類和前端顯示的不完全一致，這裡先建立一個基本的映射
 */
export const categoryTags: CategoryTag[] = [
  { label: '全部', value: null },
  { label: '文學小說', value: BookCategory.Mandarin }, // 暫時對應到 Mandarin
  { label: '商業理財', value: BookCategory.GenreFic }, // 暫時對應到 GenreFic
  { label: '心理勵志', value: BookCategory.Philisophy }, // 暫時對應到 Philisophy
  { label: '人文社科', value: BookCategory.History }, // 暫時對應到 History
]

/**
 * 取得分類標籤的 composable
 */
export function useBookCategories() {
  return {
    categoryTags,
  }
}
