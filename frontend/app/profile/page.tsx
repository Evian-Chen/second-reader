"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid3x3, BookOpen } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { BookCard } from "@/components/BookCard";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { mockPosts } from "@/lib/mock/posts";
import { booksApi } from "@/lib/api/books";
import { toBookDisplay } from "@/lib/adapters/books";
import type { BookDisplay } from "@/lib/types/display";
import { useState, useEffect } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProfileErrorBoundary } from "@/components/ProfileErrorBoundary";

export default function ProfilePage() {
  const { user, isSignedIn } = useCurrentUser();
  const [myBooks, setMyBooks] = useState<BookDisplay[]>([]);

  useEffect(() => {
    if (!user?.id) {
      setMyBooks([]);
      return;
    }
    booksApi
      .getBooksByAccountId({ accountId: user.id })
      .then((list) => setMyBooks(list.map(toBookDisplay)))
      .catch(() => setMyBooks([]));
  }, [user?.id]);

  const myPosts = isSignedIn && user
    ? mockPosts.filter((post) => post.userId === user.id)
    : [];

  return (
    <ProfileErrorBoundary>
      <div className="min-h-screen">
        <SignedOut>
        <div className="mx-auto max-w-4xl px-6 py-12 text-center">
          <p className="text-muted-foreground mb-4">請先登入以查看個人頁面</p>
          <Link href="/">
            <Button>返回首頁</Button>
          </Link>
        </div>
      </SignedOut>

      <SignedIn>
        {user ? (
          <>
            <div className="border-b border-border">
              <div className="mx-auto max-w-4xl px-6 py-8">
                <div className="flex gap-6">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-24 w-24 rounded-full object-cover ring-1 ring-border"
                  />
                  <div className="flex-1">
                    <h1 className="text-xl font-medium mb-1">{user.name}</h1>
                    <p className="text-sm text-muted-foreground">
                      @{user.username}
                    </p>
                    {user.bio ? (
                      <p className="text-sm text-muted-foreground mt-2">
                        {user.bio}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-4xl px-6 py-8">
              <Tabs defaultValue="posts" className="w-full">
                <TabsList className="w-full justify-start h-12 bg-transparent p-0 gap-8 border-b border-border rounded-none">
                  <TabsTrigger
                    value="posts"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-0 text-[13px]"
                  >
                    <Grid3x3 className="h-4 w-4 mr-2" />
                    貼文
                  </TabsTrigger>
                  <TabsTrigger
                    value="books"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-0 text-[13px]"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    書籍
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="m-0 mt-6">
                  {myPosts.length > 0 ? (
                    <div className="space-y-0 divide-y divide-border">
                      {myPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <p className="text-sm text-muted-foreground">
                        尚無貼文
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="books" className="m-0 mt-6">
                  {myBooks.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                      {myBooks.map((book) => (
                        <BookCard key={book.id} book={book} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <p className="text-sm text-muted-foreground">
                        尚未上架書籍
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </>
        ) : (
          <div className="mx-auto max-w-4xl px-6 py-12 text-center">
            <p className="text-muted-foreground">載入中...</p>
          </div>
        )}
      </SignedIn>
      </div>
    </ProfileErrorBoundary>
  );
}
