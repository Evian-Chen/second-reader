// Mock data types
export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  followers: number;
  following: number;
  isFollowing?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  username: string;
  content: string;
  bookTitle?: string;
  bookAuthor?: string;
  bookCover?: string;
  images?: string[];
  likes: number;
  comments: number;
  createdAt: string;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface Book {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  author: string;
  isbn?: string;
  cover: string;
  price: number;
  condition: "全新" | "近全新" | "良好" | "普通";
  description: string;
  category: string;
  createdAt: string;
  queueCount?: number;
  isReserved?: boolean;
  isQueued?: boolean;
  shippingMethods?: string[];
  paymentMethods?: string[];
}

export interface Order {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCover: string;
  buyerId?: string;
  buyerName?: string;
  sellerId?: string;
  sellerName?: string;
  price: number;
  status: "待確認" | "已確認" | "已出貨" | "已完成" | "已取消";
  createdAt: string;
  type: "purchase" | "sale";
}

export interface Notification {
  id: string;
  type: "like" | "comment" | "order" | "system";
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  linkTo?: string;
}

// Mock current user
export const currentUser: User = {
  id: "1",
  name: "書蟲小明",
  username: "bookworm_ming",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
  bio: "熱愛閱讀與分享 📚 | 文學愛好者 | 交換好書，交流好想法",
  followers: 1234,
  following: 567,
};

// Mock posts data
export const mockPosts: Post[] = [
  {
    id: "p1",
    userId: "2",
    userName: "讀書小姐",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    username: "miss_reader",
    content: "剛看完這本《百年孤寂》，被馬奎斯的魔幻寫實深深震撼！故事橫跨七代的家族史，每個角色都有獨特的命運。推薦給喜歡文學的朋友們～",
    bookTitle: "百年孤寂",
    bookAuthor: "加西亞·馬奎斯",
    bookCover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    likes: 234,
    comments: 45,
    createdAt: "2小時前",
    isLiked: false,
  },
  {
    id: "p2",
    userId: "3",
    userName: "文青阿華",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    username: "hua_literary",
    content: "村上春樹的《挪威的森林》陪我度過了無數個夜晚。青春、愛情、孤獨...這些元素交織成一首憂傷的詩。有人也喜歡村上的作品嗎？",
    bookTitle: "挪威的森林",
    bookAuthor: "村上春樹",
    bookCover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop"],
    likes: 567,
    comments: 89,
    createdAt: "5小時前",
    isLiked: true,
  },
  {
    id: "p3",
    userId: "4",
    userName: "書海遊俠",
    userAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop",
    username: "book_wanderer",
    content: "最近迷上推理小說！東野圭吾的《嫌疑犯X的獻身》真的太精彩了，結局完全出乎意料。推薦給喜歡燒腦的朋友！",
    bookTitle: "嫌疑犯X的獻身",
    bookAuthor: "東野圭吾",
    bookCover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    likes: 892,
    comments: 123,
    createdAt: "1天前",
    isLiked: true,
  },
  {
    id: "p4",
    userId: "5",
    userName: "閱讀咖啡",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    username: "reading_cafe",
    content: "週末在咖啡廳讀完了《小王子》，每次重讀都有新的感動。「真正重要的東西，用眼睛是看不見的。」這句話值得一輩子記住。",
    bookTitle: "小王子",
    bookAuthor: "聖修伯里",
    bookCover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&h=400&fit=crop"
    ],
    likes: 445,
    comments: 67,
    createdAt: "2天前",
    isLiked: false,
  },
];

// Mock books data
export const mockBooks: Book[] = [
  {
    id: "b1",
    userId: "2",
    userName: "讀書小姐",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    title: "百年孤寂",
    author: "加西亞·馬奎斯",
    isbn: "9789573317449",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    price: 280,
    condition: "良好",
    description: "諾貝爾文學獎作品，書況良好，僅翻閱數次。魔幻寫實主義的經典之作。",
    category: "文學小說",
    createdAt: "1天前",
    queueCount: 2,
    isReserved: false,
    shippingMethods: ["郵寄", "面交"],
    paymentMethods: ["現金", "銀行轉帳"],
  },
  {
    id: "b2",
    userId: "3",
    userName: "文青阿華",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    title: "挪威的森林",
    author: "村上春樹",
    isbn: "9789571337449",
    cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop",
    price: 220,
    condition: "近全新",
    description: "村上春樹經典作品，書況近全新，無劃記。適合喜歡日系文學的讀者。",
    category: "文學小說",
    createdAt: "2天前",
    queueCount: 0,
    isReserved: false,
    shippingMethods: ["郵寄", "面交", "超商取貨"],
    paymentMethods: ["現金", "銀行轉帳", "行動支付"],
  },
  {
    id: "b3",
    userId: "4",
    userName: "書海遊俠",
    userAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop",
    title: "嫌疑犯X的獻身",
    author: "東野圭吾",
    isbn: "9789863614456",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    price: 200,
    condition: "良好",
    description: "東野圭吾推理巨作，直木獎作品。書況良好，喜歡推理小說的朋友不要錯過！",
    category: "推理小說",
    createdAt: "3天前",
    queueCount: 5,
    isReserved: true,
    shippingMethods: ["郵寄"],
    paymentMethods: ["銀行轉帳"],
  },
  {
    id: "b4",
    userId: "6",
    userName: "古籍收藏家",
    userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    title: "人類大歷史",
    author: "哈拉瑞",
    isbn: "9789864795901",
    cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop",
    price: 350,
    condition: "全新",
    description: "全新未拆封，從認知革命到科技革命，重新認識人類歷史的經典著作。",
    category: "人文社科",
    createdAt: "3天前",
    queueCount: 1,
    isReserved: false,
    shippingMethods: ["郵寄", "超商取貨"],
    paymentMethods: ["銀行轉帳", "行動支付"],
  },
  {
    id: "b5",
    userId: "7",
    userName: "科幻迷",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    title: "三體",
    author: "劉慈欣",
    isbn: "9789866562846",
    cover: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop",
    price: 260,
    condition: "良好",
    description: "雨果獎最佳長篇故事，中國科幻的巨作。書況良好，科幻迷必讀！",
    category: "科幻小說",
    createdAt: "4天前",
    queueCount: 8,
    isReserved: true,
    shippingMethods: ["郵寄", "面交"],
    paymentMethods: ["現金", "銀行轉帳"],
  },
  {
    id: "b6",
    userId: "8",
    userName: "心靈導師",
    userAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop",
    title: "被討厭的勇氣",
    author: "岸見一郎",
    isbn: "9789861342306",
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
    price: 240,
    condition: "近全新",
    description: "阿德勒心理學的入門經典，教你擁有被討厭的勇氣。書況近全新。",
    category: "心理勵志",
    createdAt: "5天前",
    queueCount: 3,
    isReserved: false,
    shippingMethods: ["郵寄", "面交", "超商取貨"],
    paymentMethods: ["現金", "銀行轉帳", "行動支付"],
  },
];

// Mock orders data
export const mockOrders: Order[] = [
  {
    id: "o1",
    bookId: "b1",
    bookTitle: "百年孤寂",
    bookCover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
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
    bookCover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
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
    bookCover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop",
    buyerName: "買家B",
    price: 220,
    status: "待確認",
    createdAt: "2024-02-16",
    type: "sale",
  },
  {
    id: "o4",
    bookId: "b6",
    bookTitle: "被討厭的勇氣",
    bookCover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
    sellerName: "心靈導師",
    price: 240,
    status: "已完成",
    createdAt: "2024-02-10",
    type: "purchase",
  },
];

// Mock notifications data
export const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "like",
    title: "讀書小姐按讚了你的貼文",
    message: "「剛看完這本《百年孤寂》...」",
    createdAt: "5分鐘前",
    isRead: false,
    linkTo: "/post/p1",
  },
  {
    id: "n2",
    type: "comment",
    title: "文青阿華回覆了你的貼文",
    message: "「這本書我也很喜歡！推薦你可以看看...」",
    createdAt: "1小時前",
    isRead: false,
    linkTo: "/post/p2",
  },
  {
    id: "n3",
    type: "order",
    title: "新訂單通知",
    message: "買家B購買了你的《挪威的森林》",
    createdAt: "2小時前",
    isRead: true,
    linkTo: "/orders",
  },
  {
    id: "n4",
    type: "order",
    title: "訂單已出貨",
    message: "書海遊俠已將《嫌疑犯X的獻身》出貨",
    createdAt: "1天前",
    isRead: true,
    linkTo: "/orders",
  },
  {
    id: "n5",
    type: "system",
    title: "歡迎加入黑白冊",
    message: "開始探索二手書交易的樂趣吧！",
    createdAt: "3天前",
    isRead: true,
  },
];

// Mock other users
export const mockUsers: User[] = [
  {
    id: "2",
    name: "讀書小姐",
    username: "miss_reader",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    bio: "文學愛好者 | 喜歡魔幻寫實 | 分享閱讀的美好",
    followers: 856,
    following: 342,
    isFollowing: true,
  },
  {
    id: "3",
    name: "文青阿華",
    username: "hua_literary",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    bio: "村上春樹忠實讀者 | 日系文學 | 用文字記錄生活",
    followers: 1523,
    following: 678,
    isFollowing: false,
  },
  {
    id: "4",
    name: "書海遊俠",
    username: "book_wanderer",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop",
    bio: "推理小說狂熱者 🔍 | 東野圭吾粉絲 | 閰讀是最好的冒險",
    followers: 2103,
    following: 445,
    isFollowing: true,
  },
  {
    id: "5",
    name: "閱讀咖啡",
    username: "reading_cafe",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    bio: "咖啡與書本的完美結合 ☕ | 分享閱讀時光",
    followers: 678,
    following: 234,
    isFollowing: true,
  },
  {
    id: "6",
    name: "古籍收藏家",
    username: "ancient_collector",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    bio: "收藏珍貴書籍 | 歷史與人文社科愛好者 📚",
    followers: 1234,
    following: 567,
    isFollowing: false,
  },
  {
    id: "7",
    name: "科幻迷",
    username: "scifi_fan",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    bio: "科幻小說狂熱粉 🚀 | 劉慈欣的忠實讀者",
    followers: 2345,
    following: 890,
    isFollowing: false,
  },
  {
    id: "8",
    name: "心靈導師",
    username: "mindful_guide",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop",
    bio: "心理學與自我成長 | 幫助你成為更好的自己 💫",
    followers: 3456,
    following: 1234,
    isFollowing: true,
  },
];

// Current user's posts
export const currentUserPosts: Post[] = [
  {
    id: "p10",
    userId: "1",
    userName: "書蟲小明",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
    username: "bookworm_ming",
    content: "最近在讀《人類大歷史》，哈拉瑞用全新的視角解讀人類的演化。從智人崛起到現代文明，每個章節都讓我重新思考我們是誰、從哪裡來。強烈推薦！",
    bookTitle: "人類大歷史",
    bookAuthor: "哈拉瑞",
    bookCover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop",
    likes: 456,
    comments: 78,
    createdAt: "3天前",
    isLiked: false,
  },
  {
    id: "p11",
    userId: "1",
    userName: "書蟲小明",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
    username: "bookworm_ming",
    content: "《三體》真的太震撼了！劉慈欣構建的宇宙觀讓人腦洞大開。黑暗森林法則、降維打擊...每個概念都讓人深思。科幻迷必讀！",
    bookTitle: "三體",
    bookAuthor: "劉慈欣",
    bookCover: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop",
    likes: 892,
    comments: 156,
    createdAt: "1週前",
    isLiked: false,
  },
];

// Current user's books
export const currentUserBooks: Book[] = [
  {
    id: "b10",
    userId: "1",
    userName: "書蟲小明",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
    title: "原子習慣",
    author: "詹姆斯·克利爾",
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
    price: 280,
    condition: "近全新",
    description: "暢銷自我成長書籍，教你建立好習慣、改掉壞習慣。書況近全新，內容實用。",
    category: "自我成長",
    createdAt: "5天前",
    queueCount: 3,
    isReserved: true,
  },
  {
    id: "b11",
    userId: "1",
    userName: "書蟲小明",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
    title: "深度工作力",
    author: "卡爾·紐波特",
    cover: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop",
    price: 250,
    condition: "良好",
    description: "在淺薄的時代，深度工作力是最稀缺的能力。書況良好，適合想提升專注力的朋友。",
    category: "自我成長",
    createdAt: "1週前",
    queueCount: 0,
    isReserved: false,
  },
];

// Saved posts (for current user)
export const savedPosts: Post[] = [mockPosts[1], mockPosts[2]];

// Saved books (for current user)
export const savedBooks: Book[] = [
  {
    ...mockBooks[3],
    isSaved: true,
  },
  {
    ...mockBooks[4],
    isSaved: true,
  },
];

// Following list (for current user)
export const followingList: User[] = [mockUsers[0], mockUsers[2]];

// Followers list (for current user)
export const followersList: User[] = [
  mockUsers[0],
  mockUsers[1],
  mockUsers[2],
  {
    id: "5",
    name: "閱讀咖啡",
    username: "reading_cafe",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    bio: "咖啡與書本的完美結合 ☕",
    followers: 678,
    following: 234,
    isFollowing: true,
  },
];

// Book categories for filter
export const bookCategories = [
  "文學小說",
  "推理小說",
  "科幻小說",
  "人文社科",
  "心理勵志",
  "自我成長",
  "商業理財",
  "藝術設計",
];