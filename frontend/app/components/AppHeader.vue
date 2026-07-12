<template>
  <header class="border-b border-slate-200 bg-white/90 backdrop-blur">
    <div class="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <div>
        <p class="text-sm font-medium uppercase tracking-[0.2em] text-primary-600">Todo App</p>
        <h1 class="mt-1 text-lg font-semibold tracking-tight text-slate-900">Workspace</h1>
      </div>

      <div class="flex items-center gap-4">
        <div v-if="currentUser" class="text-right">
          <p class="text-sm font-medium text-slate-900">{{ currentUser.email }}</p>
          <p class="text-xs uppercase tracking-[0.18em] text-slate-500">{{ roleLabel }}</p>
        </div>
        <div v-else class="text-sm text-slate-500">Loading account...</div>

        <Button variant="secondary" @click="handleLogout">Logout</Button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '~/features/auth/model/useAuth'

const { currentUser, logout } = useAuth()

const roleLabel = computed(() => {
  if (!currentUser.value) {
    return ''
  }

  return currentUser.value.role === 'admin' ? 'Admin' : 'Owner'
})

const handleLogout = async (): Promise<void> => {
  await logout()
}
</script>
