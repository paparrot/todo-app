<template>
  <div>
    <label v-if="label" :for="id" class="mb-2 block text-sm font-medium text-slate-700">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :minlength="minlength"
      @input="handleInput"
      class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:bg-slate-100"
    />
  </div>
</template>

<script setup lang="ts">
type InputType = 'text' | 'email' | 'password' | 'number' | 'date'

interface InputProps {
  id: string
  label?: string
  type?: InputType
  modelValue?: string | number
  placeholder?: string
  disabled?: boolean
  required?: boolean
  minlength?: number
}

const props = withDefaults(defineProps<InputProps>(), {
  label: '',
  type: 'text',
  modelValue: '',
  placeholder: '',
  disabled: false,
  required: false,
  minlength: undefined
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement | null
  if (!target) {
    return
  }

  const value = props.type === 'number'
    ? (target.value === '' ? '' : Number(target.value))
    : target.value

  emit('update:modelValue', value)
}
</script>
