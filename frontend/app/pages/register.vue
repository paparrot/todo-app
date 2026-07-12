<template>
  <RegisterForm />
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'
import RegisterForm from '~/features/auth/ui/RegisterForm.vue'

definePageMeta({
  middleware: ['guest']
})
</script>
