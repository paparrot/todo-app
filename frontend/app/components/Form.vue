<template>
  <form class="space-y-4" @submit.prevent="emit('submit')">
    <slot />
  </form>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'submit'): void
}>()
</script>
