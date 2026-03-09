import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Camera, Upload, X, Sparkles } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { bookCategories } from "../data/mockData";
import { Checkbox } from "./ui/checkbox";

interface CreateBookDialogProps {
  children: React.ReactNode;
}

export function CreateBookDialog({ children }: CreateBookDialogProps) {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    price: "",
    condition: "良好",
    description: "",
    category: "",
    shippingMethods: [] as string[],
    paymentMethods: [] as string[],
  });

  const shippingOptions = ["郵寄", "面交", "超商取貨"];
  const paymentOptions = ["現金", "銀行轉帳", "行動支付"];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        // Simulate auto-fill after image upload
        simulateAutoFill();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateAutoFill = () => {
    setIsAutoFilling(true);
    toast.info("正在識別書籍資訊...");
    
    // Simulate API call delay
    setTimeout(() => {
      setFormData({
        title: "追風箏的人",
        author: "卡勒德·胡賽尼",
        isbn: "9789866562259",
        price: "250",
        condition: "良好",
        description: "這是一個關於友誼、背叛與救贖的動人故事。跨越二十五年，從阿富汗到美國...",
        category: "文學小說",
        shippingMethods: ["郵寄", "面交"],
        paymentMethods: ["現金", "銀行轉帳"],
      });
      setIsAutoFilling(false);
      toast.success("書籍資訊已自動填寫！請確認並修改");
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.shippingMethods.length === 0) {
      toast.error("請至少選擇一種出貨方式");
      return;
    }
    
    if (formData.paymentMethods.length === 0) {
      toast.error("請至少選擇一種付款方式");
      return;
    }
    
    toast.success("書籍上架成功！");
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      isbn: "",
      price: "",
      condition: "良好",
      description: "",
      category: "",
      shippingMethods: [],
      paymentMethods: [],
    });
    setImagePreview(null);
  };

  const toggleShippingMethod = (method: string) => {
    setFormData({
      ...formData,
      shippingMethods: formData.shippingMethods.includes(method)
        ? formData.shippingMethods.filter((m) => m !== method)
        : [...formData.shippingMethods, method],
    });
  };

  const togglePaymentMethod = (method: string) => {
    setFormData({
      ...formData,
      paymentMethods: formData.paymentMethods.includes(method)
        ? formData.paymentMethods.filter((m) => m !== method)
        : [...formData.paymentMethods, method],
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>上架二手書</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Image Upload Section */}
          <div className="space-y-3">
            <Label>書籍封面</Label>
            {imagePreview ? (
              <div className="relative w-full aspect-[3/4] max-w-xs mx-auto bg-muted rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Book cover preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 p-1.5 bg-background/90 backdrop-blur-sm rounded-full hover:bg-background"
                >
                  <X className="h-4 w-4" />
                </button>
                {isAutoFilling && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex items-center gap-2 text-sm">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      <span>識別中...</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="aspect-[3/4] border-2 border-dashed border-border rounded-lg hover:border-foreground/40 transition-colors flex flex-col items-center justify-center gap-2"
                >
                  <Camera className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">拍照上傳</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-[3/4] border-2 border-dashed border-border rounded-lg hover:border-foreground/40 transition-colors flex flex-col items-center justify-center gap-2"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">選擇照片</span>
                </button>
              </div>
            )}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleImageUpload}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <p className="text-xs text-muted-foreground">
              上傳書籍封面後，系統會自動識別並填寫書籍資訊
            </p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">書名 *</Label>
              <Input
                id="title"
                placeholder="請輸入書名"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">作者 *</Label>
              <Input
                id="author"
                placeholder="請輸入作者"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                placeholder="9789573317449"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">價格 (NT$) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="200"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="condition">書況 *</Label>
              <Select
                value={formData.condition}
                onValueChange={(value) => setFormData({ ...formData, condition: value })}
              >
                <SelectTrigger id="condition">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="全新">全新</SelectItem>
                  <SelectItem value="近全新">近全新</SelectItem>
                  <SelectItem value="良好">良好</SelectItem>
                  <SelectItem value="普通">普通</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">分類 *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="選擇分類" />
                </SelectTrigger>
                <SelectContent>
                  {bookCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">書籍描述 *</Label>
            <Textarea
              id="description"
              placeholder="請描述書籍狀況、內容簡介等..."
              className="min-h-[100px] resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {/* Shipping Methods */}
          <div className="space-y-3">
            <Label>出貨方式 *</Label>
            <div className="flex flex-col gap-3">
              {shippingOptions.map((option) => (
                <div key={option} className="flex items-center gap-2">
                  <Checkbox
                    id={`shipping-${option}`}
                    checked={formData.shippingMethods.includes(option)}
                    onCheckedChange={() => toggleShippingMethod(option)}
                  />
                  <label
                    htmlFor={`shipping-${option}`}
                    className="text-sm cursor-pointer"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <Label>付款方式 *</Label>
            <div className="flex flex-col gap-3">
              {paymentOptions.map((option) => (
                <div key={option} className="flex items-center gap-2">
                  <Checkbox
                    id={`payment-${option}`}
                    checked={formData.paymentMethods.includes(option)}
                    onCheckedChange={() => togglePaymentMethod(option)}
                  />
                  <label
                    htmlFor={`payment-${option}`}
                    className="text-sm cursor-pointer"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit">上架書籍</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}