"use client";

import { useUser } from "@clerk/nextjs";
import { useGetMeQuery } from "@/features/api/baseApi";
import { toUserDisplay } from "@/lib/adapters/me";
import type { UserDisplay } from "@/lib/types/display";

/**
 * Returns current user as UserDisplay: from RTK Query getMe（自動去重、快取）+ Clerk fallback.
 * 登入後多個 component 呼叫也只會打一次 API；需要新資料時可 invalidate Me tag 或 refetch。
 */
export function useCurrentUser(): {
  user: UserDisplay | null;
  isLoaded: boolean;
  isSignedIn: boolean;
} {
  const clerk = useUser();
  const isSignedIn = clerk.isSignedIn ?? false;
  const { data: me } = useGetMeQuery(undefined, {
    skip: !isSignedIn || !clerk.user,
  });

  const isLoaded = clerk.isLoaded;

  if (!isLoaded) {
    return { user: null, isLoaded: false, isSignedIn: false };
  }

  if (!isSignedIn || !clerk.user) {
    return { user: null, isLoaded: true, isSignedIn: false };
  }

  try {
    const display = me
      ? toUserDisplay(me, {
          imageUrl: clerk.user.imageUrl,
          firstName: clerk.user.firstName,
          username: clerk.user.username,
        })
      : toUserDisplay(
          {
            accountId: clerk.user.id,
            email: clerk.user.primaryEmailAddress?.emailAddress ?? "",
            userProfile: {
              displayName: clerk.user.fullName ?? clerk.user.firstName ?? undefined,
              bio: null,
              updatedAt: undefined,
            },
          },
          {
            imageUrl: clerk.user.imageUrl,
            firstName: clerk.user.firstName,
            username: clerk.user.username,
          }
        );
    return { user: display, isLoaded: true, isSignedIn: true };
  } catch {
    // API 回傳格式異常或 toUserDisplay 拋錯時，用 Clerk 組成最小 fallback，避免整頁崩潰
    const name =
      clerk.user.fullName ?? clerk.user.firstName ?? clerk.user.primaryEmailAddress?.emailAddress?.split("@")[0] ?? "使用者";
    const username = clerk.user.username ?? clerk.user.id ?? "user";
    const avatar = clerk.user.imageUrl ?? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop";
    return {
      user: { id: clerk.user.id, name, username, avatar },
      isLoaded: true,
      isSignedIn: true,
    };
  }
}
