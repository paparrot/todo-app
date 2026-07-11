<template>
  <button
    :class="[
      'p-2 rounded-lg transition-colors',
      variantClasses
    ]"
  >
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  variant: { type: String, default: 'default' }
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'danger':
      return 'text-danger-600 hover:bg-danger-50'
    case 'primary':
      return 'text-primary-600 hover:bg-primary-50'
    default:
      return 'text-primary-600 hover:bg-primary-50'
  }
})
</script>
