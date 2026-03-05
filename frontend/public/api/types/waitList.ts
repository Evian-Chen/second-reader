// src/types/waitList.ts
// Generated from swagger (OpenAPI) schemas & /api/waitlist endpoints

/* ===========================
 * OpenAPI Schemas (Waitlist)
 * =========================== */

import type { WaitlistStatus } from "./Enums";

/** OpenAPI: WaitlistDto */
export interface WaitlistDto {
  userBookId?: string; // uuid
  waiterAccountId?: string | null;
  createdAt?: string; // date-time (ISO string)
  waitlistStatus?: WaitlistStatus;
}

/* ===========================
 * /api/waitlist/{userBookId} Endpoints
 * =========================== */

/**
 * GET /api/waitlist/{userBookId}
 * Summary: 取得特定書籍的排隊狀態
 * 200 -> WaitlistDto[]
 */
export interface GetWaitlistByUserBookIdPath {
  userBookId: string; // uuid
}
export type GetWaitlistByUserBookIdResponse = WaitlistDto[];

/**
 * POST /api/waitlist/{userBookId}?addToWaitlist=
 * Summary: 加入或取消排隊一本書
 * 200 -> WaitlistDto
 */
export interface ToggleWaitlistPath {
  userBookId: string; // uuid
}
export interface ToggleWaitlistQuery {
  /** 是否加入排隊 */
  addToWaitlist?: boolean;
}
export type ToggleWaitlistResponse = WaitlistDto;
