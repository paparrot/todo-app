<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false }
})

defineEmits(['update:modelValue'])
</script>
