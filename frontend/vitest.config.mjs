// @ts-nocheck
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

function injectNuxtHelpers() {
  return {
    name: 'inject-nuxt-helpers-for-tests',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('.ts')) {
        return null
      }

      const injectVueImports = "import { computed, onMounted, ref, watch } from 'vue'\n"

      if (id.endsWith('/app/features/auth/model/useAuth.ts')) {
        return {
          code: `${injectVueImports}const useApi = globalThis.useApi\nconst useCookie = globalThis.useCookie\nconst useState = globalThis.useState\nconst navigateTo = globalThis.navigateTo\n${code}`,
          map: null
        }
      }

      if (id.endsWith('/app/features/tasks/model/useTasks.ts')) {
        return {
          code: `${injectVueImports}const useApi = globalThis.useApi\n${code}`,
          map: null
        }
      }

      if (id.endsWith('/app/middleware/auth.ts')) {
        return {
          code: code.replace(
            "import { useAuth } from '~/features/auth/model/useAuth'",
            "const useAuth = globalThis.useAuth"
          )
            .replace(
              'export default defineNuxtRouteMiddleware(() => {',
              "const defineNuxtRouteMiddleware = (middleware: unknown) => middleware\nconst navigateTo = globalThis.navigateTo\n\nexport default defineNuxtRouteMiddleware(() => {"
            ),
          map: null
        }
      }

      return null
    }
  }
}

export default defineConfig({
  plugins: [injectNuxtHelpers()],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./app', import.meta.url)),
      '@': fileURLToPath(new URL('./app', import.meta.url))
    }
  },
  test: {
    environment: 'node',
    globals: true,
    restoreMocks: true,
    clearMocks: true
  }
})
