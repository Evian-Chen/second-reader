import api from './api';

import type {
  BookResponse
} from '@/types/book';

export default {
  getBooks: () => api<BookResponse[]>('get', '/books'),
};