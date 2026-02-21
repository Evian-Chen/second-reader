/**
 * Books API
 */
import { api } from "./client";
import type {
  CreateBooksBody,
  CreateBooksResponse,
  DeleteBookByIdParams,
  DeleteBookByIdResponse,
  GetBookByIdParams,
  GetBookByIdResponse,
  GetBooksByAccountIdParams,
  GetBooksByAccountIdResponse,
  GetBooksParams,
  GetBooksResponse,
  SearchBooksParams,
  SearchBooksResponse,
  UpdateBookByIdBody,
  UpdateBookByIdParams,
  UpdateBookByIdResponse,
} from "./types";
import type { RequestOptions } from "./client";

const path = "/books";

export const booksApi = {
  getBooks: (params?: GetBooksParams, options?: RequestOptions) =>
    api.get<GetBooksResponse>(path, params as Record<string, number | undefined>, options),

  getBookById: (params: GetBookByIdParams, options?: RequestOptions) =>
    api.get<GetBookByIdResponse>(`${path}/${params.id}`, undefined, options),

  getBooksByAccountId: (params: GetBooksByAccountIdParams, options?: RequestOptions) =>
    api.get<GetBooksByAccountIdResponse>(`${path}/${params.accountId}`, {
      Status: params.Status,
    } as Record<string, string | undefined>, options),

  createBooks: (body: CreateBooksBody, options?: RequestOptions) =>
    api.post<CreateBooksResponse>(path, body, options),

  updateBookById: (
    params: UpdateBookByIdParams,
    body: UpdateBookByIdBody,
    options?: RequestOptions
  ) =>
    api.put<UpdateBookByIdResponse>(`${path}/${params.id}`, body, options),

  deleteBookById: (params: DeleteBookByIdParams, options?: RequestOptions) =>
    api.delete<DeleteBookByIdResponse>(`${path}/${params.id}`, {
      hard: params.hard,
    } as Record<string, boolean | undefined>, options),

  searchBooks: (params?: SearchBooksParams, options?: RequestOptions) =>
    api.post<SearchBooksResponse>(`${path}/search`, undefined, {
      ...options,
      params: params as Record<string, string | undefined>,
    }),
};

export default booksApi;
