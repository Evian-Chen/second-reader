// src/types/readingPost.ts
// Generated from swagger (OpenAPI) schemas & /api/reading-posts endpoints

/* ===========================
 * OpenAPI Schemas (ReadingPost)
 * =========================== */

/** OpenAPI: ReadingPostDto */
export interface ReadingPostDto {
  id?: string; // uuid
  title?: string | null;
  content?: string | null;
  rating?: number; // int32
  likes?: number; // int32
  updatedAt?: string; // date-time (ISO string)
  accountId?: string | null;
}

/** OpenAPI: createReadingPostDto */
export interface CreateReadingPostDto {
  id?: string; // uuid
  title?: string | null;
  content?: string | null;
  rating?: number; // int32
  updatedAt?: string; // date-time (ISO string)
}

/** OpenAPI: LikePostDto */
export interface LikePostDto {
  /** swagger: minimum -1, maximum 1 */
  likeCount?: number; // int32
}

/* ===========================
 * /api/reading-posts Endpoints
 * =========================== */

/**
 * GET /api/reading-posts
 * 200 -> ReadingPostDto[]
 */
export type GetReadingPostsResponse = ReadingPostDto[];

/**
 * POST /api/reading-posts
 * body: CreateReadingPostDto
 * 200 -> ReadingPostDto
 */
export type CreateReadingPostRequest = CreateReadingPostDto;
export type CreateReadingPostResponse = ReadingPostDto;

/**
 * GET /api/reading-posts/{accountId}
 * 200 -> ReadingPostDto[]
 */
export interface GetReadingPostsByAccountIdPath {
  accountId: string;
}
export type GetReadingPostsByAccountIdResponse = ReadingPostDto[];

/**
 * GET /api/reading-posts/{id}
 * 200 -> ReadingPostDto
 */
export interface GetReadingPostByIdPath {
  id: string; // uuid
}
export type GetReadingPostByIdResponse = ReadingPostDto;

/**
 * PUT /api/reading-posts/{id}
 * body: CreateReadingPostDto
 * 200 -> ReadingPostDto
 */
export interface UpdateReadingPostPath {
  id: string; // uuid
}
export type UpdateReadingPostRequest = CreateReadingPostDto;
export type UpdateReadingPostResponse = ReadingPostDto;

/**
 * DELETE /api/reading-posts/{id}
 * 200 -> (no content schema in swagger)
 */
export interface DeleteReadingPostPath {
  id: string; // uuid
}
export type DeleteReadingPostResponse = void;

/**
 * PUT /api/reading-posts/{id}/like
 * body: LikePostDto
 * 200 -> ReadingPostDto
 */
export interface LikeReadingPostPath {
  id: string; // uuid
}
export type LikeReadingPostRequest = LikePostDto;
export type LikeReadingPostResponse = ReadingPostDto;
