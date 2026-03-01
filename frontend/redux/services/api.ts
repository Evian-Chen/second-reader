import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getApiBaseUrl, getAuthHeaders } from "@/lib/api/client";
import type {
  User,
  UpdateUserInput,
  UserBookSummary,
  UserBookDetail,
  GetBooksParams,
  GetBooksResponse,
  GetBookByIdResponse,
  GetBooksByAccountIdParams,
  GetBooksByAccountIdResponse,
  CreateBooksBody,
  CreateBooksResponse,
  UpdateBookByIdParams,
  UpdateBookByIdBody,
  UpdateBookByIdResponse,
  DeleteBookByIdParams,
  DeleteBookByIdResponse,
  SearchBooksParams,
  SearchBooksResponse,
} from "@/types";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
    prepareHeaders: async (headers) => {
      const auth = await getAuthHeaders();
      const authObj = auth as Record<string, string>;
      Object.entries(authObj).forEach(([key, value]) => {
        headers.set(key, value);
      });
      return headers;
    },
  }),
  tagTypes: ["Me", "Books"],
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => "/me",
      providesTags: ["Me"],
    }),
    updateMe: builder.mutation<User, UpdateUserInput>({
      query: (body) => ({
        url: "/me",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Me"],
    }),
    getBooks: builder.query<GetBooksResponse, GetBooksParams | void>({
      query: (params) => {
        const hasParams = params && Object.keys(params).length > 0;
        return {
          url: "/books",
          ...(hasParams && { params }),
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((b) => ({
                type: "Books" as const,
                id: b.userBookId,
              })),
              { type: "Books", id: "LIST" },
            ]
          : [{ type: "Books", id: "LIST" }],
    }),
    getBookById: builder.query<UserBookDetail, string>({
      query: (id) => `/books/${id}`,
      providesTags: (_, __, id) => [{ type: "Books", id }],
    }),
    getBooksByAccountId: builder.query<
      GetBooksByAccountIdResponse,
      GetBooksByAccountIdParams
    >({
      query: ({ accountId, Status }) => ({
        url: `/books/${accountId}`,
        params: Status ? { Status } : {},
      }),
      providesTags: (result, _, { accountId }) =>
        result
          ? [
              ...result.map((b) => ({
                type: "Books" as const,
                id: b.userBookId,
              })),
              { type: "Books", id: `ACCOUNT-${accountId}` },
            ]
          : [{ type: "Books", id: `ACCOUNT-${accountId}` }],
    }),
    searchBooks: builder.mutation<SearchBooksResponse, SearchBooksParams | void>(
      {
        query: (params) => ({
          url: "/books/search",
          method: "POST",
          params: (params ?? {}) as Record<string, string>,
        }),
        invalidatesTags: [{ type: "Books", id: "LIST" }],
      }
    ),
    createBooks: builder.mutation<CreateBooksResponse, CreateBooksBody>({
      query: (body) => ({
        url: "/books",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Books", id: "LIST" }],
    }),
    updateBookById: builder.mutation<
      UpdateBookByIdResponse,
      { params: UpdateBookByIdParams; body: UpdateBookByIdBody }
    >({
      query: ({ params, body }) => ({
        url: `/books/${params.id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, __, { params }) => [{ type: "Books", id: params.id }],
    }),
    deleteBookById: builder.mutation<
      DeleteBookByIdResponse,
      DeleteBookByIdParams
    >({
      query: ({ id, hard }) => ({
        url: `/books/${id}`,
        method: "DELETE",
        params: hard !== undefined ? { hard } : {},
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Books", id }],
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateMeMutation,
  useGetBooksQuery,
  useGetBookByIdQuery,
  useGetBooksByAccountIdQuery,
  useSearchBooksMutation,
  useCreateBooksMutation,
  useUpdateBookByIdMutation,
  useDeleteBookByIdMutation,
} = api;
