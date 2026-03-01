import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getApiBaseUrl, getAuthHeaders } from "@/lib/api/client";
import type { UserDto, UpdateUserDto } from "@/lib/api/types";

/**
 * RTK Query base API：
 * - 使用現有 API client 的 base URL 與 getToken（ApiAuthSetter 注入 Clerk）
 * - 多個 component 用同一個 endpoint 會自動去重、共用快取
 */
export const baseApi = createApi({
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
  tagTypes: ["Me"],
  endpoints: (builder) => ({
    getMe: builder.query<UserDto, void>({
      query: () => "/me",
      providesTags: ["Me"],
    }),
    updateMe: builder.mutation<UserDto, UpdateUserDto>({
      query: (body) => ({
        url: "/me",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Me"],
    }),
  }),
});

export const { useGetMeQuery, useUpdateMeMutation } = baseApi;
