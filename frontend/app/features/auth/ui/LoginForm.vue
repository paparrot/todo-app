<template>
  <div class="min-h-screen bg-slate-50">
    <div class="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-12">
      <div class="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">
        <div class="mb-8">
          <p class="text-sm font-medium uppercase tracking-[0.2em] text-primary-600">Todo App</p>
          <h1 class="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Login</h1>
          <p class="mt-2 text-sm text-slate-600">Sign in to manage your tasks.</p>
        </div>

        <div v-if="errors.general" class="mb-6 rounded-lg border border-danger-200 bg-danger-50 p-4 text-danger-800">
          {{ errors.general[0] }}
        </div>

        <Form @submit="handleSubmit" class="space-y-6">
          <div>
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="john@example.com"
              v-model="form.email"
            />
            <p v-if="errors.email" class="mt-2 text-sm text-danger-600">
              {{ errors.email[0] }}
            </p>
          </div>

          <div>
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              v-model="form.password"
            />
            <p v-if="errors.password" class="mt-2 text-sm text-danger-600">
              {{ errors.password[0] }}
            </p>
          </div>

          <Button type="submit" class="w-full" :disabled="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </Button>
        </Form>

        <p class="mt-6 text-center text-sm text-slate-600">
          Don't have an account?
          <NuxtLink to="/register" class="font-medium text-primary-700 hover:text-primary-800">Register</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { navigateTo } from '#imports'
import { useAuth } from '~/features/auth/model/useAuth'
import type { LoginCredentials } from '~/types/api'
import type { FieldErrors } from '~/types/ui'

const { login } = useAuth()
const form = ref<LoginCredentials>({
  email: '',
  password: ''
})
const errors = ref<FieldErrors>({})
const loading = ref<boolean>(false)

const handleSubmit = async () => {
  errors.value = {}
  loading.value = true

  const result = await login(form.value)

  if (result.success) {
    await navigateTo('/')
  } else {
    errors.value = result.errors || {}
  }

  loading.value = false
}
</script>
