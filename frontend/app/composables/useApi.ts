import { useCookie, useRuntimeConfig } from '#imports'

export const useApi = () => {
  const config = useRuntimeConfig()

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      const token = useCookie<string | null>('auth_token')

      if (token.value) {
        const headers = new Headers(options.headers as HeadersInit | undefined)
        headers.set('Authorization', `Bearer ${token.value}`)
        options.headers = headers
      }
    },
    onResponseError({ response }) {
      console.error('API Error:', response)
    },
  })

  return {
    apiFetch,
  }
}
