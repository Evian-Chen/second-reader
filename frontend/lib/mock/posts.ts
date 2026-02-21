import type { PostDisplay } from "@/lib/types/display";

/** Mock posts until Post API exists. TODO: 接 Post API */
export const mockPosts: PostDisplay[] = [
  {
    id: "p1",
    userId: "2",
    userName: "讀書小姐",
    userAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    username: "miss_reader",
    content:
      "剛看完這本《百年孤寂》，被馬奎斯的魔幻寫實深深震撼！故事橫跨七代的家族史，每個角色都有獨特的命運。推薦給喜歡文學的朋友們～",
    bookTitle: "百年孤寂",
    bookAuthor: "加西亞·馬奎斯",
    bookCover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    likes: 234,
    comments: 45,
    createdAt: "2小時前",
    isLiked: false,
  },
  {
    id: "p2",
    userId: "3",
    userName: "文青阿華",
    userAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    username: "hua_literary",
    content:
      "村上春樹的《挪威的森林》陪我度過了無數個夜晚。青春、愛情、孤獨...這些元素交織成一首憂傷的詩。有人也喜歡村上的作品嗎？",
    bookTitle: "挪威的森林",
    bookAuthor: "村上春樹",
    bookCover:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop",
    ],
    likes: 567,
    comments: 89,
    createdAt: "5小時前",
    isLiked: true,
  },
  {
    id: "p3",
    userId: "4",
    userName: "書海遊俠",
    userAvatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop",
    username: "book_wanderer",
    content:
      "最近迷上推理小說！東野圭吾的《嫌疑犯X的獻身》真的太精彩了，結局完全出乎意料。推薦給喜歡燒腦的朋友！",
    bookTitle: "嫌疑犯X的獻身",
    bookAuthor: "東野圭吾",
    bookCover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    likes: 892,
    comments: 123,
    createdAt: "1天前",
    isLiked: true,
  },
];
