"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/PostCard";
import { BookCard } from "@/components/BookCard";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { useGetBooksQuery } from "@/redux/services/api";
import type { UserBookSummary, UserBookDetail } from "@/types";
import { mapCategory, mapCondition } from "@/types/constants";
import { mockPosts } from "@/lib/mock/posts";
import { bookCategories } from "@/types/constants";
import { useCurrentUser } from "@/clerk/useCurrentUser";

type SortBy = "latest" | "price-low" | "price-high" | "queue";

export default function Home() {
  const { user } = useCurrentUser();
  const { data: booksDto = [], isLoading: booksStatus } = useGetBooksQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [postSearchQuery, setPostSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    noQueue: false,
    hasQueue: false,
    condition: null as string | null,
    category: null as string | null,
    sortBy: "latest" as SortBy,
  });

  const filteredBooks = booksDto
    .filter((book) => {
      const bookData = book;
      const title = bookData.title ?? "";
      const author = bookData.author ?? "";
      const categoryLabel = mapCategory(bookData.bookCategory);
      const conditionLabel = mapCondition(
        "bookCondition" in book
          ? (book as UserBookDetail).bookCondition
          : undefined
      );
      const matchesSearch =
        searchQuery === "" ||
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesNoQueue = !filters.noQueue || 0 === 0;
      const matchesHasQueue = !filters.hasQueue || 0 > 0;
      const matchesCondition =
        !filters.condition || conditionLabel === filters.condition;
      const matchesCategory =
        !filters.category || categoryLabel === filters.category;
      return (
        matchesSearch &&
        matchesNoQueue &&
        matchesHasQueue &&
        matchesCondition &&
        matchesCategory
      );
    })
    .toSorted((a, b) => {
      const priceA =
        "price" in a && typeof (a as UserBookDetail).price === "number"
          ? (a as UserBookDetail).price ?? 0
          : 0;
      const priceB =
        "price" in b && typeof (b as UserBookDetail).price === "number"
          ? (b as UserBookDetail).price ?? 0
          : 0;
      switch (filters.sortBy) {
        case "price-low":
          return priceA - priceB;
        case "price-high":
          return priceB - priceA;
        case "queue":
          return 0 - 0;
        default:
          return 0;
      }
    });

  const filteredPosts = mockPosts.filter(
    (post) =>
      postSearchQuery === "" ||
      post.content.toLowerCase().includes(postSearchQuery.toLowerCase()) ||
      (post.bookTitle?.toLowerCase().includes(postSearchQuery.toLowerCase()) ??
        false) ||
      post.userName.toLowerCase().includes(postSearchQuery.toLowerCase())
  );

  const setSortBy = (sortBy: SortBy) =>
    setFilters((prev) => ({ ...prev, sortBy }));
  const setNoQueue = (noQueue: boolean) =>
    setFilters((prev) => ({
      ...prev,
      noQueue,
      hasQueue: noQueue ? false : prev.hasQueue,
    }));
  const setHasQueue = (hasQueue: boolean) =>
    setFilters((prev) => ({
      ...prev,
      hasQueue,
      noQueue: hasQueue ? false : prev.noQueue,
    }));

  return (
    <div className="min-h-screen">
      <Tabs defaultValue="posts" className="w-full gap-0">
        <div className="sticky top-14 z-40 bg-background border-b border-border">
          <div className="mx-auto max-w-7xl">
            <TabsList className="h-12 bg-transparent w-auto p-0">
              <TabsTrigger
                value="posts"
                className="h-11 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent bg-transparent px-0 text-[13px] data-[state=active]:shadow-none"
              >
                閱讀分享
              </TabsTrigger>
              <TabsTrigger
                value="marketplace"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent bg-transparent px-0 text-[13px] data-[state=active]:shadow-none"
              >
                二手書市集
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="posts" className="m-0">
          <div className="mx-auto max-w-2xl px-6 py-8">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜尋貼文..."
                  className="pl-7 h-9 border-0 border-b border-border rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-foreground"
                  value={postSearchQuery}
                  onChange={(e) => setPostSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-8">
              <CreatePostDialog>
                <button
                  type="button"
                  className="w-full text-left border border-border rounded-lg p-4 hover:border-foreground/40 transition-colors flex items-center gap-3"
                >
                  {user ? (
                    <img
                      src={user.avatar}
                      alt={user.userProfile?.displayName ?? user.username ?? "使用者"}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    分享你的閱讀心得...
                  </span>
                </button>
              </CreatePostDialog>
            </div>

            <div className="space-y-0 divide-y divide-border">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-sm text-muted-foreground">找不到相關貼文</p>
              </div>
            ) : null}
          </div>
        </TabsContent>

        <TabsContent value="marketplace" className="m-0">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="mb-6 max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜尋書名、作者..."
                    className="pl-7 h-9 border-0 border-b border-border rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-foreground"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      篩選
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>排序方式</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setSortBy("latest")}>
                      {filters.sortBy === "latest" ? "✓ " : ""}最新上架
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("price-low")}>
                      {filters.sortBy === "price-low" ? "✓ " : ""}價格：低到高
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("price-high")}>
                      {filters.sortBy === "price-high" ? "✓ " : ""}價格：高到低
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("queue")}>
                      {filters.sortBy === "queue" ? "✓ " : ""}排隊人數
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>排隊狀態</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem
                      checked={filters.noQueue}
                      onCheckedChange={(checked: boolean | "indeterminate") =>
                        setNoQueue(checked === true)
                      }
                    >
                      不需要排隊
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filters.hasQueue}
                      onCheckedChange={(checked: boolean | "indeterminate") =>
                        setHasQueue(checked === true)
                      }
                    >
                      需要排隊
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>書籍狀態</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, condition: null }))
                      }
                    >
                      {!filters.condition ? "✓ " : ""}全部狀態
                    </DropdownMenuItem>
                    {(["全新", "近全新", "良好", "普通"] as const).map(
                      (condition) => (
                        <DropdownMenuItem
                          key={condition}
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              condition,
                            }))
                          }
                        >
                          {filters.condition === condition ? "✓ " : ""}
                          {condition}
                        </DropdownMenuItem>
                      )
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>書籍類型</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, category: null }))
                      }
                    >
                      {!filters.category ? "✓ " : ""}全部類型
                    </DropdownMenuItem>
                    {bookCategories.map((category) => (
                      <DropdownMenuItem
                        key={category}
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, category }))
                        }
                      >
                        {filters.category === category ? "✓ " : ""}
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {bookCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSearchQuery(category)}
                    className="px-3 py-1.5 text-xs border border-border rounded-full hover:bg-foreground hover:text-background transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {booksStatus ? (
              <div className="text-center py-16">
                <p className="text-sm text-muted-foreground">載入中...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {filteredBooks.map((book) => (
                    <BookCard key={book.userBookId ?? ""} book={book} />
                  ))}
                </div>

                {filteredBooks.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-sm text-muted-foreground">
                      找不到相關書籍
                    </p>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
