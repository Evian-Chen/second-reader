import { useParams, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { mockPosts } from "../data/mockData";
import { ArrowLeft, Heart, MessageCircle, Share2, Send } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  const post = mockPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-gray-500">找不到此貼文</p>
        <Button onClick={() => navigate("/")} className="mt-4">
          返回首頁
        </Button>
      </div>
    );
  }

  // Initialize state with post data
  useState(() => {
    setIsLiked(post.isLiked || false);
    setLikes(post.likes);
  });

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleComment = () => {
    if (comment.trim()) {
      // Mock comment submission
      setComment("");
    }
  };

  // Mock comments
  const mockComments = [
    {
      id: "1",
      userName: "閱讀愛好者",
      userAvatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop",
      content: "我也超愛這本書！作者的文筆真的太棒了",
      createdAt: "1小時前",
    },
    {
      id: "2",
      userName: "書蟲一號",
      userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
      content: "感謝推薦，已經加入購物車了！",
      createdAt: "2小時前",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" />
        返回
      </Button>

      {/* Post Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border rounded-lg overflow-hidden mb-6"
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b">
          <img
            src={post.userAvatar}
            alt={post.userName}
            className="h-12 w-12 rounded-full object-cover cursor-pointer"
            onClick={() => navigate("/profile")}
          />
          <div className="flex-1">
            <p className="font-semibold">{post.userName}</p>
            <p className="text-sm text-gray-500">@{post.username} · {post.createdAt}</p>
          </div>
          <Button variant="outline" size="sm">
            追蹤
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-lg leading-relaxed whitespace-pre-wrap mb-6">{post.content}</p>

          {/* Book Info */}
          {post.bookCover && (
            <div className="bg-gray-50 rounded-lg p-4 flex gap-4 mb-6">
              <img
                src={post.bookCover}
                alt={post.bookTitle}
                className="h-32 w-24 object-cover rounded shadow-sm"
              />
              <div className="flex-1">
                <p className="font-semibold text-lg mb-1">{post.bookTitle}</p>
                <p className="text-gray-600 mb-3">{post.bookAuthor}</p>
                <Button size="sm" variant="outline">
                  查看書籍
                </Button>
              </div>
            </div>
          )}

          {/* Images */}
          {post.images && post.images.length > 0 && (
            <div
              className={`grid gap-2 mb-6 ${
                post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
              }`}
            >
              {post.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-80 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-8 pt-4 border-t">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors group"
            >
              <Heart
                className={`h-6 w-6 ${isLiked ? "fill-red-500 text-red-500" : "group-hover:fill-red-100"}`}
              />
              <span className="font-semibold">{likes}</span>
            </button>
            <div className="flex items-center gap-2 text-gray-600">
              <MessageCircle className="h-6 w-6" />
              <span className="font-semibold">{post.comments}</span>
            </div>
            <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors ml-auto">
              <Share2 className="h-6 w-6" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Comments Section */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-4">留言 ({mockComments.length})</h3>

        {/* Comment Input */}
        <div className="flex gap-3 mb-6 pb-6 border-b">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"
            alt="Current user"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <Textarea
              placeholder="寫下你的想法..."
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mb-2"
            />
            <div className="flex justify-end">
              <Button onClick={handleComment} size="sm" disabled={!comment.trim()} className="gap-2">
                <Send className="h-4 w-4" />
                送出留言
              </Button>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {mockComments.map((commentItem) => (
            <div key={commentItem.id} className="flex gap-3">
              <img
                src={commentItem.userAvatar}
                alt={commentItem.userName}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-semibold text-sm mb-1">{commentItem.userName}</p>
                  <p className="text-sm text-gray-700">{commentItem.content}</p>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>{commentItem.createdAt}</span>
                  <button className="hover:underline">回覆</button>
                  <button className="hover:underline">讚</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
