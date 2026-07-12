<template>
  <button
    :aria-label="ariaLabel"
    :disabled="disabled"
    :class="[
      'inline-flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
      variantClasses
    ]"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
type IconButtonVariant = 'primary' | 'danger' | 'default'

interface Props {
  variant?: IconButtonVariant
  disabled?: boolean
  ariaLabel: string
}

const props = defineProps<Props>()

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'danger':
      return 'text-danger-600 hover:bg-danger-50'
    case 'primary':
      return 'text-primary-700 hover:bg-primary-50'
    default:
      return 'text-slate-600 hover:bg-slate-100'
  }
})
</script>
