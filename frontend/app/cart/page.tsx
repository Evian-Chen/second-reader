"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetCartQuery,
  useRemoveCartItemMutation,
  useCheckoutCartMutation,
} from "@/redux/services/api";
import { DEFAULT_COVER } from "@/types/constants";
import {
  mapCondition,
  PAY_METHOD_LABELS,
  DELIVERY_METHOD_LABELS,
} from "@/types/constants";
import type { CartItem as ApiCartItem } from "@/types/commerce";
import type { PayMethod, DeliveryMethod } from "@/types/enums";
import { toast } from "sonner";

const VALID_PAY_METHODS: PayMethod[] = ["Cash", "BankTransfer", "Other"];
const VALID_DELIVERY_METHODS: DeliveryMethod[] = [
  "FaceToFace",
  "Mail",
  "ConvenienceStore",
  "Other",
];

export default function CartPage() {
  const router = useRouter();
  const { data: cart, isLoading, error } = useGetCartQuery();
  const [removeItem, { isLoading: isRemoving }] = useRemoveCartItemMutation();
  const [checkout, { isLoading: isCheckingOut }] = useCheckoutCartMutation();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [checkoutData, setCheckoutData] = useState<
    Record<string, { paymentMethod?: PayMethod; deliveryMethod?: DeliveryMethod }>
  >({});
  const [note, setNote] = useState("");

  const cartItems = cart?.cartItems ?? [];

  const handleRemove = async (userBookId: string) => {
    setRemovingId(userBookId);
    try {
      await removeItem(userBookId).unwrap();
      toast.success("已從購物車移除");
    } finally {
      setRemovingId(null);
    }
  };

  const setItemCheckoutData = (
    userBookId: string,
    field: "paymentMethod" | "deliveryMethod",
    value: PayMethod | DeliveryMethod
  ) => {
    setCheckoutData((prev) => ({
      ...prev,
      [userBookId]: {
        ...prev[userBookId],
        [field]: value,
      },
    }));
  };

  const handleCheckout = async () => {
    for (const item of cartItems) {
      const uid = item.userBookId ?? "";
      const data = checkoutData[uid];
      const hasValidPay =
        data?.paymentMethod && data.paymentMethod !== "Undefined";
      const hasValidDelivery =
        data?.deliveryMethod && data.deliveryMethod !== "Undefined";
      if (!hasValidPay || !hasValidDelivery) {
        toast.error("請為所有商品選擇出貨方式和付款方式");
        return;
      }
    }

    const bookMethodsPair: Record<string, { paymentMethod?: PayMethod; deliveryMethod?: DeliveryMethod }> = {};
    for (const item of cartItems) {
      const uid = item.userBookId ?? "";
      const data = checkoutData[uid];
      if (data?.paymentMethod && data.paymentMethod !== "Undefined")
        bookMethodsPair[uid] = {
          ...bookMethodsPair[uid],
          paymentMethod: data.paymentMethod,
        };
      if (data?.deliveryMethod && data.deliveryMethod !== "Undefined")
        bookMethodsPair[uid] = {
          ...bookMethodsPair[uid],
          deliveryMethod: data.deliveryMethod,
        };
    }

    try {
      await checkout({ bookMethodsPair: Object.keys(bookMethodsPair).length ? bookMethodsPair : undefined }).unwrap();
      toast.success("訂單已成立！");
      router.push("/orders");
    } catch {
      // Error handled by mutation / toast
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.price ?? 0),
    0
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <Link href="/">
            <Button variant="ghost" className="mb-8 gap-2 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              返回
            </Button>
          </Link>
          <div className="text-center py-16">
            <p className="text-destructive mb-4">無法載入購物車，請稍後再試</p>
            <Link href="/">
              <Button>返回首頁</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <Link href="/">
            <Button variant="ghost" className="mb-8 gap-2 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              返回
            </Button>
          </Link>
          <div className="text-center py-16">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h2 className="text-lg font-medium mb-2">購物車是空的</h2>
            <p className="text-sm text-muted-foreground mb-6">
              到首頁逛逛，把喜歡的書加入購物車吧！
            </p>
            <Link href="/">
              <Button>去逛逛</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-8 gap-2 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            返回
          </Button>
        </Link>

        <h1 className="text-2xl font-medium mb-2">購物車</h1>
        <p className="text-sm text-muted-foreground mb-8">
          {cartItems.length} 件商品
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItemRow
                key={item.userBookId}
                item={item}
                onRemove={handleRemove}
                isRemoving={removingId === item.userBookId}
                isCheckoutMode={isCheckoutMode}
                checkoutData={checkoutData[item.userBookId ?? ""]}
                setCheckoutData={setItemCheckoutData}
              />
            ))}

            {isCheckoutMode && (
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

          <div className="lg:col-span-1">
            <div className="border border-border rounded-lg p-6 sticky top-20">
              <h2 className="font-medium mb-4">訂單摘要</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">商品小計</span>
                  <span>NT$ {totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">運費</span>
                  <span className="text-xs text-muted-foreground">
                    依出貨方式而定
                  </span>
                </div>
              </div>
              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between font-medium">
                  <span>總計</span>
                  <span className="text-lg">
                    NT$ {totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {!isCheckoutMode ? (
                <Button
                  className="w-full"
                  onClick={() => setIsCheckoutMode(true)}
                >
                  前往結帳
                </Button>
              ) : (
                <div className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        處理中...
                      </>
                    ) : (
                      "確認下單"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsCheckoutMode(false)}
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

function CartItemRow({
  item,
  onRemove,
  isRemoving,
  isCheckoutMode,
  checkoutData,
  setCheckoutData,
}: {
  item: ApiCartItem;
  onRemove: (userBookId: string) => void;
  isRemoving: boolean;
  isCheckoutMode: boolean;
  checkoutData?: {
    paymentMethod?: PayMethod;
    deliveryMethod?: DeliveryMethod;
  };
  setCheckoutData: (
    userBookId: string,
    field: "paymentMethod" | "deliveryMethod",
    value: PayMethod | DeliveryMethod
  ) => void;
}) {
  const userBookId = item.userBookId ?? "";
  const title = item.book?.title ?? "";
  const author = item.book?.author ?? "";
  const price = item.price ?? 0;
  const conditionLabel = mapCondition(item.bookCondition);
  const payMethods = (item.sellerPayMethods ?? []).filter(
    (m) => m && m !== "Undefined"
  );
  const deliveryMethods = (item.sellerDeliveryMethods ?? []).filter(
    (m) => m && m !== "Undefined"
  );
  const optionsPay = payMethods.length > 0 ? payMethods : VALID_PAY_METHODS;
  const optionsDelivery =
    deliveryMethods.length > 0 ? deliveryMethods : VALID_DELIVERY_METHODS;

  return (
    <div className="border border-border rounded-lg p-4 bg-background">
      <div className="flex gap-4">
        <Link href={`/book/${userBookId}`} className="shrink-0">
          <img
            src={DEFAULT_COVER}
            alt={title}
            className="w-20 h-28 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-medium line-clamp-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{author}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 bg-muted rounded">
                  {conditionLabel}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onRemove(userBookId)}
              disabled={isRemoving}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {isCheckoutMode && (
            <div className="grid grid-cols-2 gap-3 mt-4 p-3 bg-muted/30 rounded">
              <div className="space-y-2">
                <Label className="text-xs">出貨方式 *</Label>
                <Select
                  value={checkoutData?.deliveryMethod ?? ""}
                  onValueChange={(v) =>
                    setCheckoutData(userBookId, "deliveryMethod", v as DeliveryMethod)
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="選擇出貨方式" />
                  </SelectTrigger>
                  <SelectContent>
                    {optionsDelivery.map((m) => (
                      <SelectItem key={m} value={m} className="text-xs">
                        {DELIVERY_METHOD_LABELS[m] ?? m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">付款方式 *</Label>
                <Select
                  value={checkoutData?.paymentMethod ?? ""}
                  onValueChange={(v) =>
                    setCheckoutData(userBookId, "paymentMethod", v as PayMethod)
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="選擇付款方式" />
                  </SelectTrigger>
                  <SelectContent>
                    {optionsPay.map((m) => (
                      <SelectItem key={m} value={m} className="text-xs">
                        {PAY_METHOD_LABELS[m] ?? m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-3">
            <p className="font-medium">NT$ {price}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
