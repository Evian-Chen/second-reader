import api from './api';

import type {
  GetBooksQuery,
  GetBooksResponse
} from '@/types/book';

export default {
  getBooks: (params?: GetBooksQuery) =>
    api<GetBooksResponse>('get', '/books', params ?? null)
};
