<script setup lang="ts">
type Props = {
  placeholder: string
}

const props = defineProps<Props>();
const emit = defineEmits(["search"])

function handleSearch() {
  emit("search");
}
</script>

<template>
  <div class="flex items-center w-[90%] px-3 py-2 gap-2">
    <span class="pi pi-search text-[var(--color-text-muted)]"></span>
    <input
      class="flex-1 border-none border-b border-[var(--color-text)] bg-transparent outline-none text-sm py-1 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] transition-colors"
      type="text"
      :placeholder="props.placeholder"
    />
    <button
      @click="handleSearch"
      class="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium cursor-pointer transition-colors"
    >
      搜尋
    </button>
  </div>
</template>
