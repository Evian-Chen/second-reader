<script setup lang="ts">
import { ref } from 'vue'
const activeTab = ref('reading')
</script>

<template>
  <div class="tabs-container">
    <button 
      class="tab-link" 
      :class="{ active: activeTab === 'reading' }"
      @click="activeTab = 'reading'"
    >
      閱讀分享
    </button>
    <button 
      class="tab-link" 
      :class="{ active: activeTab === 'market' }"
      @click="activeTab = 'market'"
    >
      二手書市集
    </button>
  </div>
</template>

<style scoped>
.tabs-container {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  width: 100%;
}
.tab-link {
  flex: 1;
  padding: 1rem 0;
  text-align: center;
  font-weight: 500;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}
.tab-link.active {
  color: black;
}
.tab-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: black;
}
</style>