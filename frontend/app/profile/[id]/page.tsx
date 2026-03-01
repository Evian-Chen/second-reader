"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid3x3, BookOpen, ArrowLeft, UserPlus, UserMinus, MoreHorizontal, Flag, Ban } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { BookCard } from "@/components/BookCard";
import {
  useGetUserByAccountIdQuery,
  useGetBooksByAccountIdQuery,
  useGetReadingPostsByAccountQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetFollowersQuery,
  useGetFollowingsQuery,
} from "@/redux/services/api";
import { useCurrentUser } from "@/clerk/useCurrentUser";
import type { UserBookSummary } from "@/types";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop";

export default function ProfileByIdPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const { user: currentUser, isSignedIn } = useCurrentUser();
  const isOwnProfile = isSignedIn && currentUser?.accountId === id;

  const { data: viewingUser, isLoading, error } = useGetUserByAccountIdQuery(id, {
    skip: !id,
  });
  const { data: userBooks = [] } = useGetBooksByAccountIdQuery(
    { accountId: id },
    { skip: !id }
  );
  const { data: userPosts = [] } = useGetReadingPostsByAccountQuery(id, {
    skip: !id,
  });
  const { data: followers = [] } = useGetFollowersQuery(id, { skip: !id });
  const { data: followings = [] } = useGetFollowingsQuery(id, { skip: !id });
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const isFollowingFromApi = followers.some(
    (f) => f.followerAccountId === currentUser?.accountId
  );
  const [isFollowing, setIsFollowing] = useState(isFollowingFromApi);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  useEffect(() => {
    setIsFollowing(isFollowingFromApi);
  }, [isFollowingFromApi]);

  const handleFollow = async () => {
    if (!isSignedIn) {
      toast.error("請先登入");
      return;
    }
    try {
      if (isFollowing) {
        await unfollowUser(id).unwrap();
        setIsFollowing(false);
        toast.success("已取消追蹤");
      } else {
        await followUser(id).unwrap();
        setIsFollowing(true);
        toast.success("已追蹤");
      }
    } catch {
      toast.error("操作失敗");
    }
  };

  const handleBlock = () => {
    setBlockDialogOpen(false);
    toast.success("已封鎖（此功能為示意）");
    router.push("/");
  };

  const handleReport = () => {
    setReportDialogOpen(false);
    toast.success("已送出檢舉（此功能為示意）");
  };

  const displayName =
    viewingUser?.userProfile?.displayName ??
    viewingUser?.email?.split("@")[0] ??
    "使用者";
  const username = viewingUser?.email?.split("@")[0] ?? id;
  const avatar = DEFAULT_AVATAR;

  if (isOwnProfile) {
    router.replace("/profile");
    return null;
  }

  if (isLoading || !id) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 text-center">
        <p className="text-muted-foreground">載入中...</p>
      </div>
    );
  }

  if (error || !viewingUser) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 text-center">
        <p className="text-muted-foreground mb-4">找不到此使用者</p>
        <Link href="/">
          <Button>返回首頁</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-3">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            返回
          </Button>
        </div>
      </div>

      <div className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="flex gap-6 mb-6">
            <img
              src={avatar}
              alt={displayName}
              className="h-24 w-24 rounded-full object-cover ring-1 ring-border"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-xl font-medium mb-1">{displayName}</h1>
                  <p className="text-sm text-muted-foreground">@{username}</p>
                </div>
                <SignedIn>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleFollow}
                      size="sm"
                      variant={isFollowing ? "outline" : "default"}
                      className="gap-2"
                    >
                      {isFollowing ? (
                        <>
                          <UserMinus className="h-4 w-4" />
                          取消追蹤
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4" />
                          追蹤
                        </>
                      )}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setReportDialogOpen(true)}>
                          <Flag className="mr-2 h-4 w-4" />
                          檢舉使用者
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setBlockDialogOpen(true)}
                          className="text-destructive"
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          封鎖使用者
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </SignedIn>
              </div>
              {viewingUser.userProfile?.bio ? (
                <p className="text-[15px] leading-relaxed mb-4 max-w-2xl">
                  {viewingUser.userProfile.bio}
                </p>
              ) : null}
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="font-medium">{viewingUser.userProfile?.followerCount ?? followers.length}</span>
                  <span className="text-muted-foreground ml-1.5">粉絲</span>
                </div>
                <div>
                  <span className="font-medium">{viewingUser.userProfile?.followingCount ?? followings.length}</span>
                  <span className="text-muted-foreground ml-1.5">追蹤中</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="w-full h-12 bg-transparent p-0 gap-8 justify-start">
              <TabsTrigger
                value="posts"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent bg-transparent px-0 text-[13px] data-[state=active]:shadow-none gap-2"
              >
                <Grid3x3 className="h-4 w-4" />
                貼文
              </TabsTrigger>
              <TabsTrigger
                value="books"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent bg-transparent px-0 text-[13px] data-[state=active]:shadow-none gap-2"
              >
                <BookOpen className="h-4 w-4" />
                書籍
              </TabsTrigger>
            </TabsList>

            <div className="py-6">
              <TabsContent value="posts" className="m-0">
                {userPosts.length > 0 ? (
                  <div className="space-y-0 divide-y divide-border">
                    {userPosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Grid3x3 className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      還沒有發布任何貼文
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="books" className="m-0">
                {userBooks.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {userBooks.map((book) => (
                      <BookCard key={book.userBookId ?? ""} book={book} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <BookOpen className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      還沒有上架任何書籍
                    </p>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>確定要封鎖 {displayName}？</DialogTitle>
            <DialogDescription>
              封鎖後，你們將無法看到彼此的貼文、書籍和個人檔案。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleBlock}>確定封鎖</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>檢舉 {displayName}</DialogTitle>
            <DialogDescription>
              我們會審核你的檢舉並採取適當的行動。請確保檢舉的內容違反了社群規範。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleReport}>送出檢舉</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
