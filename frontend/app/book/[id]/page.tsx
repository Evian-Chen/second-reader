"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Share2, Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useGetBookByIdQuery } from "@/redux/services/api";
import type { UserBookDetail } from "@/types";
import { mapCategory, mapCondition, DEFAULT_COVER } from "@/types/constants";

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const { data: book, isLoading: loading } = useGetBookByIdQuery(id, {
    skip: !id,
  });
  const [isFavorite, setIsFavorite] = useState(false);
  const [isQueued, setIsQueued] = useState(false);
  const [inCart, setInCart] = useState(false);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-muted-foreground">載入中...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-muted-foreground">找不到此書籍</p>
        <Button onClick={() => router.push("/")} className="mt-4">
          返回首頁
        </Button>
      </div>
    );
  }

  const handleQueue = () => {
    setIsQueued((prev) => !prev);
  };

  const handleAddToCart = () => {
    setInCart((prev) => !prev);
  };

  const handleShare = () => {
    const bookUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/book/${book.userBookId ?? ""}`
        : "";
    void navigator.clipboard.writeText(bookUrl);
  };

  const conditionLabel = mapCondition(book.bookCondition);
  const categoryLabel = mapCategory(book.book?.bookCategory);
  const conditionColorClass =
    conditionLabel === "全新"
      ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
      : conditionLabel === "近全新"
        ? "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
        : conditionLabel === "良好"
          ? "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800"
          : "bg-muted text-muted-foreground border-border";

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        返回
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card border rounded-lg p-8">
          <img
            src={DEFAULT_COVER}
            alt={book.book?.title ?? ""}
            className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
          />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-start gap-3 mb-2">
              <h1 className="text-3xl font-bold flex-1">{book.book?.title ?? ""}</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFavorite((prev) => !prev)}
              >
                <Heart
                  className={`h-6 w-6 ${
                    isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                  }`}
                />
              </Button>
            </div>
            <p className="text-xl text-muted-foreground mb-4">{book.book?.author ?? ""}</p>
            <div className="flex items-center gap-3 mb-4">
              <Badge className={conditionColorClass}>{conditionLabel}</Badge>
              <Badge variant="outline">{categoryLabel}</Badge>
            </div>
            <div className="text-4xl font-bold text-primary mb-6">
              NT$ {book.price ?? 0}
            </div>
          </div>

          {book.sellerAccountId ? (
            <div className="border border-border rounded-lg p-4 bg-muted/30">
              <p className="text-xs text-muted-foreground mb-2">賣家資訊</p>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  ?
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">賣家</p>
                  <p className="text-xs text-muted-foreground">
                    上架於 {book.createdAt ?? "—"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/profile/${book.sellerAccountId}`)}
                >
                  查看賣場
                </Button>
              </div>
            </div>
          ) : null}

          <div>
            <h3 className="font-medium mb-2 text-sm">書籍描述</h3>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              {book.book?.description ?? "暫無描述"}
            </p>
          </div>

          {0 > 0 ? (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                目前 0 人排隊中
              </span>
            </div>
          ) : null}

          <div className="flex gap-3">
            <Button
              className="flex-1 gap-2"
              size="lg"
              onClick={handleAddToCart}
              variant={inCart ? "outline" : "default"}
            >
              <ShoppingCart className="h-5 w-5" />
              {inCart ? "已在購物車" : "加入購物車"}
            </Button>
            <Button
              className="flex-1 gap-2"
              size="lg"
              onClick={handleQueue}
              variant={isQueued ? "outline" : "default"}
            >
              <Users className="h-5 w-5" />
              {isQueued ? "已排隊 (0)" : "加入排隊"}
            </Button>
            <Button variant="outline" size="lg" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <div className="border border-border rounded-lg p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground">
              💡 排隊機制：當此書籍被預訂或已售出後，您可以加入排隊等候。當書籍重新上架或有新的相同書籍時，系統會依排隊順序通知您。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
