"use client";

import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";
import type { ReadingPost } from "@/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PostCardProps {
  post: ReadingPost;
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(post.isLiked ?? false);
  const [isSaved, setIsSaved] = useState(post.isSaved ?? false);
  const [likes, setLikes] = useState(post.likes ?? 0);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked((prev) => !prev);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved((prev) => !prev);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const postUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/post/${post.id}`;
    void navigator.clipboard.writeText(postUrl);
  };

  return (
    <article
      className="py-4 cursor-pointer hover:bg-muted/30 transition-colors -mx-6 px-6"
      onClick={() => router.push(`/post/${post.id}`)}
      onKeyDown={(e) => e.key === "Enter" && router.push(`/post/${post.id}`)}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start gap-3 mb-3">
        <Link
          href={`/profile/${post.accountId ?? ""}`}
          onClick={(e) => e.stopPropagation()}
          className="shrink-0"
        >
          <img
            src={post.userAvatar ?? ""}
            alt={post.userName ?? post.accountId ?? ""}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-border hover:opacity-80 transition-opacity"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link
              href={`/profile/${post.accountId ?? ""}`}
              onClick={(e) => e.stopPropagation()}
              className="text-sm font-medium hover:underline"
            >
              {post.userName ?? post.accountId ?? "使用者"}
            </Link>
            {post.username ? (
              <p className="text-xs text-muted-foreground">@{post.username}</p>
            ) : null}
            <span className="text-xs text-muted-foreground">·</span>
            <p className="text-xs text-muted-foreground">
              {post.createdAt ?? post.updatedAt ?? ""}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-3 ml-[52px]">
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {post.bookCover ? (
        <div className="ml-[52px] mb-3 border border-border rounded-lg p-3 flex gap-3 hover:bg-muted/50 transition-colors">
          <img
            src={post.bookCover}
            alt={post.bookTitle ?? ""}
            className="h-20 w-14 object-cover rounded"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium mb-1 line-clamp-2">
              {post.bookTitle}
            </p>
            <p className="text-xs text-muted-foreground">{post.bookAuthor}</p>
          </div>
        </div>
      ) : null}

      {post.images && post.images.length > 0 ? (
        <div className="ml-[52px] mb-3 rounded-lg overflow-hidden border border-border">
          <div className="grid grid-cols-2 gap-px bg-border">
            {post.images.map((image, index) => (
              <div key={index} className="aspect-square bg-background">
                <img
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex items-center gap-6 ml-[52px]">
        <button
          type="button"
          onClick={handleLike}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Heart
            className={`h-4 w-4 ${isLiked ? "fill-current text-foreground" : ""}`}
          />
          <span className="text-xs">{likes}</span>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/post/${post.id}`);
          }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs">{post.commentCount ?? 0}</span>
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors ml-auto"
        >
          <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
