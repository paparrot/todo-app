<template>
  <Dialog v-model="isOpen">
    <h2 class="mb-6 text-2xl font-semibold tracking-tight text-slate-900">
      Add New Task
    </h2>
    <Form @submit="handleSubmit">
      <Input
        id="add-title"
        v-model="form.title"
        label="Title *"
        placeholder="Buy milk"
        :required="true"
        :minlength="3"
      />
      <p class="mt-1 text-xs text-slate-500">
        Required, at least 3 characters.
      </p>
      <div v-if="props.errors.title" class="mt-1 text-sm text-danger-600">
        {{ props.errors.title[0] }}
      </div>
      <Textarea
        id="add-description"
        v-model="form.description"
        label="Description"
        placeholder="From store"
      />
      <div v-if="props.errors.description" class="mt-1 text-sm text-danger-600">
        {{ props.errors.description[0] }}
      </div>
      <Input
        id="add-due-date"
        v-model="form.due_date"
        label="Due Date"
        type="date"
      />
      <div v-if="props.errors.due_date" class="mt-1 text-sm text-danger-600">
        {{ props.errors.due_date[0] }}
      </div>
      <div class="mt-6 flex gap-3">
        <Button type="button" variant="secondary" class="flex-1" @click="close"
          >Cancel</Button
        >
        <Button type="submit" class="flex-1" :disabled="props.loading">
          {{ props.loading ? 'Adding...' : 'Add task' }}
        </Button>
      </div>
    </Form>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { CreateTaskData } from '../../model/types'
import type { FieldErrors } from '~/types/ui'

const isOpen = defineModel<boolean>({ default: false })

const props = defineProps<{
  loading: boolean
  errors: FieldErrors
}>()

const emit = defineEmits<{
  (e: 'submit', data: CreateTaskData): void
}>()

const form = reactive<CreateTaskData>({
  title: '',
  description: '',
  due_date: null,
})

const resetForm = (): void => {
  form.title = ''
  form.description = ''
  form.due_date = null
}

watch(isOpen, (open: boolean) => {
  if (open) {
    resetForm()
  }
})

const handleSubmit = (): void => {
  emit('submit', {
    title: form.title,
    description: form.description,
    due_date: form.due_date,
  })
}

const close = (): void => {
  isOpen.value = false
}
</script>
