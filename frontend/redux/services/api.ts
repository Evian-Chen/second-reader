import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getApiBaseUrl, getAuthHeaders } from "@/lib/api/client";
import type {
  User,
  UpdateUserInput,
  UserBookSummary,
  UserBookDetail,
  GetBooksParams,
  GetBooksResponse,
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
  GoogleBookResult,
  Cart,
  CheckoutCart,
  CartItem,
  Comment,
  CreateComment,
  Order,
  OrderItem,
  Notification,
  ReadingPost,
  CreateReadingPost,
  LikePost,
  Waitlist,
  UserFollow,
  SavedPostResponse,
  SavedBookResponse,
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
  tagTypes: [
    "Me",
    "Books",
    "Cart",
    "Comments",
    "Orders",
    "Sales",
    "Notifications",
    "Posts",
    "User",
    "Waitlist",
  ],
  endpoints: (builder) => ({
    // ========== Me ==========
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

    // ========== Me - Saved Posts ==========
    getSavedPosts: builder.query<ReadingPost[], void>({
      query: () => "/me/saved/posts",
      providesTags: ["Me"],
      transformResponse: (response: SavedPostResponse[] | null) =>
        (response ?? []).map((r) => ({ ...r.post, isSaved: true })),
    }),
    savePost: builder.mutation<void, string>({
      query: (postId) => ({
        url: `/me/saved/posts/${postId}`,
        method: "POST",
      }),
      invalidatesTags: ["Me"],
    }),
    unsavePost: builder.mutation<void, string>({
      query: (postId) => ({
        url: `/me/saved/posts/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Me"],
    }),

    // ========== Me - Saved Books ==========
    getSavedBooks: builder.query<UserBookSummary[], void>({
      query: () => "/me/saved/books",
      providesTags: ["Me"],
      transformResponse: (response: SavedBookResponse[] | null) =>
        (response ?? []).map((r) => r.book),
    }),
    saveBook: builder.mutation<void, string>({
      query: (bookId) => ({
        url: `/me/saved/books/${bookId}`,
        method: "POST",
      }),
      invalidatesTags: ["Me"],
    }),
    unsaveBook: builder.mutation<void, string>({
      query: (bookId) => ({
        url: `/me/saved/books/${bookId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Me"],
    }),

    // ========== Me - Follow ==========
    followUser: builder.mutation<UserFollow, string>({
      query: (accountId) => ({
        url: `/me/${accountId}/follow`,
        method: "POST",
      }),
      invalidatesTags: ["Me", "User"],
    }),
    unfollowUser: builder.mutation<void, string>({
      query: (followedId) => ({
        url: `/me/${followedId}/follow`,
        method: "DELETE",
      }),
      invalidatesTags: ["Me", "User"],
    }),

    // ========== Me - Cart ==========
    getCart: builder.query<Cart, void>({
      query: () => "/me/cart",
      providesTags: ["Cart"],
    }),
    clearCart: builder.mutation<void, void>({
      query: () => ({
        url: "/me/cart",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    addCartItem: builder.mutation<CartItem, string>({
      query: (userBookId) => ({
        url: "/me/cart/items",
        method: "POST",
        params: { userBookId },
      }),
      invalidatesTags: ["Cart"],
    }),
    removeCartItem: builder.mutation<void, string>({
      query: (userBookId) => ({
        url: `/me/cart/items/${userBookId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    checkoutCart: builder.mutation<Order, CheckoutCart>({
      query: (body) => ({
        url: "/me/cart/checkout",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart", "Orders"],
    }),

    // ========== Me - Notifications ==========
    getNotifications: builder.query<
      Notification[],
      { unReadOnly?: boolean } | void
    >({
      query: (params) => ({
        url: "/me/notification",
        params: params ?? {},
      }),
      providesTags: ["Notifications"],
    }),
    getNotificationById: builder.query<Notification, string>({
      query: (id) => `/me/notification/${id}`,
      providesTags: (_, __, id) => [{ type: "Notifications", id }],
    }),
    readAllNotifications: builder.mutation<void, void>({
      query: () => ({
        url: "/me/notification/read-all",
        method: "GET",
      }),
      invalidatesTags: ["Notifications"],
    }),

    // ========== Me - Orders ==========
    getOrders: builder.query<Order[], void>({
      query: () => "/me/order",
      providesTags: ["Orders"],
    }),
    getOrderById: builder.query<Order, string>({
      query: (id) => `/me/order/${id}`,
      providesTags: (_, __, id) => [{ type: "Orders", id }],
    }),
    completeOrderItem: builder.mutation<OrderItem, string>({
      query: (orderItemId) => ({
        url: `/me/order/${orderItemId}/complete`,
        method: "POST",
      }),
      invalidatesTags: ["Orders"],
    }),
    getOrderItemById: builder.query<OrderItem, string>({
      query: (orderItemId) => `/me/order/item/${orderItemId}`,
      providesTags: (_, __, id) => [{ type: "Orders", id: `item-${id}` }],
    }),

    // ========== Me - Sales ==========
    getSales: builder.query<
      OrderItem[],
      { status?: string } | void
    >({
      query: (params) => ({
        url: "/me/sales",
        params: params ?? {},
      }),
      providesTags: ["Sales"],
    }),
    getSaleById: builder.query<OrderItem, string>({
      query: (orderItemId) => `/me/sales/${orderItemId}`,
      providesTags: (_, __, id) => [{ type: "Sales", id }],
    }),
    acceptSale: builder.mutation<OrderItem, string>({
      query: (orderItemId) => ({
        url: `/me/sales/${orderItemId}/accept`,
        method: "POST",
      }),
      invalidatesTags: ["Sales"],
    }),
    rejectSale: builder.mutation<OrderItem, string>({
      query: (orderItemId) => ({
        url: `/me/sales/${orderItemId}/reject`,
        method: "POST",
      }),
      invalidatesTags: ["Sales"],
    }),
    completeSale: builder.mutation<OrderItem, string>({
      query: (orderItemId) => ({
        url: `/me/sales/${orderItemId}/complete`,
        method: "POST",
      }),
      invalidatesTags: ["Sales"],
    }),

    // ========== Books ==========
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
              ...result
                .filter((b) => b.userBookId)
                .map((b) => ({ type: "Books" as const, id: b.userBookId! })),
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
              ...result
                .filter((b) => b.userBookId)
                .map((b) => ({ type: "Books" as const, id: b.userBookId! })),
              { type: "Books", id: `ACCOUNT-${accountId}` },
            ]
          : [{ type: "Books", id: `ACCOUNT-${accountId}` }],
    }),
    searchBooks: builder.mutation<SearchBooksResponse, SearchBooksParams | void>(
      {
        query: (params) => ({
          url: "/books/search",
          method: "POST",
          params: (params ?? {}) as Record<string, string | number | undefined>,
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
      invalidatesTags: (result) =>
        result?.length && result[0].sellerAccountId
          ? [
              { type: "Books", id: "LIST" },
              { type: "Books", id: `ACCOUNT-${result[0].sellerAccountId}` },
            ]
          : [{ type: "Books", id: "LIST" }],
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
    getIsbnLookup: builder.mutation<GoogleBookResult, FormData>({
      query: (formData) => ({
        url: "/books/isbn",
        method: "POST",
        body: formData,
      }),
    }),

    // ========== Comments ==========
    createComment: builder.mutation<Comment, CreateComment>({
      query: (body) => ({
        url: "/comments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Comments", "Posts"],
    }),
    deleteComment: builder.mutation<void, string>({
      query: (commentId) => ({
        url: `/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comments", "Posts"],
    }),
    getChildComments: builder.query<Comment[], string>({
      query: (rootId) => `/comments/${rootId}/child-comments`,
      providesTags: (_, __, rootId) => [{ type: "Comments", id: rootId }],
    }),

    // ========== Reading Posts ==========
    getReadingPosts: builder.query<ReadingPost[], void>({
      query: () => "/reading-posts",
      providesTags: ["Posts"],
    }),
    getReadingPostsByAccount: builder.query<ReadingPost[], string>({
      query: (accountId) => `/reading-posts/${accountId}`,
      providesTags: (_, __, accountId) => [
        { type: "Posts", id: `ACCOUNT-${accountId}` },
      ],
    }),
    getReadingPostById: builder.query<ReadingPost, string>({
      query: (id) => `/reading-posts/${id}`,
      providesTags: (_, __, id) => [{ type: "Posts", id }],
    }),
    createReadingPost: builder.mutation<ReadingPost, CreateReadingPost>({
      query: (body) => ({
        url: "/reading-posts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Posts"],
    }),
    updateReadingPost: builder.mutation<
      ReadingPost,
      { id: string; body: CreateReadingPost }
    >({
      query: ({ id, body }) => ({
        url: `/reading-posts/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Posts", id }],
    }),
    deleteReadingPost: builder.mutation<void, string>({
      query: (id) => ({
        url: `/reading-posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts"],
    }),
    likeReadingPost: builder.mutation<ReadingPost, { id: string; body: LikePost }>({
      query: ({ id, body }) => ({
        url: `/reading-posts/${id}/like`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Posts", id }],
    }),
    searchReadingPosts: builder.query<ReadingPost[], { keyword?: string } | void>({
      query: (params) => ({
        url: "/reading-posts/search",
        params: params ?? {},
      }),
      providesTags: ["Posts"],
    }),
    getPostComments: builder.query<Comment[], string>({
      query: (postId) => `/reading-posts/${postId}/comments`,
      providesTags: (_, __, postId) => [
        { type: "Comments", id: `post-${postId}` },
      ],
    }),

    // ========== User ==========
    getUserByAccountId: builder.query<User, string>({
      query: (accountId) => `/${accountId}`,
      providesTags: (_, __, accountId) => [{ type: "User", id: accountId }],
    }),
    getFollowers: builder.query<UserFollow[], string>({
      query: (accountId) => `/${accountId}/followers`,
      providesTags: (_, __, accountId) => [
        { type: "User", id: `followers-${accountId}` },
      ],
    }),
    getFollowings: builder.query<UserFollow[], string>({
      query: (accountId) => `/${accountId}/followings`,
      providesTags: (_, __, accountId) => [
        { type: "User", id: `followings-${accountId}` },
      ],
    }),

    // ========== Waitlist ==========
    getWaitlist: builder.query<Waitlist[], string>({
      query: (userBookId) => `/waitlist/${userBookId}`,
      providesTags: (_, __, userBookId) => [
        { type: "Waitlist", id: userBookId },
      ],
    }),
    toggleWaitlist: builder.mutation<
      Waitlist,
      { userBookId: string; addToWaitlist: boolean }
    >({
      query: ({ userBookId, addToWaitlist }) => ({
        url: `/waitlist/${userBookId}`,
        method: "POST",
        params: { addToWaitlist },
      }),
      invalidatesTags: (_, __, { userBookId }) => [
        { type: "Waitlist", id: userBookId },
      ],
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateMeMutation,
  useGetSavedPostsQuery,
  useSavePostMutation,
  useUnsavePostMutation,
  useGetSavedBooksQuery,
  useSaveBookMutation,
  useUnsaveBookMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetCartQuery,
  useClearCartMutation,
  useAddCartItemMutation,
  useRemoveCartItemMutation,
  useCheckoutCartMutation,
  useGetNotificationsQuery,
  useGetNotificationByIdQuery,
  useReadAllNotificationsMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCompleteOrderItemMutation,
  useGetOrderItemByIdQuery,
  useGetSalesQuery,
  useGetSaleByIdQuery,
  useAcceptSaleMutation,
  useRejectSaleMutation,
  useCompleteSaleMutation,
  useGetBooksQuery,
  useGetBookByIdQuery,
  useGetBooksByAccountIdQuery,
  useSearchBooksMutation,
  useCreateBooksMutation,
  useUpdateBookByIdMutation,
  useDeleteBookByIdMutation,
  useGetIsbnLookupMutation,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetChildCommentsQuery,
  useGetReadingPostsQuery,
  useGetReadingPostsByAccountQuery,
  useGetReadingPostByIdQuery,
  useCreateReadingPostMutation,
  useUpdateReadingPostMutation,
  useDeleteReadingPostMutation,
  useLikeReadingPostMutation,
  useSearchReadingPostsQuery,
  useGetPostCommentsQuery,
  useGetUserByAccountIdQuery,
  useGetFollowersQuery,
  useGetFollowingsQuery,
  useGetWaitlistQuery,
  useToggleWaitlistMutation,
} = api;
