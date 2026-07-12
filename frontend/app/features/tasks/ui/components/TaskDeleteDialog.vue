<template>
  <Dialog v-model="isOpen">
    <h2 class="mb-4 text-2xl font-semibold tracking-tight text-slate-900">Delete Task</h2>
    <p class="mb-8 text-slate-600">Are you sure you want to delete this task? This action cannot be undone.</p>
    <div class="flex gap-3">
      <Button variant="secondary" class="flex-1" @click="close">Cancel</Button>
      <Button variant="danger" class="flex-1" :disabled="loading" @click="emit('confirm')">
        {{ loading ? 'Deleting...' : 'Delete' }}
      </Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
const isOpen = defineModel<boolean>({ default: false })

const props = defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
}>()

const close = (): void => {
  isOpen.value = false
}
</script>
