// @ts-nocheck
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./app', import.meta.url)),
      '@': fileURLToPath(new URL('./app', import.meta.url)),
      '#imports': fileURLToPath(new URL('./test-support/nuxt-imports.ts', import.meta.url))
    }
  },
  test: {
    environment: 'node',
    globals: true,
    restoreMocks: true,
    clearMocks: true
  }
})
