import { useParams, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { mockBooks } from "../data/mockData";
import { ArrowLeft, Users, Share2, Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [book, setBook] = useState(() => mockBooks.find((b) => b.id === id));
  const [isQueued, setIsQueued] = useState(book?.isQueued || false);
  const [inCart, setInCart] = useState(false);

  if (!book) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-muted-foreground">找不到此書籍</p>
        <Button onClick={() => navigate("/")} className="mt-4">
          返回首頁
        </Button>
      </div>
    );
  }

  const handleQueue = () => {
    setIsQueued(!isQueued);
    setBook({
      ...book,
      isQueued: !isQueued,
      queueCount: isQueued ? (book.queueCount || 0) - 1 : (book.queueCount || 0) + 1,
    });
    toast.success(isQueued ? "已取消排隊" : "已加入排隊！當書籍可用時會通知您");
  };

  const handleAddToCart = () => {
    setInCart(!inCart);
    toast.success(inCart ? "已從購物車移除" : "已加入購物車");
  };

  const handleShare = () => {
    const bookUrl = `${window.location.origin}/book/${book.id}`;
    navigator.clipboard.writeText(bookUrl);
    toast.success("已複製連結", {
      description: bookUrl,
      duration: 3000,
    });
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "全新":
        return "bg-green-100 text-green-700 border-green-200";
      case "近全新":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "良好":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "普通":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handlePurchase = () => {
    toast.success("已送出購買請求！賣家確認後會與您聯繫。");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" />
        返回
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Book Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white border rounded-lg p-8"
        >
          <img
            src={book.cover}
            alt={book.title}
            className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
          />
        </motion.div>

        {/* Book Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <div className="flex items-start gap-3 mb-2">
              <h1 className="text-3xl font-bold flex-1">{book.title}</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart
                  className={`h-6 w-6 ${
                    isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
                  }`}
                />
              </Button>
            </div>
            <p className="text-xl text-gray-600 mb-4">{book.author}</p>
            <div className="flex items-center gap-3 mb-4">
              <Badge className={getConditionColor(book.condition)}>{book.condition}</Badge>
              <Badge variant="outline">{book.category}</Badge>
            </div>
            <div className="text-4xl font-bold text-purple-600 mb-6">
              NT$ {book.price}
            </div>
          </div>

          {/* Seller Info */}
          <div className="border border-border rounded-lg p-4 bg-muted/30">
            <p className="text-xs text-muted-foreground mb-2">賣家資訊</p>
            <div className="flex items-center gap-3">
              <img
                src={book.userAvatar}
                alt={book.userName}
                className="h-12 w-12 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate(`/profile/${book.userId}`)}
              />
              <div className="flex-1">
                <p className="font-medium text-sm">{book.userName}</p>
                <p className="text-xs text-muted-foreground">上架於 {book.createdAt}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/profile/${book.userId}`)}
              >
                查看賣場
              </Button>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-medium mb-2 text-sm">書籍描述</h3>
            <p className="text-[15px] text-muted-foreground leading-relaxed">{book.description}</p>
          </div>

          {/* Queue Info */}
          {(book.queueCount ?? 0) > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">目前 {book.queueCount} 人排隊中</span>
            </div>
          )}

          {/* Action Buttons */}
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
              {isQueued ? `已排隊 (${book.queueCount})` : `加入排隊 ${(book.queueCount ?? 0) > 0 ? `(${book.queueCount})` : ""}`}
            </Button>
            <Button variant="outline" size="lg" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Additional Info */}
          <div className="border border-border rounded-lg p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground">
              💡 排隊機制：當此書籍被預訂或已售出後，您可以加入排隊等候。當書籍重新上架或有新的相同書籍時，系統會依排隊順序通知您。
            </p>
          </div>
        </motion.div>
      </div>

      {/* Related Books */}
      <div className="mt-12">
        <h2 className="text-xl font-medium mb-6">相關書籍推薦</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {mockBooks.slice(0, 6).map((relatedBook) => (
            <div
              key={relatedBook.id}
              onClick={() => navigate(`/book/${relatedBook.id}`)}
              className="cursor-pointer group"
            >
              <div className="relative aspect-[2/3] mb-2 overflow-hidden rounded bg-muted">
                <img
                  src={relatedBook.cover}
                  alt={relatedBook.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-sm font-medium line-clamp-2 leading-tight">{relatedBook.title}</p>
              <p className="text-sm font-medium mt-1">NT$ {relatedBook.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}