"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, MessageCircle, Share2, Send } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import {
  useGetReadingPostByIdQuery,
  useGetPostCommentsQuery,
  useLikeReadingPostMutation,
  useCreateCommentMutation,
} from "@/redux/services/api";
import { mockPosts } from "@/lib/mock/posts";
import type { ReadingPost } from "@/types";
import { toast } from "sonner";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const { data: apiPost, isLoading } = useGetReadingPostByIdQuery(id, {
    skip: !id,
  });
  const { data: comments = [] } = useGetPostCommentsQuery(id, { skip: !id });
  const [likePost] = useLikeReadingPostMutation();
  const [createComment] = useCreateCommentMutation();

  const mockPost = mockPosts.find((p) => p.id === id);
  const post: ReadingPost | undefined = apiPost ?? mockPost;

  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(post?.isLiked ?? false);
  const [likes, setLikes] = useState(post?.likes ?? 0);

  if (isLoading && !mockPost) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-muted-foreground">載入中...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-muted-foreground">找不到此貼文</p>
        <Button onClick={() => router.push("/")} className="mt-4">
          返回首頁
        </Button>
      </div>
    );
  }

  const handleLike = async () => {
    if (apiPost) {
      try {
        await likePost({
          id: post.id,
          body: { likeCount: isLiked ? -1 : 1 },
        }).unwrap();
        setIsLiked((prev) => !prev);
        setLikes((prev) => prev + (isLiked ? -1 : 1));
      } catch {
        toast.error("操作失敗");
      }
    } else {
      setIsLiked((prev) => !prev);
      setLikes((prev) => prev + (isLiked ? -1 : 1));
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    if (apiPost) {
      try {
        await createComment({
          postId: post.id,
          content: comment.trim(),
        }).unwrap();
        setComment("");
        toast.success("留言已送出");
      } catch {
        toast.error("留言失敗");
      }
    } else {
      setComment("");
    }
  };

  const bookLink = post.userBookId
    ? `/book/${post.userBookId}`
    : post.bookTitle
      ? `/?search=${encodeURIComponent(post.bookTitle)}`
      : null;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        返回
      </Button>

      <div className="bg-card border rounded-lg overflow-hidden mb-6">
        <div className="flex items-center gap-3 p-6 border-b border-border">
          <Link href={`/profile/${post.accountId ?? ""}`}>
            <img
              src={post.userAvatar ?? ""}
              alt={post.userName ?? post.accountId ?? ""}
              className="h-12 w-12 rounded-full object-cover hover:opacity-80 transition-opacity"
            />
          </Link>
          <div className="flex-1">
            <p className="font-semibold">{post.userName}</p>
            <p className="text-sm text-muted-foreground">
              {post.username ? `@${post.username} · ` : ""}
              {post.createdAt ?? post.updatedAt ?? ""}
            </p>
          </div>
        </div>

        <div className="p-6">
          <p className="text-lg leading-relaxed whitespace-pre-wrap mb-6">
            {post.content}
          </p>

          {post.bookCover ? (
            <div className="border border-border rounded-lg p-4 flex gap-4 mb-6 bg-muted/30">
              <img
                src={post.bookCover}
                alt={post.bookTitle ?? ""}
                className="h-32 w-24 object-cover rounded shrink-0"
              />
              <div className="flex-1">
                <p className="font-semibold text-lg mb-1">{post.bookTitle}</p>
                <p className="text-muted-foreground mb-3">{post.bookAuthor}</p>
                {bookLink ? (
                  <Link href={bookLink}>
                    <Button size="sm" variant="outline">
                      查看書籍
                    </Button>
                  </Link>
                ) : null}
              </div>
            </div>
          ) : null}

          {post.images && post.images.length > 0 ? (
            <div
              className={`grid gap-2 mb-6 ${
                post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
              }`}
            >
              {post.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`貼文圖片 ${index + 1}`}
                  className="w-full h-80 object-cover rounded-lg"
                />
              ))}
            </div>
          ) : null}

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={handleLike}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <Heart
                className={`h-5 w-5 ${isLiked ? "fill-current text-foreground" : ""}`}
              />
              <span>{likes}</span>
            </button>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageCircle className="h-5 w-5" />
              <span>{post.commentCount ?? comments.length}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const url =
                  typeof window !== "undefined"
                    ? `${window.location.origin}/post/${post.id}`
                    : "";
                void navigator.clipboard.writeText(url);
                toast.success("已複製連結");
              }}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="font-medium mb-4">留言 ({comments.length})</h3>
        <div className="space-y-4 mb-6">
          {comments.length > 0 ? (
            comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                  ?
                </div>
                <div>
                  <Link
                    href={`/profile/${c.authorAccountId ?? c.authorId}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {c.authorAccountId ?? c.authorId}
                  </Link>
                  <p className="text-sm text-muted-foreground">{c.createdAt}</p>
                  <p className="text-[15px] mt-1">{c.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">尚無留言</p>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="寫下留言..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 rounded-md border border-border bg-input-background px-3 py-2 text-sm"
          />
          <Button size="sm" onClick={handleComment} className="gap-2">
            <Send className="h-4 w-4" />
            送出
          </Button>
        </div>
      </div>
    </div>
  );
}
