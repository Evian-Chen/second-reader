// src/types/book.ts
// Generated from swagger (OpenAPI) schemas & /api/books parameters

import type { BookCategory, BookCondition, PayMethod, DeliveryMethod, UserBookStatus } from "./Enums";

/* ===========================
 * OpenAPI Schemas (DTOs)
 * =========================== */

/** OpenAPI: UserBookSummaryDto */
export interface UserBookSummaryDto {
  userBookId?: string; // uuid
  isbn?: string | null;
  title?: string | null;
  author?: string | null;
  description?: string | null;
  bookCategory?: BookCategory;
  userBookStatus?: UserBookStatus;
  sellerAccountId?: string | null;
}

/** OpenAPI: UserBookListinDetailDto */
export interface UserBookListinDetailDto {
  userBookId?: string; // uuid
  bookCondition?: BookCondition;
  sellerPayMethods?: PayMethod[] | null;
  sellerDeliveryMethods?: DeliveryMethod[] | null;
  price?: number; // int32
  userBookStatus?: UserBookStatus;
  createdAt?: string; // date-time (ISO string)
  sellerAccountId?: string | null;
  book?: UserBookSummaryDto;
}

/** OpenAPI: UploadUserBooksDto */
export interface UploadUserBooksDto {
  bookCondition?: BookCondition;
  sellerPayMethods?: PayMethod[] | null;
  sellerDeliveryMethods?: DeliveryMethod[] | null;
  price?: number; // int32
  userBookStatus?: UserBookStatus;
  createdAt?: string; // date-time (ISO string)
  book?: UserBookSummaryDto;
}

/** OpenAPI: UpdateUserBookDto */
export interface UpdateUserBookDto {
  bookCondition?: BookCondition;
  sellerPayMethods?: PayMethod[] | null;
  sellerDeliveryMethods?: DeliveryMethod[] | null;
  price?: number; // int32
  userBookStatus?: UserBookStatus;
  createdAt?: string; // date-time (ISO string)
}

/** OpenAPI: GoogleBookResultDto */
export interface GoogleBookResultDto {
  title?: string | null;
  authors?: string[] | null;
  isbn?: string | null;
  previewLink?: string | null;
}

/* ===========================
 * /api/books Endpoints Types (params / body / response)
 * =========================== */

/** GET /api/books?pageNum=&pageSize= -> 200 UserBookSummaryDto[] */
export interface GetBooksQuery {
  pageNum?: number; // int32 (default 1 in swagger)
  pageSize?: number; // int32 (default 10 in swagger)
}
export type GetBooksResponse = UserBookSummaryDto[];

/** POST /api/books (body: UploadUserBooksDto[]) -> 200 UserBookSummaryDto[] */
export type CreateBooksRequest = UploadUserBooksDto[];
export type CreateBooksResponse = UserBookSummaryDto[];

/** GET /api/books/{accountId}?Status= -> 200 UserBookSummaryDto */
export interface GetBooksByAccountIdPath {
  accountId: string;
}
export interface GetBooksByAccountIdQuery {
  Status?: UserBookStatus;
}
export type GetBooksByAccountIdResponse = UserBookSummaryDto;

/** GET /api/books/{id} -> 200 UserBookListinDetailDto */
export interface GetBookByIdPath {
  id: string; // uuid
}
export type GetBookByIdResponse = UserBookListinDetailDto;

/** PUT /api/books/{id} (body: UpdateUserBookDto) -> 200 UserBookListinDetailDto */
export interface UpdateBookByIdPath {
  id: string; // uuid
}
export type UpdateBookByIdRequest = UpdateUserBookDto;
export type UpdateBookByIdResponse = UserBookListinDetailDto;

/** DELETE /api/books/{id}?hard= -> 200 UserBookSummaryDto */
export interface DeleteBookByIdPath {
  id: string; // uuid
}
export interface DeleteBookByIdQuery {
  hard?: boolean;
}
export type DeleteBookByIdResponse = UserBookSummaryDto;

/** POST /api/books/search?title=&author=&sellerAccount=&sellerDisplayName=&BookCategory=&isbn= -> 200 UserBookSummaryDto */
export interface SearchBooksQuery {
  title?: string;
  author?: string;
  sellerAccount?: string;
  sellerDisplayName?: string;
  /** 注意 swagger 的參數名就是 BookCategory（B 大寫） */
  BookCategory?: BookCategory;
  isbn?: string;
}
export type SearchBooksResponse = UserBookSummaryDto;

/** POST /api/books/isbn (multipart/form-data, field: Img) -> 200 GoogleBookResultDto */
export interface IsbnLookupForm {
  Img?: File;
}
export type IsbnLookupResponse = GoogleBookResultDto;
