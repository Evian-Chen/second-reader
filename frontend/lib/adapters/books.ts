import type {
  UserBookSummaryDto,
  UserBookListinDetailDto,
  BookCondition,
  BookCategory,
} from "@/lib/api/types";

import type { BookDisplay } from "@/lib/types/display";

const CONDITION_LABELS: Record<BookCondition, BookDisplay["condition"]> = {
  New: "全新",
  LikelyNew: "近全新",
  Good: "良好",
  Fair: "普通",
  Poor: "較差",
  Bad: "較差",
};

const CATEGORY_LABELS: Record<BookCategory, string> = {
  Undefined: "未分類",
  Mandarin: "華文文學",
  World: "世界文學",
  GenreFic: "類型小說",
  LightNovel: "輕小說",
  Manga: "漫畫",
  Bl: "BL",
  Gl: "GL",
  History: "歷史",
  Poem: "詩詞",
  Art: "藝術",
  Philisophy: "哲學",
  Religion: "宗教",
  Biography: "傳記",
};

const DEFAULT_COVER = "/placeholder-book.svg";

function mapCondition(c?: BookCondition): BookDisplay["condition"] {
  if (!c) return "普通";
  return CONDITION_LABELS[c] ?? "普通";
}

function mapCategory(c?: BookCategory): string {
  if (!c) return "未分類";
  return CATEGORY_LABELS[c] ?? c;
}

/**
 * Map list/summary DTO to display type for cards. Missing cover/price/condition use defaults.
 */
export function toBookDisplay(dto: UserBookSummaryDto): BookDisplay {
  const id = dto.userBookId ?? "";
  return {
    id,
    userId: dto.sellerAccountId ?? "",
    userName: "",
    userAvatar: "",
    title: dto.title ?? "",
    author: dto.author ?? "",
    isbn: dto.isbn ?? undefined,
    cover: DEFAULT_COVER,
    price: 0,
    condition: "普通",
    description: dto.description ?? "",
    category: mapCategory(dto.bookCategory),
    createdAt: "",
    queueCount: 0,
  };
}

/**
 * Map detail DTO to full display type for book detail page.
 */
export function toBookDetailDisplay(dto: UserBookListinDetailDto): BookDisplay {
  const book = dto.book;
  const id = dto.userBookId ?? book?.userBookId ?? "";
  return {
    id,
    userId: dto.sellerAccountId ?? book?.sellerAccountId ?? "",
    userName: "",
    userAvatar: "",
    title: book?.title ?? "",
    author: book?.author ?? "",
    isbn: book?.isbn ?? undefined,
    cover: DEFAULT_COVER,
    price: dto.price ?? 0,
    condition: mapCondition(dto.bookCondition),
    description: book?.description ?? "",
    category: mapCategory(book?.bookCategory),
    createdAt: dto.createdAt ?? "",
    queueCount: 0,
    shippingMethods: dto.sellerDeliveryMethods?.map(String) ?? [],
    paymentMethods: dto.sellerPayMethods?.map(String) ?? [],
  };
}

/**
 * Merge list item with detail when we have both (e.g. list from search then detail fetch).
 */
export function mergeBookDisplay(
  list: BookDisplay,
  detail: Partial<BookDisplay>
): BookDisplay {
  return { ...list, ...detail };
}
