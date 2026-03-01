"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon } from "lucide-react";
import { useCreateReadingPostMutation } from "@/redux/services/api";
import type { CreateReadingPost } from "@/types";
import { useCurrentUser } from "@/clerk/useCurrentUser";
import { toast } from "sonner";

interface CreatePostDialogProps {
  children: React.ReactNode;
}

export function CreatePostDialog({ children }: CreatePostDialogProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [createPost, { isLoading }] = useCreateReadingPostMutation();
  const { user, isSignedIn } = useCurrentUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn || !user) {
      toast.error("請先登入");
      return;
    }
    if (!content.trim()) {
      toast.error("請輸入閱讀心得");
      return;
    }
    try {
      const body: CreateReadingPost = {
        content: content.trim(),
        title: bookTitle.trim() || undefined,
        rating: 0,
      };
      await createPost(body).unwrap();
      toast.success("貼文發布成功！");
      setOpen(false);
      setContent("");
      setBookTitle("");
      setBookAuthor("");
    } catch {
      toast.error("發布失敗，請稍後再試");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>發布閱讀心得</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {user && (
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.userProfile?.displayName ?? user.username ?? "使用者"}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-sm">
                  {user.userProfile?.displayName ?? user.username ?? "使用者"}
                </p>
                <p className="text-xs text-muted-foreground">
                  @{user.username}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="content">閱讀心得 *</Label>
            <Textarea
              id="content"
              placeholder="分享你的閱讀心得或書籍推薦..."
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="resize-none"
            />
          </div>

          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-semibold text-muted-foreground">
              推薦書籍（選填）
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="book-title" className="text-xs">
                  書名
                </Label>
                <Input
                  id="book-title"
                  placeholder="例：百年孤寂"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="book-author" className="text-xs">
                  作者
                </Label>
                <Input
                  id="book-author"
                  placeholder="例：加西亞·馬奎斯"
                  value={bookAuthor}
                  onChange={(e) => setBookAuthor(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="images"
              className="text-sm flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <ImageIcon className="h-4 w-4" />
              新增圖片（即將推出）
            </Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              取消
            </Button>
            <Button type="submit" disabled={!content.trim() || isLoading}>
              {isLoading ? "發布中..." : "發布貼文"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
