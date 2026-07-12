<template>
  <RegisterForm />
</template>

<script setup lang="ts">
import RegisterForm from '~/features/auth/ui/RegisterForm.vue'

definePageMeta({
  middleware: ['guest']
})
</script>
