export interface ReadingPost {
  id: string;
  title?: string | null;
  content?: string | null;
  rating?: number;
  likes?: number;
  commentCount?: number;
  updatedAt?: string;
  accountId?: string | null;
  /** 以下為 UI 顯示用，API 不回傳，mock 或 client 可補上 */
  userName?: string;
  userAvatar?: string;
  username?: string;
  bookTitle?: string;
  bookAuthor?: string;
  bookCover?: string;
  images?: string[];
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt?: string;
}

/** API 回傳的收藏貼文結構 (GET /me/saved/posts) */
export interface SavedPostResponse {
  post: ReadingPost;
  userAccountId: string;
}

export interface CreateReadingPost {
  id?: string;
  title?: string | null;
  content?: string | null;
  rating?: number;
  updatedAt?: string;
}

export interface LikePost {
  likeCount: number; // 1 = 按讚, -1 = 取消讚
}

// --- Comment ---
export interface Comment {
  id: string;
  content?: string | null;
  isDeleted: boolean;
  createdAt: string;
  postId: string;
  parentId?: string | null;
  rootId: string;
  depth: number;
  childCommentCount: number;
  authorId: string;
  authorAccountId?: string | null;
}

export interface CreateComment {
  content?: string | null;
  createdAt?: string;
  postId: string;
  parentId?: string | null;
  rootId?: string | null;
}
