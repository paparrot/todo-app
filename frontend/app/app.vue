<template>
  <div class="min-h-screen bg-slate-50">
    <NuxtRouteAnnouncer />
    <AppHeader v-if="showHeader" />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useHead, useRoute } from '#imports'
import { useAuth } from '~/features/auth/model/useAuth'

const route = useRoute()
const { token, currentUser, fetchCurrentUser } = useAuth()

useHead({
  title: 'Todo App',
  meta: [
    {
      name: 'description',
      content: 'Todo App is a simple task manager for organizing work, tracking progress, and managing tasks.'
    },
    {
      name: 'theme-color',
      content: '#10b981'
    }
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/favicon.svg?v=1'
    },
    {
      rel: 'shortcut icon',
      type: 'image/svg+xml',
      href: '/favicon.svg?v=1'
    }
  ]
})

const showHeader = computed(() => !['/login', '/register'].includes(route.path))

onMounted(() => {
  if (token.value && showHeader.value && !currentUser.value) {
    void fetchCurrentUser()
  }
})
</script>
