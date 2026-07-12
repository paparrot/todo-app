import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import type { AuthResponse, AuthUser, LoginCredentials, RegisterData } from '~/types/api'

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    apiFetch: (globalThis as typeof globalThis & { __apiFetch?: ReturnType<typeof vi.fn> }).__apiFetch
  })
}))

function createApiFetchMock() {
  return vi.fn(async (url: string, options?: { method?: string }) => {
    if (url === '/user') {
      return {
        id: '1',
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'owner'
      } satisfies AuthUser
    }

    if (url === '/login' && options?.method === 'POST') {
      return {
        token: 'token-123',
        user: {
          id: '1',
          name: 'Jane Doe',
          email: 'jane@example.com',
          role: 'owner'
        }
      } satisfies AuthResponse
    }

    if (url === '/register' && options?.method === 'POST') {
      return {
        token: 'token-456',
        user: {
          id: '2',
          name: 'John Smith',
          email: 'john@example.com',
          role: 'admin'
        }
      } satisfies AuthResponse
    }

    if (url === '/logout' && options?.method === 'POST') {
      return null
    }

    throw new Error(`Unexpected request: ${url}`)
  })
}

async function importUseAuth() {
  vi.resetModules()
  return import('./useAuth')
}

describe('useAuth', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
    ;(globalThis as typeof globalThis & { __apiFetch?: ReturnType<typeof vi.fn> }).__apiFetch = undefined
  })

  it('logs in and stores token and user', async () => {
    const apiFetch = createApiFetchMock()
    const token = ref<string | null>(null)
    const currentUser = ref<AuthUser | null>(null)
    const navigateTo = vi.fn()

    ;(globalThis as typeof globalThis & { __apiFetch?: ReturnType<typeof vi.fn> }).__apiFetch = apiFetch
    vi.stubGlobal('useCookie', () => token)
    vi.stubGlobal('useState', () => currentUser)
    vi.stubGlobal('navigateTo', navigateTo)

    const { useAuth } = await importUseAuth()
    const { login } = useAuth()

    const credentials: LoginCredentials = {
      email: 'jane@example.com',
      password: 'secret'
    }

    await expect(login(credentials)).resolves.toEqual({ success: true })
    expect(apiFetch).toHaveBeenCalledWith('/login', {
      method: 'POST',
      body: credentials
    })
    expect(token.value).toBe('token-123')
    expect(currentUser.value).toEqual({
      id: '1',
      name: 'Jane Doe',
      email: 'jane@example.com',
      role: 'owner'
    })
    expect(navigateTo).not.toHaveBeenCalled()
  })

  it('returns validation errors on login failure', async () => {
    const apiFetch = vi.fn(async () => {
      throw {
        data: {
          errors: {
            email: ['The email field is required.']
          }
        }
      }
    })
    const token = ref<string | null>(null)
    const currentUser = ref<AuthUser | null>(null)

    ;(globalThis as typeof globalThis & { __apiFetch?: ReturnType<typeof vi.fn> }).__apiFetch = apiFetch
    vi.stubGlobal('useCookie', () => token)
    vi.stubGlobal('useState', () => currentUser)
    vi.stubGlobal('navigateTo', vi.fn())

    const { useAuth } = await importUseAuth()
    const { login } = useAuth()

    await expect(login({ email: '', password: '' })).resolves.toEqual({
      success: false,
      errors: {
        email: ['The email field is required.']
      }
    })
    expect(token.value).toBeNull()
    expect(currentUser.value).toBeNull()
  })

  it('fetches the current user and redirects on unauthorized errors', async () => {
    const apiFetch = vi.fn(async () => {
      throw {
        statusCode: 401
      }
    })
    const token = ref<string | null>('token-123')
    const currentUser = ref<AuthUser | null>(null)
    const navigateTo = vi.fn(async () => undefined)

    ;(globalThis as typeof globalThis & { __apiFetch?: ReturnType<typeof vi.fn> }).__apiFetch = apiFetch
    vi.stubGlobal('useCookie', () => token)
    vi.stubGlobal('useState', () => currentUser)
    vi.stubGlobal('navigateTo', navigateTo)

    const { useAuth } = await importUseAuth()
    const { fetchCurrentUser } = useAuth()

    await expect(fetchCurrentUser()).resolves.toBeNull()
    expect(currentUser.value).toBeNull()
    expect(token.value).toBeNull()
    expect(navigateTo).toHaveBeenCalledWith('/login')
  })

  it('registers a user and sets auth state', async () => {
    const apiFetch = createApiFetchMock()
    const token = ref<string | null>(null)
    const currentUser = ref<AuthUser | null>(null)

    ;(globalThis as typeof globalThis & { __apiFetch?: ReturnType<typeof vi.fn> }).__apiFetch = apiFetch
    vi.stubGlobal('useCookie', () => token)
    vi.stubGlobal('useState', () => currentUser)
    vi.stubGlobal('navigateTo', vi.fn())

    const { useAuth } = await importUseAuth()
    const { register } = useAuth()

    const payload: RegisterData = {
      name: 'John Smith',
      email: 'john@example.com',
      password: 'secret'
    }

    await expect(register(payload)).resolves.toEqual({ success: true })
    expect(token.value).toBe('token-456')
    expect(currentUser.value).toEqual({
      id: '2',
      name: 'John Smith',
      email: 'john@example.com',
      role: 'admin'
    })
  })

  it('logs out and clears auth state', async () => {
    const apiFetch = createApiFetchMock()
    const token = ref<string | null>('token-123')
    const currentUser = ref<AuthUser | null>({
      id: '1',
      name: 'Jane Doe',
      email: 'jane@example.com',
      role: 'owner'
    })
    const navigateTo = vi.fn(async () => undefined)

    ;(globalThis as typeof globalThis & { __apiFetch?: ReturnType<typeof vi.fn> }).__apiFetch = apiFetch
    vi.stubGlobal('useCookie', () => token)
    vi.stubGlobal('useState', () => currentUser)
    vi.stubGlobal('navigateTo', navigateTo)

    const { useAuth } = await importUseAuth()
    const { logout } = useAuth()

    await logout()
    expect(apiFetch).toHaveBeenCalledWith('/logout', { method: 'POST' })
    expect(token.value).toBeNull()
    expect(currentUser.value).toBeNull()
    expect(navigateTo).toHaveBeenCalledWith('/login')
  })

  it('exposes authentication state from the token', async () => {
    const token = ref<string | null>('token-123')
    const currentUser = ref<AuthUser | null>(null)

    ;(globalThis as typeof globalThis & { __apiFetch?: ReturnType<typeof vi.fn> }).__apiFetch = vi.fn()
    vi.stubGlobal('useCookie', () => token)
    vi.stubGlobal('useState', () => currentUser)
    vi.stubGlobal('navigateTo', vi.fn())

    const { useAuth } = await importUseAuth()
    const { isAuthenticated } = useAuth()

    expect(isAuthenticated.value).toBe(true)
    token.value = null
    await nextTick()
    expect(isAuthenticated.value).toBe(false)
  })
})
