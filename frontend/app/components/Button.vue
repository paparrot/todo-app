<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
      sizeClasses,
      variantClasses
    ]"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type ButtonVariant = 'primary' | 'secondary' | 'danger'
type ButtonSize = 'md' | 'sm'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false
})

const sizeClasses = computed(() => {
  return props.size === 'sm'
    ? 'px-3 py-2 text-xs'
    : 'px-5 py-3 text-sm'
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
    case 'danger':
      return 'bg-danger-600 text-white hover:bg-danger-700 shadow-sm'
    default:
      return 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm'
  }
})
</script>
