import type { BookResponse } from '@/types/book'
import { BookCategory } from '@/types/book'

/**
 * Mock 書籍資料
 * 用於 MSW API mocking 和測試
 */
export const mockBooks: BookResponse[] = [
  {
    userBookId: 1,
    isbn: '9789861755267',
    title: '原子習慣',
    author: '詹姆斯・克利爾',
    description: '細微改變帶來巨大成就的實證法則',
    bookCategory: BookCategory.GenreFic,
  },
  {
    userBookId: 2,
    isbn: '9789861755268',
    title: '深度工作力',
    author: '卡爾・紐波特',
    description: '淺薄時代，個人成功的關鍵能力',
    bookCategory: BookCategory.GenreFic,
  },
  {
    userBookId: 3,
    isbn: '9789861755269',
    title: '被討厭的勇氣',
    author: '岸見一郎、古賀史健',
    description: '自我啟發之父「阿德勒」的教導',
    bookCategory: BookCategory.Philisophy,
  },
  {
    userBookId: 4,
    isbn: '9789861755270',
    title: '原則：生活和工作',
    author: '瑞・達利歐',
    description: '橋水基金創辦人的人生與工作原則',
    bookCategory: BookCategory.GenreFic,
  },
  {
    userBookId: 5,
    isbn: '9789861755271',
    title: '人類大歷史：從野獸到扮演上帝',
    author: '哈拉瑞',
    description: '從認知革命到科學革命，人類如何改變世界',
    bookCategory: BookCategory.History,
  },
  {
    userBookId: 6,
    isbn: '9789861755272',
    title: '思考的藝術：52 個非受迫性思考錯誤',
    author: '魯爾夫・杜伯里',
    description: '讓你更聰明的思考方式',
    bookCategory: BookCategory.Philisophy,
  },
  {
    userBookId: 7,
    isbn: '9789861755273',
    title: '快思慢想',
    author: '丹尼爾・康納曼',
    description: '思考，快與慢的決策心理學',
    bookCategory: BookCategory.Philisophy,
  },
  {
    userBookId: 8,
    isbn: '9789861755274',
    title: '刻意練習：原創者現身說法',
    author: '安德斯・艾利克森、羅伯特・普爾',
    description: '如何從新手到大師',
    bookCategory: BookCategory.GenreFic,
  },
  {
    userBookId: 9,
    isbn: '9789861755275',
    title: '華語文學作品集',
    author: '多位作者',
    description: '精選華語文學作品',
    bookCategory: BookCategory.Mandarin,
  },
  {
    userBookId: 10,
    isbn: '9789861755276',
    title: '世界文學經典',
    author: '經典作家',
    description: '世界文學經典作品',
    bookCategory: BookCategory.World,
  },
]
