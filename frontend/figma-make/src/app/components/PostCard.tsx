import { Heart, MessageCircle, Bookmark, Share2, Check } from "lucide-react";
import { Post } from "../data/mockData";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [likes, setLikes] = useState(post.likes);
  const navigate = useNavigate();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    toast.success(isSaved ? "已取消收藏" : "已收藏貼文");
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const postUrl = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(postUrl);
    toast.success("已複製連結", {
      description: postUrl,
      duration: 3000,
    });
  };

  return (
    <article 
      className="py-4 cursor-pointer hover:bg-muted/30 transition-colors -mx-6 px-6"
      onClick={() => navigate(`/post/${post.id}`)}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <img
          src={post.userAvatar}
          alt={post.userName}
          className="h-10 w-10 rounded-full object-cover ring-1 ring-border cursor-pointer hover:opacity-80 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/profile/${post.userId}`);
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p 
              className="text-sm font-medium cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${post.userId}`);
              }}
            >
              {post.userName}
            </p>
            <p className="text-xs text-muted-foreground">@{post.username}</p>
            <span className="text-xs text-muted-foreground">·</span>
            <p className="text-xs text-muted-foreground">{post.createdAt}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-3 ml-[52px]">
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Book Info (if exists) */}
      {post.bookCover && (
        <div className="ml-[52px] mb-3 border border-border rounded-lg p-3 flex gap-3 hover:bg-muted/50 transition-colors">
          <img
            src={post.bookCover}
            alt={post.bookTitle}
            className="h-20 w-14 object-cover rounded"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium mb-1 line-clamp-2">{post.bookTitle}</p>
            <p className="text-xs text-muted-foreground">{post.bookAuthor}</p>
          </div>
        </div>
      )}

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className="ml-[52px] mb-3 rounded-lg overflow-hidden border border-border">
          <div
            className={`grid ${
              post.images.length === 1
                ? "grid-cols-1"
                : post.images.length === 2
                ? "grid-cols-2"
                : "grid-cols-2"
            } gap-px bg-border`}
          >
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
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 ml-[52px]">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <Heart
            className={`h-4 w-4 ${isLiked ? "fill-current text-foreground" : ""}`}
          />
          <span className="text-xs">{likes}</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/post/${post.id}`);
          }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs">{post.comments}</span>
        </button>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors ml-auto"
        >
          <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
        </button>
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}