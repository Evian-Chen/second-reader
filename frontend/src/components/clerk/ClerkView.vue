<script setup lang="ts">
  import { SignedIn, SignedOut, SignInButton, UserButton } from 'vue-clerk'
</script>

<template>
  <SignedOut>
    <SignInButton />
  </SignedOut>
  <SignedIn>
    <UserButton />
  </SignedIn>
</template>
