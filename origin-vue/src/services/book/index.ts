import api from '../api';

import {
  type CreateBooksRequest,
  type CreateBooksResponse,
  type DeleteBookByIdPath,
  type DeleteBookByIdQuery,
  type DeleteBookByIdResponse,
  type GetBookByIdPath,
  type GetBookByIdResponse,
  type GetBooksByAccountIdPath,
  type GetBooksByAccountIdQuery,
  type GetBooksByAccountIdResponse,
  type GetBooksQuery,
  type GetBooksResponse,
  type IsbnLookupForm,
  type IsbnLookupResponse,
  type SearchBooksQuery,
  type SearchBooksResponse,
  type UpdateBookByIdPath,
  type UpdateBookByIdRequest,
  type UpdateBookByIdResponse
} from '@/types/book';

export default {
  getBooks: (params?: GetBooksQuery) =>
    api<GetBooksResponse>('get', `/books?pageNum=${params?.pageNum}&pageSize=${params?.pageSize}`),

  getBookById: (params: GetBookByIdPath) => {
    if (!params.id) throw new Error("Book Id is required.");
    api<GetBookByIdResponse>('get', `/books/${params.id}`);
  },

  getBookByAccountId: (params: GetBooksByAccountIdPath, status?: GetBooksByAccountIdQuery) => {
    if (!params.accountId) throw new Error("Account Id is required.");
    return api<GetBooksByAccountIdResponse>('get', `/books/${params.accountId}?Status=${status?.status}`);
  },

  createBooks: (params: CreateBooksRequest) => {
    if (params.length == 0) throw new Error("Must create at least one book.");
    // TODO: 型別檢查後端會做，前端型別可能寫在 api 呼叫前
    return api<CreateBooksResponse>('post', '/books', params);
  },

  updateBookById: (param: UpdateBookByIdPath, bookData: UpdateBookByIdRequest) =>{
    if (!param.id) throw new Error("Book Id is required.");
    return api<UpdateBookByIdResponse>('put', `/books/${param.id}`, bookData);
  },

  deleteBookById: (param: DeleteBookByIdPath, hard?: DeleteBookByIdQuery) =>{
    if (!param.id) throw new Error("Book Id is required.");
    return api<DeleteBookByIdResponse>('delete', `/books/${param.id}?hard=${hard?.hard}`)
  },

  searchBookByQuery: (params: SearchBooksQuery) =>
    api<SearchBooksResponse>('get', '/books', params),

  getGoogleBookResultByIsbn: (param: IsbnLookupForm) =>
    api<IsbnLookupResponse>('post', '/books/isbn', param)
};
