"use client";

import type { UserBookSummary, UserBookDetail } from "@/types";
import { mapCategory, mapCondition, DEFAULT_COVER } from "@/types/constants";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";

type Book = UserBookSummary | UserBookDetail;

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const router = useRouter();
  const userBookId = book.userBookId ?? "";
  const bookData: UserBookSummary | undefined =
    "book" in book ? book.book : book;
  const title = bookData?.title ?? "";
  const author = bookData?.author ?? "";
  const bookCategory = bookData?.bookCategory;
  const bookCondition = "bookCondition" in book ? book.bookCondition : undefined;
  const price = "price" in book ? book.price : 0;
  const conditionLabel = mapCondition(bookCondition);
  const categoryLabel = mapCategory(bookCategory);
  const cover = DEFAULT_COVER;
  const queueCount = 0;

  return (
    <article
      onClick={() => router.push(`/book/${userBookId}`)}
      onKeyDown={(e) => e.key === "Enter" && router.push(`/book/${userBookId}`)}
      className="group cursor-pointer"
      role="button"
      tabIndex={0}
    >
      <div className="relative aspect-2/3 mb-3 overflow-hidden rounded bg-muted">
        <img
          src={cover}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          <span className="text-[10px] px-2 py-0.5 bg-background/90 backdrop-blur-sm rounded-full border border-border">
            {conditionLabel}
          </span>
          {queueCount > 0 ? (
            <span className="text-[10px] px-2 py-0.5 bg-foreground/90 text-background backdrop-blur-sm rounded-full flex items-center gap-1">
              <Users className="h-3 w-3" />
              {queueCount}
            </span>
          ) : null}
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium line-clamp-2 leading-tight group-hover:text-muted-foreground transition-colors">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-1"> {author}</p>
        <div className="flex flex-baseline justify-between pt-1">
          <span className="text-sm font-medium">NT$ {price ?? 0}</span>
        </div>
      </div>
    </article>
  );
}
