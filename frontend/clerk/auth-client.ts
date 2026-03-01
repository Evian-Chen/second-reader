"use client";

import { useAuth, useUser } from "@clerk/nextjs";

/**
 * Client-side only. 在 Client Component 使用的方法
 */

/**
 * 認證狀態
 */
export function useAuthClient() {
  const { isSignedIn, userId, getToken } = useAuth();
  const { user } = useUser();

  return {
    isSignedIn,
    userId,
    user,
    getToken: async () => {
      if (isSignedIn) {
        return await getToken();
      }
      return null;
    },
  };
}
