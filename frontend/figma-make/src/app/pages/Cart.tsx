import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "../components/ui/button";
import { mockBooks } from "../data/mockData";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

interface CartItem {
  book: typeof mockBooks[0];
  quantity: number;
}

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { book: mockBooks[0], quantity: 1 },
    { book: mockBooks[1], quantity: 1 },
    { book: mockBooks[3], quantity: 1 },
  ]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutData, setCheckoutData] = useState<{
    [key: string]: {
      shippingMethod: string;
      paymentMethod: string;
    };
  }>({});
  const [note, setNote] = useState("");

  const updateQuantity = (bookId: string, delta: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.book.id === bookId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (bookId: string) => {
    setCartItems((items) => items.filter((item) => item.book.id !== bookId));
    toast.success("已從購物車移除");
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

  const handleCheckout = () => {
    // Check if all items have shipping and payment methods selected
    for (const item of cartItems) {
      const data = checkoutData[item.book.id];
      if (!data || !data.shippingMethod || !data.paymentMethod) {
        toast.error("請為所有商品選擇出貨方式和付款方式");
        return;
      }
    }

    toast.success("訂單已成立！");
    setTimeout(() => {
      navigate("/orders");
    }, 1500);
  };

  const setItemCheckoutData = (bookId: string, field: "shippingMethod" | "paymentMethod", value: string) => {
    setCheckoutData((prev) => ({
      ...prev,
      [bookId]: {
        ...prev[bookId],
        [field]: value,
      },
    }));
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="flex items-center gap-3 mb-8">
            <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-medium">購物車</h1>
          </div>

          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground mb-6">購物車是空的</p>
            <Button onClick={() => navigate("/")}>前往書籍市集</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-medium">購物車</h1>
          <span className="text-sm text-muted-foreground">({cartItems.length} 件商品)</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.book.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="border border-border rounded-lg p-4 bg-background"
                >
                  <div className="flex gap-4">
                    {/* Book Cover */}
                    <img
                      src={item.book.cover}
                      alt={item.book.title}
                      className="w-20 h-28 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => navigate(`/book/${item.book.id}`)}
                    />

                    {/* Book Info */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-medium mb-1 cursor-pointer hover:underline truncate"
                        onClick={() => navigate(`/book/${item.book.id}`)}
                      >
                        {item.book.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{item.book.author}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs px-2 py-0.5 bg-muted rounded">{item.book.condition}</span>
                        <span className="text-xs text-muted-foreground">賣家：{item.book.userName}</span>
                      </div>

                      {/* Checkout Options */}
                      {isCheckingOut && (
                        <div className="grid grid-cols-2 gap-3 mt-4 p-3 bg-muted/30 rounded">
                          <div className="space-y-2">
                            <Label className="text-xs">出貨方式 *</Label>
                            <Select
                              value={checkoutData[item.book.id]?.shippingMethod || ""}
                              onValueChange={(value) => setItemCheckoutData(item.book.id, "shippingMethod", value)}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="選擇出貨方式" />
                              </SelectTrigger>
                              <SelectContent>
                                {item.book.shippingMethods?.map((method) => (
                                  <SelectItem key={method} value={method} className="text-xs">
                                    {method}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">付款方式 *</Label>
                            <Select
                              value={checkoutData[item.book.id]?.paymentMethod || ""}
                              onValueChange={(value) => setItemCheckoutData(item.book.id, "paymentMethod", value)}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="選擇付款方式" />
                              </SelectTrigger>
                              <SelectContent>
                                {item.book.paymentMethods?.map((method) => (
                                  <SelectItem key={method} value={method} className="text-xs">
                                    {method}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Price & Actions */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.book.id)}
                        className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="text-right">
                        <p className="font-medium mb-2">NT$ {item.book.price}</p>
                        <div className="flex items-center gap-2 border border-border rounded">
                          <button
                            onClick={() => updateQuantity(item.book.id, -1)}
                            className="p-1 hover:bg-muted transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.book.id, 1)}
                            className="p-1 hover:bg-muted transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Note Section */}
            {isCheckingOut && (
              <div className="border border-border rounded-lg p-4">
                <Label className="text-sm mb-2 block">訂單備註（選填）</Label>
                <Textarea
                  placeholder="如有特殊需求請在此說明..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="min-h-[80px] resize-none text-sm"
                />
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="border border-border rounded-lg p-6 sticky top-20">
              <h2 className="font-medium mb-4">訂單摘要</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">商品小計</span>
                  <span>NT$ {totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">運費</span>
                  <span className="text-xs text-muted-foreground">依出貨方式而定</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between font-medium">
                  <span>總計</span>
                  <span className="text-lg">NT$ {totalAmount}</span>
                </div>
              </div>

              {!isCheckingOut ? (
                <Button className="w-full" onClick={() => setIsCheckingOut(true)}>
                  前往結帳
                </Button>
              ) : (
                <div className="space-y-3">
                  <Button className="w-full" onClick={handleCheckout}>
                    確認下單
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsCheckingOut(false)}
                  >
                    返回購物車
                  </Button>
                </div>
              )}

              <div className="mt-6 p-4 bg-muted/30 rounded text-xs text-muted-foreground space-y-2">
                <p>💡 提示：</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>每本書籍可選擇不同的出貨和付款方式</li>
                  <li>下單後請等待賣家確認訂單</li>
                  <li>運費將依您選擇的出貨方式計算</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
