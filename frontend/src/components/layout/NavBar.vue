<script setup lang="ts">
import ClerkView from '../clerk/ClerkView.vue';

</script>

<template>
  <nav class="navbar">
    <div class="nav-content">
      <div class="logo">
        <RouterLink to="/" class="logo-link">
            <img src="../../assets/logo.png" alt="logo" class="logo-img">
        </RouterLink>
      </div>

      <div class="icon-actions">
        
        <i class="pi pi-pen-to-square icon-btn"></i>
        <i class="pi pi-file-plus icon-btn"></i>
        <div class="cart-container">
          <i class="pi pi-shopping-cart icon-btn"></i>
          <span class="cart-badge">3</span>
        </div>
        <i class="pi pi-bell icon-btn"></i>
        <ClerkView />
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: white;
  border-bottom: 1px solid #f3f4f6;
  padding: 0.75rem 1rem;
}
.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.logo-link {
  display: flex;
  align-items: center;
}
.logo-img {
  height: 2rem;
  width: auto;
}
.logo-icon {
  width: 2rem;
  height: 1.5rem;
  background-color: black;
  border-radius: 2px;
}
.logo-name {
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: -0.025em;
}
.icon-actions {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}
.icon-btn {
  font-size: 1.5rem;
  color: #4b5563;
  cursor: pointer;
}
.cart-container {
  position: relative;
  display: flex;
  align-items: center;
}
.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: black;
  color: white;
  font-size: 10px;
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-avatar {
  width: 2rem;
  height: 2rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  border: 1px solid #f3f4f6;
}
</style>