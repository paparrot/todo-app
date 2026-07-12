<template>
  <form @submit.prevent="emit('submit')" class="space-y-4">
    <slot />
  </form>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'submit'): void
}>()
</script>
