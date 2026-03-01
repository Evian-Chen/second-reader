import type { OrderItem } from "@/types";

/** Mock order items until 接 Order API */
export const mockOrders: OrderItem[] = [
  {
    id: "o1",
    orderId: "ord1",
    bookTitle: "百年孤寂",
    bookCover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    buyerName: "買家A",
    price: 280,
    orderItemStatus: "Accepted",
    createdAt: "2024-02-15",
    type: "sale",
  },
  {
    id: "o2",
    orderId: "ord2",
    bookTitle: "嫌疑犯X的獻身",
    bookCover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    sellerName: "書海遊俠",
    price: 200,
    orderItemStatus: "SellerSent",
    createdAt: "2024-02-14",
    type: "purchase",
  },
  {
    id: "o3",
    orderId: "ord3",
    bookTitle: "挪威的森林",
    bookCover:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop",
    buyerName: "買家B",
    price: 220,
    orderItemStatus: "Pending",
    createdAt: "2024-02-13",
    type: "sale",
  },
];
