<template>
  <main class="min-h-screen bg-background flex flex-col gap-8 md:gap-12">
    <!-- 搜尋區塊 -->
    <section class="relative py-16 md:py-24 bg-linear-to-b from-background to-background-secondary overflow-hidden">
      <!-- 裝飾性背景元素 -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
      </div>
      
      <div class="container-custom relative z-10">
        <div class="max-w-3xl mx-auto flex flex-col items-center">
          <!-- 標題區 -->
          <div class="text-center mb-10 md:mb-12 w-full">
            <h1 class="text-3xl md:text-5xl font-bold text-text-primary mb-3 tracking-tight">
              尋找你的下一本好書
            </h1>
            <p class="text-base md:text-lg text-text-secondary">
              探索二手書的無限可能
            </p>
          </div>
          
          <!-- 搜尋輸入框 -->
          <div class="relative group w-full">
            <div class="absolute inset-0 bg-white rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
            <div class="relative bg-white rounded-2xl shadow-md border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-xl focus-within:shadow-xl focus-within:border-accent/30">
              <div class="flex items-center">
                <!-- 搜尋圖示 -->
                <div class="pl-6 pr-4 shrink-0">
                  <svg
                    class="w-5 h-5 text-text-tertiary transition-colors duration-200 group-focus-within:text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                
                <!-- 輸入框 -->
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="搜尋書名、作者、ISBN..."
                  class="flex-1 py-5 pr-6 text-base md:text-lg bg-transparent border-0 focus:outline-none placeholder:text-text-tertiary text-text-primary"
                  @keyup.enter="handleSearch"
                  @focus="isFocused = true"
                  @blur="isFocused = false"
                />
                
                <!-- 搜尋按鈕 -->
                <button
                  @click="handleSearch"
                  class="mr-4 px-6 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent/90 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  aria-label="搜尋"
                >
                  搜尋
                </button>
              </div>
            </div>
          </div>
          
          <!-- 快速搜尋標籤（可選） -->
          <div class="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-text-secondary w-full">
            <span class="mr-2">熱門搜尋：</span>
            <button
              v-for="tag in popularTags"
              :key="tag"
              @click="searchQuery = tag; handleSearch()"
              class="px-3 py-1.5 rounded-lg bg-white/60 hover:bg-white border border-border/50 hover:border-accent/30 text-text-secondary hover:text-accent transition-all duration-200 hover:shadow-sm"
            >
              {{ tag }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 書籍展示區 -->
    <section class="py-8 md:py-12 flex-1">
      <div class="container-custom">
        <!-- 分類標籤（可選） -->
        <div class="flex flex-wrap gap-2 mb-6">
          <button
            class="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            全部
          </button>
          <button
            class="px-4 py-2 text-sm font-medium bg-white text-text-primary) border border-border rounded-lg hover:bg-surface-hover transition-colors"
          >
            文學小說
          </button>
          <button
            class="px-4 py-2 text-sm font-medium bg-white text-text-primary) border border-border rounded-lg hover:bg-surface-hover transition-colors"
          >
            商業理財
          </button>
          <button
            class="px-4 py-2 text-sm font-medium bg-white text-text-primary) border border-border rounded-lg hover:bg-surface-hover transition-colors"
          >
            心理勵志
          </button>
          <button
            class="px-4 py-2 text-sm font-medium bg-white text-text-primary) border border-border rounded-lg hover:bg-surface-hover transition-colors"
          >
            人文社科
          </button>
        </div>

        <!-- 書籍網格 -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          <BookCard
            v-for="book in books"
            :key="book.id"
            :book="book"
          />
        </div>

        <!-- 載入更多按鈕 -->
        <div class="text-center mt-8">
          <button
            class="px-6 py-3 text-sm font-medium bg-white text-text-primary) border border-border rounded-lg hover:bg-surface-hover transition-colors"
          >
            載入更多
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BookCard from '../components/BookCard.vue'

const searchQuery = ref('')
const isFocused = ref(false)
const popularTags = ['原子習慣', '深度工作力', '被討厭的勇氣', '人類大歷史']

// 範例書籍資料
const books = ref([
  {
    id: '1',
    title: '原子習慣：細微改變帶來巨大成就的實證法則',
    author: '詹姆斯・克利爾',
    price: 320,
    originalPrice: 380,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    condition: '近全新',
    rating: 4.5,
  },
  {
    id: '2',
    title: '深度工作力：淺薄時代，個人成功的關鍵能力',
    author: '卡爾・紐波特',
    price: 280,
    originalPrice: 350,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    condition: '良好',
    rating: 4.8,
  },
  {
    id: '3',
    title: '被討厭的勇氣：自我啟發之父「阿德勒」的教導',
    author: '岸見一郎、古賀史健',
    price: 250,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
    condition: '良好',
    rating: 4.7,
  },
  {
    id: '4',
    title: '原則：生活和工作',
    author: '瑞・達利歐',
    price: 450,
    originalPrice: 550,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    condition: '近全新',
    rating: 4.6,
  },
  {
    id: '5',
    title: '人類大歷史：從野獸到扮演上帝',
    author: '哈拉瑞',
    price: 380,
    originalPrice: 450,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
    condition: '良好',
    rating: 4.9,
  },
  {
    id: '6',
    title: '思考的藝術：52 個非受迫性思考錯誤',
    author: '魯爾夫・杜伯里',
    price: 300,
    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop',
    condition: '良好',
    rating: 4.4,
  },
  {
    id: '7',
    title: '快思慢想',
    author: '丹尼爾・康納曼',
    price: 420,
    originalPrice: 500,
    image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400&h=600&fit=crop',
    condition: '近全新',
    rating: 4.8,
  },
  {
    id: '8',
    title: '刻意練習：原創者現身說法',
    author: '安德斯・艾利克森、羅伯特・普爾',
    price: 350,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    condition: '良好',
    rating: 4.5,
  },
])

const handleSearch = () => {
  // 搜尋邏輯
  console.log('搜尋:', searchQuery.value)
}
</script>
