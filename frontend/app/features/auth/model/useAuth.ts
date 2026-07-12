import { computed } from 'vue'
import { navigateTo, useCookie, useState } from '#imports'
import { useApi } from '~/composables/useApi'
import type {
  ActionResult,
  ApiErrorResponse,
  AuthResponse,
  AuthUser,
  LoginCredentials,
  RegisterData,
} from '~/types/api'
import type { FieldErrors } from '~/types/ui'

function extractApiErrors(
  error: unknown,
  fallbackMessage = 'Something went wrong',
): FieldErrors {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const apiError = (error as { data?: ApiErrorResponse }).data

    if (apiError?.message) {
      return { general: [apiError.message] }
    }

    if (apiError?.errors) {
      return apiError.errors
    }
  }

  return { general: [fallbackMessage] }
}

export const useAuth = () => {
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    path: '/',
  })
  const currentUser = useState<AuthUser | null>('current_user', () => null)
  const isAuthenticated = computed(() => !!token.value)

  const { apiFetch } = useApi()

  const fetchCurrentUser = async (): Promise<AuthUser | null> => {
    try {
      const response = await apiFetch<AuthUser>('/user')
      currentUser.value = response
      return response
    } catch (error: unknown) {
      currentUser.value = null

      if (typeof error === 'object' && error !== null) {
        const statusCode =
          'statusCode' in error
            ? Number((error as { statusCode?: unknown }).statusCode)
            : null

        if (statusCode === 401 || statusCode === 403) {
          token.value = null
          await navigateTo('/login')
        }
      }

      return null
    }
  }

  const login = async (
    credentials: LoginCredentials,
  ): Promise<ActionResult> => {
    try {
      const response = await apiFetch<AuthResponse>('/login', {
        method: 'POST',
        body: credentials,
      })
      token.value = response.token
      currentUser.value = response.user
      return { success: true }
    } catch (error: unknown) {
      return {
        success: false,
        errors: extractApiErrors(error),
      }
    }
  }

  const register = async (data: RegisterData): Promise<ActionResult> => {
    try {
      const response = await apiFetch<AuthResponse>('/register', {
        method: 'POST',
        body: data,
      })
      token.value = response.token
      currentUser.value = response.user
      return { success: true }
    } catch (error: unknown) {
      return {
        success: false,
        errors: extractApiErrors(error),
      }
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await apiFetch('/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      token.value = null
      currentUser.value = null
      await navigateTo('/login')
    }
  }

  return {
    token,
    currentUser,
    isAuthenticated,
    fetchCurrentUser,
    login,
    register,
    logout,
  }
}
