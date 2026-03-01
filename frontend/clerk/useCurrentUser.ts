"use client";

import { useUser } from "@clerk/nextjs";
import { useGetMeQuery } from "@/redux/services/api";
import type { User, UserWithAvatar } from "@/types";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop";

/**
 * 將 User 與 Clerk 的 avatar、username 合併為 UserWithAvatar
 */
function extendUserWithAvatar(
  user: User,
  clerk: { imageUrl?: string | null; username?: string | null }
): UserWithAvatar {
  return {
    ...user,
    avatar: clerk.imageUrl ?? DEFAULT_AVATAR,
    username: clerk.username ?? user.accountId ?? user.email?.split("@")[0] ?? "user",
  };
}

/**
 * API User + Clerk avatar/username.
 * Returns current user as UserWithAvatar
 * 登入後多個 component 呼叫也只會打一次 API；需要新資料時可 invalidate Me tag 或 refetch。
 */
export function useCurrentUser(): {
  user: UserWithAvatar | null;
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
    const baseUser: User = me ?? {
      accountId: clerk.user.id,
      email: clerk.user.primaryEmailAddress?.emailAddress ?? "",
      userProfile: {
        displayName: clerk.user.fullName ?? clerk.user.firstName ?? undefined,
        bio: null,
        updatedAt: undefined,
      },
    };
    const user = extendUserWithAvatar(baseUser, {
      imageUrl: clerk.user.imageUrl,
      username: clerk.user.username,
    });
    return { user, isLoaded: true, isSignedIn: true };
  } catch {
    const baseUser: User = {
      accountId: clerk.user.id,
      email: clerk.user.primaryEmailAddress?.emailAddress ?? "",
      userProfile: {
        displayName:
          clerk.user.fullName ??
          clerk.user.firstName ??
          clerk.user.primaryEmailAddress?.emailAddress?.split("@")[0] ??
          "使用者",
        bio: null,
        updatedAt: undefined,
      },
    };
    return {
      user: extendUserWithAvatar(baseUser, {
        imageUrl: clerk.user.imageUrl ?? DEFAULT_AVATAR,
        username: clerk.user.username ?? clerk.user.id ?? "user",
      }),
      isLoaded: true,
      isSignedIn: true,
    };
  }
}
