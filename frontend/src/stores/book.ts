import { defineStore } from 'pinia'
import type { Book, BookSearchQueryDto, BookResponse } from '../types/book'
import { BookCategory } from '../types/book'
import apiServices from '../services'
import { useApi, updateExistState } from './utils'
import { useBookSearch } from '../composables/useBookSearch'

interface BookState {
  books: Book[]
  searchQuery: string
  selectedCategory: BookCategory | null
  loading: boolean
  error: Error | null
  lastSearchParams: BookSearchQueryDto | null
}

const state = (): BookState => ({
  books: [],
  searchQuery: '',
  selectedCategory: null,
  loading: false,
  error: null,
  lastSearchParams: null,
})

export const useBookStore = defineStore('book', {
  state,
  getters: {
    /**
     * 是否有搜尋結果
     */
    hasResults: (state): boolean => {
      return state.books.length > 0
    },
    /**
     * 是否為空結果
     */
    isEmpty: (state): boolean => {
      return !state.loading && state.books.length === 0 && state.searchQuery !== ''
    },
    /**
     * 是否正在搜尋
     */
    isSearching: (state): boolean => {
      return state.loading
    },
  },
  actions: {
    /**
     * 取得所有書籍（現有功能）
     */
    async getBooks() {
      const res = await useApi(apiServices.getBooks)

      if (res) {
        updateExistState(this.books, res)
      }
    },

    /**
     * 搜尋書籍
     * @param query 搜尋查詢參數
     */
    async searchBooks(query: BookSearchQueryDto) {
      this.loading = true
      this.error = null
      this.lastSearchParams = query

      try {
        const res = await useApi(() => apiServices.searchBooks(query))

        if (res) {
          // 將 BookResponse[] 轉換為 Book[]
          // BookResponse 和 Book 的結構相同，可以直接使用
          this.books = res.map((book) => ({
            ...book,
            // 保留額外的顯示欄位（如果有的話）
          })) as Book[]
        } else {
          // useApi 返回 null 表示錯誤，但錯誤已經在 useApi 中處理
          this.books = []
        }
      } catch (err) {
        this.error = err instanceof Error ? err : new Error('搜尋失敗')
        this.books = []
      } finally {
        this.loading = false
      }
    },

    /**
     * 設定分類過濾
     * @param category 分類，null 表示清除分類
     */
    async setCategory(category: BookCategory | null) {
      this.selectedCategory = category

      // 如果有搜尋關鍵字或分類，執行搜尋
      if (this.searchQuery.trim() || category !== null) {
        const { buildSearchQuery } = useBookSearch()
        const query = buildSearchQuery(this.searchQuery, category)
        await this.searchBooks(query)
      } else {
        // 如果沒有搜尋條件，取得所有書籍
        await this.getBooks()
      }
    },

    /**
     * 清除搜尋條件（保留分類）
     */
    clearSearch() {
      this.searchQuery = ''
      if (this.selectedCategory !== null) {
        // 如果有分類，只過濾分類
        this.setCategory(this.selectedCategory)
      } else {
        // 否則取得所有書籍
        this.getBooks()
      }
    },

    /**
     * 重置所有狀態
     */
    reset() {
      this.books = []
      this.searchQuery = ''
      this.selectedCategory = null
      this.loading = false
      this.error = null
      this.lastSearchParams = null
    },
  },
})
