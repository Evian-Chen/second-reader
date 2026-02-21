"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CreateBookDialogProps {
  children: React.ReactNode;
}

export function CreateBookDialog({ children }: CreateBookDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>上架書籍</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm py-4">
          此功能即將推出，敬請期待。
        </p>
      </DialogContent>
    </Dialog>
  );
}
