<template>
  <button
    :type="type"
    :class="[
      'font-semibold py-3 px-6 rounded-lg transition-colors',
      variantClasses
    ]"
  >
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  variant: { type: String, default: 'primary' },
  type: { type: String, default: 'button' }
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-gray-200 text-gray-800 hover:bg-gray-300'
    case 'danger':
      return 'bg-danger-600 text-white hover:bg-danger-700'
    default:
      return 'bg-primary-600 text-white hover:bg-primary-700'
  }
})
</script>
