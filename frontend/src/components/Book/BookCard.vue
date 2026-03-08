<script setup lang="ts">
import { useRouter } from "vue-router";

type Book = {
  id: string | number;
  cover: string;
  title: string;
  author: string;
  price: number | string;
  condition: string;
  isReserved?: boolean;
  queueCount?: number;
};

const props = defineProps<{
  book: Book;
}>();

const router = useRouter();

function goDetail() {
  router.push(`/book/${props.book.id}`);
}
</script>

<template>
  <article class="book-card" role="button" tabindex="0" @click="goDetail" @keydown.enter.prevent="goDetail">
    <!-- Book Cover -->
    <div class="book-card__cover">
      <img class="book-card__img" :src="book.cover" :alt="book.title" />

      <div class="book-card__badges">
        <span class="book-card__badge book-card__badge--condition">
          {{ book.condition }}
        </span>

        <span
          v-if="book.isReserved && book.queueCount"
          class="book-card__badge book-card__badge--queue"
        >
          <svg class="book-card__badge-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M16 11c1.657 0 3-1.343 3-3S17.657 5 16 5s-3 1.343-3 3 1.343 3 3 3ZM8 11c1.657 0 3-1.343 3-3S9.657 5 8 5 5 6.343 5 8s1.343 3 3 3Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M2 19c0-2.761 2.239-5 5-5h2M22 19c0-2.761-2.239-5-5-5h-2"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {{ book.queueCount }}
        </span>
      </div>
    </div>

    <!-- Book Info -->
    <div class="book-card__info">
      <h3 class="book-card__title">
        {{ book.title }}
      </h3>

      <p class="book-card__author">
        {{ book.author }}
      </p>

      <div class="book-card__meta">
        <span class="book-card__price">NT$ {{ book.price }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.book-card {
  cursor: pointer;
  user-select: none;
}

.book-card:focus-visible {
  outline: none;
}

/* Cover */
.book-card__cover {
  position: relative;
  aspect-ratio: 2 / 3;
  margin-bottom: 12px;
  overflow: hidden;
  border-radius: var(--radius-md);
  background: var(--muted);
}

.book-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1);
  transition: transform 0.5s ease;
}

.book-card:hover .book-card__img {
  transform: scale(1.05);
}

.book-card__badges {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
}

.book-card__badge {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 999px;
  line-height: 1.4;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.book-card__badge--condition {
  background: color-mix(in srgb, var(--background) 90%, transparent);
  border: 1px solid var(--border);
  color: var(--foreground);
}

.book-card__badge--queue {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: color-mix(in srgb, var(--foreground) 90%, transparent);
  color: var(--background);
  border: 1px solid transparent;
}

.book-card__badge-icon {
  width: 12px;
  height: 12px;
}

/* Info */
.book-card__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.book-card__title {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.25;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  transition: color 0.2s ease;
}

.book-card:hover .book-card__title {
  color: var(--muted-foreground);
}

.book-card__author {
  font-size: 12px;
  color: var(--muted-foreground);

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-card__meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding-top: 4px;
}

.book-card__price {
  font-size: 14px;
  font-weight: 500;
}
</style>
