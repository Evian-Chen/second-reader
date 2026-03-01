import type {
  BookCategory,
  BookCondition,
  DeliveryMethod,
  PayMethod,
  UserBookStatus,
  WaitlistStatus,
} from "./enums";

export interface UserBookSummary {
  userBookId?: string;
  isbn?: string | null;
  title?: string | null;
  author?: string | null;
  description?: string | null;
  bookCategory?: BookCategory;
  userBookStatus?: UserBookStatus;
  sellerAccountId?: string | null;
  price?: number;
}

/** API 回傳的收藏書籍結構 (GET /me/saved/books) */
export interface SavedBookResponse {
  book: UserBookSummary;
  userAccountId: string;
}

export interface UserBookDetail {
  userBookId?: string;
  bookCondition?: BookCondition;
  sellerPayMethods?: PayMethod[] | null;
  sellerDeliveryMethods?: DeliveryMethod[] | null;
  price?: number;
  userBookStatus?: UserBookStatus;
  createdAt?: string;
  sellerAccountId?: string | null;
  book?: UserBookSummary;
}

export interface UploadUserBook {
  bookCondition?: BookCondition;
  sellerPayMethods?: PayMethod[] | null;
  sellerDeliveryMethods?: DeliveryMethod[] | null;
  price?: number;
  userBookStatus?: UserBookStatus;
  createdAt?: string;
  book?: UserBookSummary;
}

export interface UpdateUserBook {
  bookCondition?: BookCondition;
  sellerPayMethods?: PayMethod[] | null;
  sellerDeliveryMethods?: DeliveryMethod[] | null;
  price?: number;
  userBookStatus?: UserBookStatus;
  createdAt?: string;
}

export interface GoogleBookResult {
  title?: string | null;
  authors?: string[] | null;
  isbn?: string | null;
  previewLink?: string | null;
}

export interface GetBooksParams {
  pageNum?: number;
  pageSize?: number;
}
export type GetBooksResponse = UserBookSummary[];

export type CreateBooksBody = UploadUserBook[];
export type CreateBooksResponse = UserBookSummary[];

export interface GetBooksByAccountIdParams {
  accountId: string;
  Status?: UserBookStatus;
}
export type GetBooksByAccountIdResponse = UserBookSummary[];

export interface GetBookByIdParams {
  id: string;
}
export type GetBookByIdResponse = UserBookDetail;

export interface UpdateBookByIdParams {
  id: string;
}
export type UpdateBookByIdBody = UpdateUserBook;
export type UpdateBookByIdResponse = UserBookDetail;

export interface DeleteBookByIdParams {
  id: string;
  hard?: boolean;
}
export type DeleteBookByIdResponse = UserBookSummary;

export interface SearchBooksParams {
  title?: string;
  author?: string;
  sellerAccount?: string;
  sellerDisplayName?: string;
  BookCategory?: BookCategory;
  isbn?: string;
  keyword?: string;
}
export type SearchBooksResponse = UserBookSummary[];

export type IsbnLookupResponse = GoogleBookResult;

// --- Waitlist ---
export interface Waitlist {
  userBookId: string;
  waiterAccountId?: string | null;
  createdAt?: string;
  waitlistStatus?: WaitlistStatus;
}
