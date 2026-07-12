import { ref } from 'vue'
import { useFormatDate } from '~/composables/useFormatDate'
import { useInfiniteScroll } from '~/composables/useInfiniteScroll'

function getGlobalFunction<T extends (...args: any[]) => any>(name: string): T | null {
  const candidate = (globalThis as Record<string, unknown>)[name]

  return typeof candidate === 'function' ? (candidate as T) : null
}

export { useFormatDate, useInfiniteScroll }

export function useRuntimeConfig() {
  const runtimeConfig = getGlobalFunction<() => unknown>('useRuntimeConfig')

  if (runtimeConfig) {
    return runtimeConfig()
  }

  return {
    public: {
      apiBase: 'http://localhost:8000/api'
    }
  }
}

export function useCookie<T>(name: string, options?: unknown) {
  const cookie = getGlobalFunction<(name: string, options?: unknown) => unknown>('useCookie')

  if (cookie) {
    return cookie(name, options)
  }

  return ref<T | null>(null)
}

export function useState<T>(key: string, init?: () => T) {
  const state = getGlobalFunction<(key: string, init?: () => T) => unknown>('useState')

  if (state) {
    return state(key, init)
  }

  return ref<T | null>(init ? init() : null)
}

export function useRoute() {
  const route = getGlobalFunction<() => unknown>('useRoute')
  return route ? route() : { path: '/' }
}

export function useHead(...args: unknown[]) {
  const head = getGlobalFunction<(...args: unknown[]) => unknown>('useHead')
  return head ? head(...args) : undefined
}

export function navigateTo(...args: unknown[]) {
  const navigate = getGlobalFunction<(...args: unknown[]) => unknown>('navigateTo')
  return navigate ? navigate(...args) : Promise.resolve(args[0])
}

export function defineNuxtRouteMiddleware<T extends (...args: unknown[]) => unknown>(middleware: T): T {
  return middleware
}

export function definePageMeta(meta: unknown) {
  return meta
}
