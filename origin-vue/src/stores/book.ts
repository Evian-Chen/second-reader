import { defineStore } from 'pinia'
import type { Book } from '../types/book'
import apiServices from '../services'
import { useApi, updateExistState } from './utils'

interface BookState {
  books: Book[]
}

const state = (): BookState => ({
  books: [],
})

export const useBookStore = defineStore('book', {
  state,
  actions: {
    async getBooks() {
      const res = await useApi(apiServices.getBooks);

      if (res) {
        updateExistState(this.books, res);
      }
    }
  },
})
