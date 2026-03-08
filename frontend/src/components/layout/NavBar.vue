<script setup lang="ts">
import { ref } from 'vue'
import ClerkView from '../clerk/ClerkView.vue';

const menuOpen = ref(false)
</script>

<template>
  <nav class="sticky top-0 z-50 bg-[var(--color-background)] border-b border-[var(--color-border)] px-4 py-3">
    <div class="max-w-[1200px] mx-auto flex items-center justify-between">

      <!-- Logo -->
      <div class="flex items-center gap-2">
        <RouterLink to="/" class="flex items-center">
          <img src="../../assets/logo.png" alt="logo" class="h-8 w-auto">
        </RouterLink>
      </div>

      <!-- Desktop Icon Actions -->
      <div class="hidden md:flex items-center gap-5">
        <i class="pi pi-pen-to-square text-2xl text-[var(--color-text-muted)] cursor-pointer hover:text-[var(--color-text)] transition-colors"></i>
        <i class="pi pi-file-plus text-2xl text-[var(--color-text-muted)] cursor-pointer hover:text-[var(--color-text)] transition-colors"></i>

        <div class="relative flex items-center">
          <i class="pi pi-shopping-cart text-2xl text-[var(--color-text-muted)] cursor-pointer hover:text-[var(--color-text)] transition-colors"></i>
          <span class="absolute -top-2 -right-2 bg-[var(--color-text)] text-[var(--color-background)] text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
            3
          </span>
        </div>

        <i class="pi pi-bell text-2xl text-[var(--color-text-muted)] cursor-pointer hover:text-[var(--color-text)] transition-colors"></i>
        <ClerkView />
      </div>

      <!-- Hamburger Button（mobile only） -->
      <button
        class="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 cursor-pointer"
        @click="menuOpen = !menuOpen"
        aria-label="開啟選單"
      >
        <span
          class="block w-6 h-0.5 bg-[var(--color-text)] transition-all duration-300 origin-center"
          :class="menuOpen ? 'rotate-45 translate-y-2' : ''"
        ></span>
        <span
          class="block w-6 h-0.5 bg-[var(--color-text)] transition-all duration-300"
          :class="menuOpen ? 'opacity-0 scale-x-0' : ''"
        ></span>
        <span
          class="block w-6 h-0.5 bg-[var(--color-text)] transition-all duration-300 origin-center"
          :class="menuOpen ? '-rotate-45 -translate-y-2' : ''"
        ></span>
      </button>

    </div>

    <!-- Mobile Dropdown Menu -->
    <div
      class="md:hidden overflow-hidden transition-all duration-300"
      :class="menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'"
    >
      <div class="flex flex-col gap-1 pt-3 pb-2 border-t border-[var(--color-border)] mt-3">
        <button class="flex items-center gap-3 px-2 py-3 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors w-full text-left">
          <i class="pi pi-pen-to-square text-xl"></i>
          <span class="text-sm font-medium">編輯</span>
        </button>
        <button class="flex items-center gap-3 px-2 py-3 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors w-full text-left">
          <i class="pi pi-file-plus text-xl"></i>
          <span class="text-sm font-medium">新增文件</span>
        </button>
        <button class="flex items-center gap-3 px-2 py-3 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors w-full text-left">
          <i class="pi pi-shopping-cart text-xl"></i>
          <span class="text-sm font-medium">購物車</span>
          <span class="ml-auto bg-[var(--color-text)] text-[var(--color-background)] text-[10px] w-5 h-5 rounded-full flex items-center justify-center">3</span>
        </button>
        <button class="flex items-center gap-3 px-2 py-3 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors w-full text-left">
          <i class="pi pi-bell text-xl"></i>
          <span class="text-sm font-medium">通知</span>
        </button>
        <div class="px-2 py-2">
          <ClerkView />
        </div>
      </div>
    </div>

  </nav>
</template>
