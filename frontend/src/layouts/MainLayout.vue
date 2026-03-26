<script setup lang="ts">
import TheNavbar from '@/components/icons/TheNavbar.vue'
</script>

<template>
  <div class="layout-wrapper">
    <TheNavbar />
    <main class="layout-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 80vh;
  width: 100%;
}
.layout-content {
  flex: 1;
  width: 100%;
  background-color: #f8f9fa;
  padding: 0;
}
</style>
