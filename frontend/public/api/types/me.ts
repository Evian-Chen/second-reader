// src/types/me.ts
// Generated from swagger (OpenAPI) schemas & /api/me + /api/me/notification endpoints

/* ===========================
 * OpenAPI Schemas (Me)
 * =========================== */

/** OpenAPI: UserProfileDto */
export interface UserProfileDto {
  bio?: string | null;
  displayName?: string | null;
  updatedAt?: string; // date-time (ISO string)
}

/** OpenAPI: UserDto (required: accountId, email) */
export interface UserDto {
  accountId: string;
  email: string; // email
  isSuspicious?: boolean;
  createdAt?: string; // date-time
  instagramAccount?: string | null;
  threadsAccount?: string | null;
  userProfile?: UserProfileDto;
}

/** OpenAPI: UpdateUserDto (required: accountId, email) */
export interface UpdateUserDto {
  accountId: string;
  email: string; // email
  instagramAccount?: string | null;
  threadsAccount?: string | null;
  userProfile?: UserProfileDto;
}

/* ===========================
 * /api/me Endpoints
 * =========================== */

/** GET /api/me -> 200 UserDto */
export type GetMeResponse = UserDto;

/** PUT /api/me (body: UpdateUserDto) -> 200 UserDto */
export type UpdateMeRequest = UpdateUserDto;
export type UpdateMeResponse = UserDto;


