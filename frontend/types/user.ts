export interface UserProfile {
  bio?: string | null;
  displayName?: string | null;
  updatedAt?: string;
}

export interface User {
  accountId: string;
  email: string;
  isSuspicious?: boolean;
  createdAt?: string;
  instagramAccount?: string | null;
  threadsAccount?: string | null;
  userProfile?: UserProfile;
}

/** User + Clerk 的 avatar、username（API 無此欄位時由 Clerk 補上） */
export interface UserWithAvatar extends User {
  avatar?: string;
  username?: string;
}

export interface UpdateUserInput {
  accountId: string;
  email: string;
  instagramAccount?: string | null;
  threadsAccount?: string | null;
  userProfile?: UserProfile;
}

export type GetMeResponse = User;
export type UpdateMeBody = UpdateUserInput;
export type UpdateMeResponse = User;
