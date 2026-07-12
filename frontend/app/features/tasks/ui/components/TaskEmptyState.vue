<template>
  <Card>
    <div
      class="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h2 class="text-xl font-semibold text-slate-900">No tasks yet</h2>
        <p class="mt-2 text-sm text-slate-600">
          Create your first task to get started.
        </p>
      </div>
      <Button v-if="canCreateTask" @click="emit('add-task')"> Add task </Button>
    </div>
  </Card>
</template>

<script setup lang="ts">
const props = defineProps<{
  canCreateTask: boolean
}>()

const emit = defineEmits<{
  (e: 'add-task'): void
}>()

const canCreateTask = props.canCreateTask
</script>
