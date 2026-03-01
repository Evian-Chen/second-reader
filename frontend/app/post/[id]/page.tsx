"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, MessageCircle, Share2, Send } from "lucide-react";
import { useState } from "react";
import { mockPosts } from "@/lib/mock/posts";
import type { ReadingPost } from "@/types";
import Link from "next/link";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const post = mockPosts.find((p) => p.id === id);

  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(post?.isLiked ?? false);
  const [likes, setLikes] = useState(post?.likes ?? 0);

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

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    setLikes((prev) => prev + (isLiked ? -1 : 1));
  };

  const handleComment = () => {
    if (comment.trim()) setComment("");
  };

  const mockComments = [
    {
      id: "1",
      userName: "閱讀愛好者",
      userAvatar:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop",
      content: "我也超愛這本書！作者的文筆真的太棒了",
      createdAt: "1小時前",
    },
    {
      id: "2",
      userName: "書蟲一號",
      userAvatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
      content: "感謝推薦，已經加入購物車了！",
      createdAt: "2小時前",
    },
  ];

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
            <div className="border border-border rounded-lg p-4 flex gap-3 mb-6">
              <img
                src={post.bookCover}
                alt={post.bookTitle ?? ""}
                className="h-24 w-16 object-cover rounded"
              />
              <div>
                <p className="font-medium">{post.bookTitle}</p>
                <p className="text-sm text-muted-foreground">
                  {post.bookAuthor}
                </p>
              </div>
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
              <span>{post.commentCount ?? 0}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const url =
                  typeof window !== "undefined"
                    ? `${window.location.origin}/post/${post.id}`
                    : "";
                void navigator.clipboard.writeText(url);
              }}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="font-medium mb-4">留言</h3>
        <div className="space-y-4 mb-6">
          {mockComments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <img
                src={c.userAvatar}
                alt={c.userName}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium">{c.userName}</p>
                <p className="text-sm text-muted-foreground">{c.createdAt}</p>
                <p className="text-[15px] mt-1">{c.content}</p>
              </div>
            </div>
          ))}
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
