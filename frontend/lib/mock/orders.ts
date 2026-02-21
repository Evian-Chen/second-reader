import type { OrderDisplay } from "@/lib/types/display";

/** Mock orders until Order API exists. TODO: 接 Order API */
export const mockOrders: OrderDisplay[] = [
  {
    id: "o1",
    bookId: "b1",
    bookTitle: "百年孤寂",
    bookCover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    buyerName: "買家A",
    price: 280,
    status: "已確認",
    createdAt: "2024-02-15",
    type: "sale",
  },
  {
    id: "o2",
    bookId: "b3",
    bookTitle: "嫌疑犯X的獻身",
    bookCover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    sellerName: "書海遊俠",
    price: 200,
    status: "已出貨",
    createdAt: "2024-02-14",
    type: "purchase",
  },
  {
    id: "o3",
    bookId: "b2",
    bookTitle: "挪威的森林",
    bookCover:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop",
    buyerName: "買家B",
    price: 220,
    status: "待確認",
    createdAt: "2024-02-13",
    type: "sale",
  },
];
