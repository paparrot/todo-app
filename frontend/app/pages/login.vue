<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">Login</h1>
      <Form @submit="() => {}" class="space-y-6">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="john@example.com"
          v-model="form.email"
        />
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          v-model="form.password"
        />
        <Button type="submit" class="w-full">Login</Button>
      </Form>
      <p class="text-center text-gray-600 mt-6">
        Don't have an account?
        <NuxtLink to="/register" class="text-primary-600 hover:underline font-medium">Register</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
const form = ref({
  email: '',
  password: ''
})
</script>
