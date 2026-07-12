<template>
  <div>
    <label
      v-if="label"
      :for="id"
      class="mb-2 block text-sm font-medium text-slate-700"
      >{{ label }}</label
    >
    <textarea
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:bg-slate-100"
      @input="handleInput"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
interface TextareaProps {
  id: string
  label?: string
  modelValue?: string | null
  placeholder?: string
  rows?: number
  disabled?: boolean
}

withDefaults(defineProps<TextareaProps>(), {
  label: '',
  modelValue: '',
  placeholder: '',
  rows: 3,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement | null
  if (!target) {
    return
  }

  emit('update:modelValue', target.value)
}
</script>
