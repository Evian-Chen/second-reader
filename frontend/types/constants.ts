import type { BookCondition, BookCategory } from "./enums";

export type BookConditionLabel =
  | "全新"
  | "近全新"
  | "良好"
  | "普通"
  | "較差";

export const BOOK_CONDITION_LABELS: Record<BookCondition, BookConditionLabel> =
  {
    New: "全新",
    LikelyNew: "近全新",
    Good: "良好",
    Fair: "普通",
    Poor: "較差",
    Bad: "較差",
  };

export const BOOK_CATEGORY_LABELS: Record<BookCategory, string> = {
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

export const DEFAULT_COVER = "/placeholder-book.svg";

export function mapCondition(c?: BookCondition): BookConditionLabel {
  if (!c) return "普通";
  return BOOK_CONDITION_LABELS[c] ?? "普通";
}

export function mapCategory(c?: BookCategory): string {
  if (!c) return "未分類";
  return BOOK_CATEGORY_LABELS[c] ?? c;
}
