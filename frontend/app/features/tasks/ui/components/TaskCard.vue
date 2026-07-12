<template>
  <Card>
    <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div class="flex-1">
        <div :class="['inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.18em]', props.taskStatusClasses[props.task.status]]">
          {{ props.taskStatusLabels[props.task.status] }}
        </div>
        <h3 class="mt-2 text-xl font-semibold text-slate-900">{{ props.task.title }}</h3>
        <p class="mt-1 text-sm text-slate-500">Created by: {{ props.task.user_name ?? 'Unknown user' }}</p>
        <p v-if="props.task.description" class="mt-2 text-slate-600">{{ props.task.description }}</p>
        <div class="mt-4 flex flex-wrap items-center gap-4">
          <span class="text-sm text-slate-500">Due: {{ props.formatDate(props.task.due_date) }}</span>
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <Button
          v-if="props.task.status === 'pending'"
          size="sm"
          type="button"
          variant="secondary"
          :disabled="isDisabled"
          @click="emit('set-status', 'in_progress')"
        >
          <PlayIcon class="h-3.5 w-3.5" />
          Start
        </Button>
        <Button
          v-else-if="props.task.status === 'in_progress'"
          size="sm"
          type="button"
          :disabled="isDisabled"
          @click="emit('set-status', 'completed')"
        >
          <CheckIcon class="h-3.5 w-3.5" />
          Complete
        </Button>
        <IconButton aria-label="Edit task" :disabled="isDisabled" @click="emit('edit')">
          <PencilIcon class="h-4 w-4" />
        </IconButton>
        <IconButton aria-label="Delete task" variant="danger" :disabled="isDisabled" @click="emit('delete')">
          <TrashIcon class="h-4 w-4" />
        </IconButton>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckIcon, PencilIcon, PlayIcon, TrashIcon } from '@heroicons/vue/24/outline'
import type { Task, TaskStatus } from '../../model/types'

const props = defineProps<{
  task: Task
  disabled?: boolean
  taskStatusLabels: Record<TaskStatus, string>
  taskStatusClasses: Record<TaskStatus, string>
  formatDate: (date: string | null) => string
}>()

const emit = defineEmits<{
  (e: 'set-status', status: TaskStatus): void
  (e: 'edit'): void
  (e: 'delete'): void
}>()

const isDisabled = computed(() => props.disabled ?? false)
</script>
