<template>
  <LoginForm />
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'
import LoginForm from '~/features/auth/ui/LoginForm.vue'

definePageMeta({
  middleware: ['guest']
})
</script>
