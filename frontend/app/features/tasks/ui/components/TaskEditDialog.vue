<template>
  <Dialog v-model="isOpen">
    <h2 class="mb-6 text-2xl font-semibold tracking-tight text-slate-900">Edit Task</h2>
    <Form @submit="handleSubmit">
      <Input
        id="edit-title"
        label="Title *"
        :required="true"
        :minlength="3"
        v-model="form.title"
      />
      <p class="mt-1 text-xs text-slate-500">Required, at least 3 characters.</p>
      <div v-if="props.errors.title" class="mt-1 text-sm text-danger-600">{{ props.errors.title[0] }}</div>
      <Textarea
        id="edit-description"
        label="Description"
        v-model="form.description"
      />
      <div v-if="props.errors.description" class="mt-1 text-sm text-danger-600">{{ props.errors.description[0] }}</div>
      <Input
        id="edit-due-date"
        label="Due Date"
        type="date"
        v-model="form.due_date"
      />
      <div v-if="props.errors.due_date" class="mt-1 text-sm text-danger-600">{{ props.errors.due_date[0] }}</div>
      <Select id="edit-status" label="Status" v-model="form.status">
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </Select>
      <div v-if="props.errors.status" class="mt-1 text-sm text-danger-600">{{ props.errors.status[0] }}</div>
      <div class="mt-6 flex gap-3">
        <Button type="button" variant="secondary" class="flex-1" @click="close">Cancel</Button>
        <Button type="submit" class="flex-1" :disabled="props.loading">
          {{ props.loading ? 'Saving...' : 'Save Changes' }}
        </Button>
      </div>
    </Form>
  </Dialog>
</template>

<script setup lang="ts">
import type { Task, UpdateTaskData } from '../../model/types'
import type { FieldErrors } from '~/types/ui'

const isOpen = defineModel<boolean>({ default: false })

const props = defineProps<{
  task: Task | null
  loading: boolean
  errors: FieldErrors
}>()

const emit = defineEmits<{
  (e: 'submit', data: UpdateTaskData): void
}>()

const form = reactive<UpdateTaskData>({
  id: 0,
  title: '',
  description: '',
  due_date: null,
  status: 'pending'
})

const syncForm = (): void => {
  if (!props.task) {
    return
  }

  form.id = props.task.id
  form.title = props.task.title
  form.description = props.task.description ?? ''
  form.due_date = props.task.due_date
  form.status = props.task.status
}

watch(isOpen, (open: boolean) => {
  if (open) {
    syncForm()
  }
}, { immediate: true })

const handleSubmit = (): void => {
  emit('submit', {
    id: form.id,
    title: form.title,
    description: form.description,
    due_date: form.due_date,
    status: form.status
  })
}

const close = (): void => {
  isOpen.value = false
}
</script>
