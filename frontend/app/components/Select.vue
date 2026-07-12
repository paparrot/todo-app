<template>
  <div>
    <label
      v-if="label"
      :for="id"
      class="mb-2 block text-sm font-medium text-slate-700"
      >{{ label }}</label
    >
    <select
      :id="id"
      :value="modelValue"
      :disabled="disabled"
      class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:bg-slate-100"
      @change="handleChange"
    >
      <slot />
    </select>
  </div>
</template>

<script setup lang="ts">
interface SelectProps {
  id: string
  label?: string
  modelValue?: string
  disabled?: boolean
}

withDefaults(defineProps<SelectProps>(), {
  label: '',
  modelValue: '',
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement | null
  if (!target) {
    return
  }

  emit('update:modelValue', target.value)
}
</script>
