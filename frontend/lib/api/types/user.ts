export interface UserProfileDto {
  bio?: string | null;
  displayName?: string | null;
  updatedAt?: string;
}

export interface UserDto {
  accountId: string;
  email: string;
  isSuspicious?: boolean;
  createdAt?: string;
  instagramAccount?: string | null;
  threadsAccount?: string | null;
  userProfile?: UserProfileDto;
}

export interface UpdateUserDto {
  accountId: string;
  email: string;
  instagramAccount?: string | null;
  threadsAccount?: string | null;
  userProfile?: UserProfileDto;
}

/* ========== GET /api/me ========== */
export type GetMeResponse = UserDto;

/* ========== PUT /api/me ========== */
export type UpdateMeBody = UpdateUserDto;
export type UpdateMeResponse = UserDto;
