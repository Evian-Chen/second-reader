import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { currentUser } from "../data/mockData";
import { Image as ImageIcon, X } from "lucide-react";

interface CreatePostDialogProps {
  children: React.ReactNode;
}

export function CreatePostDialog({ children }: CreatePostDialogProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("貼文發布成功！");
    setOpen(false);
    setContent("");
    setBookTitle("");
    setBookAuthor("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>發布閱讀心得</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-sm">{currentUser.name}</p>
              <p className="text-xs text-gray-500">@{currentUser.username}</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Textarea
              placeholder="分享你的閱讀心得或書籍推薦..."
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="resize-none"
            />
          </div>

          {/* Book Info (Optional) */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-semibold text-gray-700">推薦書籍（選填）</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="book-title" className="text-xs">書名</Label>
                <Input
                  id="book-title"
                  placeholder="例：百年孤寂"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="book-author" className="text-xs">作者</Label>
                <Input
                  id="book-author"
                  placeholder="例：加西亞·馬奎斯"
                  value={bookAuthor}
                  onChange={(e) => setBookAuthor(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="images" className="text-sm flex items-center gap-2 cursor-pointer text-gray-700 hover:text-gray-900">
              <ImageIcon className="h-4 w-4" />
              新增圖片
            </Label>
            <Input id="images" type="file" accept="image/*" multiple className="hidden" />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit" disabled={!content.trim()}>
              發布貼文
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
