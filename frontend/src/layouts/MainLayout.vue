<script setup lang="ts">
import TheNavbar from '@/components/icons/TheNavbar.vue'
</script>

<template>
  <div class="layout-wrapper">
    <TheNavbar />
    <main class="layout-content">
      <div class="page-shell">
        <router-view />
      </div>
    </main>
  </div>
</template>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}
.layout-content {
  flex: 1;
  width: 100%;
  background-color: #f5f5f5;
  padding: 0;
}
.page-shell {
  max-width: 1220px;
  margin: 0 auto;
  padding: 18px 20px 28px;
}
</style>
