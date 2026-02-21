import type { UserDto } from "@/lib/api/types";
import type { UserDisplay } from "@/lib/types/display";

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop";

export interface MeAdapterOptions {
  /** Clerk imageUrl for avatar when available */
  imageUrl?: string | null;
  /** Clerk firstName for display name fallback */
  firstName?: string | null;
  /** Clerk username if available */
  username?: string | null;
}

/**
 * Map API me (UserDto) + optional Clerk data to UserDisplay for Navbar/Profile.
 */
export function toUserDisplay(
  dto: UserDto,
  options: MeAdapterOptions = {}
): UserDisplay {
  const name =
    dto.userProfile?.displayName?.trim() ||
    options.firstName ||
    dto.email?.split("@")[0] ||
    "使用者";
  const username =
    options.username || dto.accountId || dto.email?.split("@")[0] || "user";
  const avatar = options.imageUrl || DEFAULT_AVATAR;

  return {
    id: dto.accountId,
    name,
    username,
    avatar,
    bio: dto.userProfile?.bio ?? undefined,
    followers: 0,
    following: 0,
  };
}
