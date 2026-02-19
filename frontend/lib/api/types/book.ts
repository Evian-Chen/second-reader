import type {
  BookCategory,
  BookCondition,
  DeliveryMethod,
  PayMethod,
  UserBookStatus,
} from "./enums";

export interface UserBookSummaryDto {
  userBookId?: string;
  isbn?: string | null;
  title?: string | null;
  author?: string | null;
  description?: string | null;
  bookCategory?: BookCategory;
  userBookStatus?: UserBookStatus;
  sellerAccountId?: string | null;
}

export interface UserBookListinDetailDto {
  userBookId?: string;
  bookCondition?: BookCondition;
  sellerPayMethods?: PayMethod[] | null;
  sellerDeliveryMethods?: DeliveryMethod[] | null;
  price?: number;
  userBookStatus?: UserBookStatus;
  createdAt?: string;
  sellerAccountId?: string | null;
  book?: UserBookSummaryDto;
}

export interface UploadUserBooksDto {
  bookCondition?: BookCondition;
  sellerPayMethods?: PayMethod[] | null;
  sellerDeliveryMethods?: DeliveryMethod[] | null;
  price?: number;
  userBookStatus?: UserBookStatus;
  createdAt?: string;
  book?: UserBookSummaryDto;
}

export interface UpdateUserBookDto {
  bookCondition?: BookCondition;
  sellerPayMethods?: PayMethod[] | null;
  sellerDeliveryMethods?: DeliveryMethod[] | null;
  price?: number;
  userBookStatus?: UserBookStatus;
  createdAt?: string;
}

export interface GoogleBookResultDto {
  title?: string | null;
  authors?: string[] | null;
  isbn?: string | null;
  previewLink?: string | null;
}

/* ========== GET /api/books ========== */
export interface GetBooksParams {
  pageNum?: number;
  pageSize?: number;
}
export type GetBooksResponse = UserBookSummaryDto[];

/* ========== POST /api/books ========== */
export type CreateBooksBody = UploadUserBooksDto[];
export type CreateBooksResponse = UserBookSummaryDto[];

/* ========== GET /api/books/{accountId} ========== */
export interface GetBooksByAccountIdParams {
  accountId: string;
  Status?: UserBookStatus;
}
export type GetBooksByAccountIdResponse = UserBookSummaryDto[];

/* ========== GET /api/books/{id} ========== */
export interface GetBookByIdParams {
  id: string;
}
export type GetBookByIdResponse = UserBookListinDetailDto;

/* ========== PUT /api/books/{id} ========== */
export interface UpdateBookByIdParams {
  id: string;
}
export type UpdateBookByIdBody = UpdateUserBookDto;
export type UpdateBookByIdResponse = UserBookListinDetailDto;

/* ========== DELETE /api/books/{id} ========== */
export interface DeleteBookByIdParams {
  id: string;
  hard?: boolean;
}
export type DeleteBookByIdResponse = UserBookSummaryDto;

/* ========== POST /api/books/search ========== */
export interface SearchBooksParams {
  title?: string;
  author?: string;
  sellerAccount?: string;
  sellerDisplayName?: string;
  BookCategory?: BookCategory;
  isbn?: string;
}
export type SearchBooksResponse = UserBookSummaryDto[];

/* ========== POST /api/books/isbn (multipart) ========== */
export type IsbnLookupResponse = GoogleBookResultDto;
