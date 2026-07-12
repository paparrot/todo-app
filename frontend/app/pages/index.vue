<template>
  <TaskBoard />
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'
import TaskBoard from '~/features/tasks/ui/TaskBoard.vue'

definePageMeta({
  middleware: ['auth'],
})
</script>
