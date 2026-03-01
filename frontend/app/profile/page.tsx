"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid3x3, BookOpen, Heart } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { BookCard } from "@/components/BookCard";
import { useCurrentUser } from "@/clerk/useCurrentUser";
import { useGetBooksByAccountIdQuery, useGetSavedPostsQuery, useGetSavedBooksQuery } from "@/redux/services/api";
import { mockPosts } from "@/lib/mock/posts";
import type { UserBookSummary } from "@/types";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProfileErrorBoundary } from "@/components/ProfileErrorBoundary";

export default function ProfilePage() {
  const { user, isSignedIn } = useCurrentUser();
  const { data: booksDto = [] } = useGetBooksByAccountIdQuery(
    { accountId: user?.accountId ?? "" },
    { skip: !user?.accountId }
  );
  const { data: savedPosts = [] } = useGetSavedPostsQuery(undefined, {
    skip: !isSignedIn,
  });
  const { data: savedBooks = [] } = useGetSavedBooksQuery(undefined, {
    skip: !isSignedIn,
  });
  const myBooks: UserBookSummary[] = user?.accountId ? booksDto : [];

  const myPosts = isSignedIn && user
    ? mockPosts.filter((post) => post.accountId === user.accountId)
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
                    alt={user.userProfile?.displayName ?? user.username ?? "使用者"}
                    className="h-24 w-24 rounded-full object-cover ring-1 ring-border"
                  />
                  <div className="flex-1">
                    <h1 className="text-xl font-medium mb-1">{user.userProfile?.displayName ?? user.username ?? "使用者"}</h1>
                    <p className="text-sm text-muted-foreground">
                      @{user.username}
                    </p>
                    {user.userProfile?.bio ? (
                      <p className="text-sm text-muted-foreground mt-2">
                        {user.userProfile.bio}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-4xl px-6 py-8">
              <Tabs defaultValue="posts" className="w-full">
                <TabsList className="w-full justify-start h-12 bg-transparent p-0 border-b border-border rounded-none">
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
                  <TabsTrigger
                    value="saved-posts"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-0 text-[13px] gap-2"
                  >
                    <Heart className="h-4 w-4" />
                    貼文收藏
                  </TabsTrigger>
                  <TabsTrigger
                    value="saved-books"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-0 text-[13px] gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    書籍收藏
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
                      <Grid3x3 className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
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
                        <BookCard key={book.userBookId ?? ""} book={book} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <BookOpen className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        尚未上架書籍
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="saved-posts" className="m-0 mt-6">
                  {savedPosts.length > 0 ? (
                    <div className="space-y-0 divide-y divide-border">
                      {savedPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <Heart className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        還沒有收藏任何貼文
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="saved-books" className="m-0 mt-6">
                  {savedBooks.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                      {savedBooks.map((book) => (
                        <BookCard key={book.userBookId ?? ""} book={book} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <Heart className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        還沒有收藏任何書籍
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
