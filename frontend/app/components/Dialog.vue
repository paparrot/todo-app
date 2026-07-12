<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
    @click.self="close"
  >
    <div
      class="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl"
      @click.stop
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: boolean
}

withDefaults(defineProps<Props>(), {
  modelValue: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

function close() {
  emit('update:modelValue', false)
}
</script>
