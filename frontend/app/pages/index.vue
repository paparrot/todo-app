<template>
  <TaskBoard />
</template>

<script setup lang="ts">
import TaskBoard from '~/features/tasks/ui/TaskBoard.vue'

definePageMeta({
  middleware: ['auth']
})
</script>
