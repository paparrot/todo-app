import type { ActionResult, ApiErrorResponse, AuthResponse, LoginCredentials, RegisterData } from '~/types/api'
import type { FieldErrors } from '~/types/ui'

function extractApiErrors(error: unknown, fallbackMessage = 'Something went wrong'): FieldErrors {
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
    path: '/'
  })
  const isAuthenticated = computed(() => !!token.value)

  const { apiFetch } = useApi()

  const login = async (credentials: LoginCredentials): Promise<ActionResult> => {
    try {
      const response = await apiFetch<AuthResponse>('/login', {
        method: 'POST',
        body: credentials
      })
      token.value = response.token
      return { success: true }
    } catch (error: unknown) {
      return {
        success: false,
        errors: extractApiErrors(error)
      }
    }
  }

  const register = async (data: RegisterData): Promise<ActionResult> => {
    try {
      const response = await apiFetch<AuthResponse>('/register', {
        method: 'POST',
        body: data
      })
      token.value = response.token
      return { success: true }
    } catch (error: unknown) {
      return {
        success: false,
        errors: extractApiErrors(error)
      }
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await apiFetch('/logout', {
        method: 'POST'
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      token.value = null
      await navigateTo('/login')
    }
  }

  return {
    token,
    isAuthenticated,
    login,
    register,
    logout
  }
}
