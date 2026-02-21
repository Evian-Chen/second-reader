"use client";

import { useUser } from "@clerk/nextjs";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { fetchMe } from "@/features/user/userSlice";
import { toUserDisplay } from "@/lib/adapters/me";
import type { UserDisplay } from "@/lib/types/display";
import { useEffect } from "react";

/**
 * Returns current user as UserDisplay: from Redux me (after fetchMe) + Clerk fallback.
 * Dispatches fetchMe when signed in and me not loaded.
 */
export function useCurrentUser(): {
  user: UserDisplay | null;
  isLoaded: boolean;
  isSignedIn: boolean;
} {
  const clerk = useUser();
  const dispatch = useAppDispatch();
  const me = useAppSelector((s) => s.user.me);
  const meStatus = useAppSelector((s) => s.user.status);

  useEffect(() => {
    if (clerk.isSignedIn && clerk.user && meStatus === "idle") {
      void dispatch(fetchMe());
    }
  }, [clerk.isSignedIn, clerk.user, meStatus, dispatch]);

  const isLoaded = clerk.isLoaded;
  const isSignedIn = clerk.isSignedIn ?? false;

  if (!isLoaded) {
    return { user: null, isLoaded: false, isSignedIn: false };
  }

  if (!isSignedIn || !clerk.user) {
    return { user: null, isLoaded: true, isSignedIn: false };
  }

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
}
