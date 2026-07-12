<template>
  <div class="min-h-screen bg-slate-50">
    <NuxtRouteAnnouncer />
    <AppHeader v-if="showHeader" />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { token, currentUser, fetchCurrentUser } = useAuth()

const showHeader = computed(() => !['/login', '/register'].includes(route.path))

onMounted(() => {
  if (token.value && showHeader.value && !currentUser.value) {
    void fetchCurrentUser()
  }
})
</script>
