<template>
  <form @submit.prevent="$emit('submit')" class="space-y-4">
    <slot />
  </form>
</template>

<script setup>
defineEmits(['submit'])
</script>
