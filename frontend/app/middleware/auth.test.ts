import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

vi.mock('~/features/auth/model/useAuth', () => ({
  useAuth: () =>
    (
      globalThis as typeof globalThis & {
        __authState?: { isAuthenticated: { value: boolean } }
      }
    ).__authState,
}))

async function importAuthMiddleware() {
  vi.resetModules()
  return import('./auth')
}

describe('auth middleware', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
    ;(
      globalThis as typeof globalThis & {
        __authState?: { isAuthenticated: { value: boolean } }
      }
    ).__authState = undefined
  })

  it('redirects unauthenticated users to login', async () => {
    const isAuthenticated = ref(false)
    const navigateTo = vi.fn()

    ;(
      globalThis as typeof globalThis & {
        __authState?: { isAuthenticated: { value: boolean } }
      }
    ).__authState = {
      isAuthenticated,
    }
    vi.stubGlobal('navigateTo', navigateTo)

    const middleware = (await importAuthMiddleware()).default
    expect(middleware({} as never, {} as never)).toBeUndefined()
    expect(navigateTo).toHaveBeenCalledWith('/login')
  })

  it('allows authenticated users to continue', async () => {
    const isAuthenticated = ref(true)
    const navigateTo = vi.fn()

    ;(
      globalThis as typeof globalThis & {
        __authState?: { isAuthenticated: { value: boolean } }
      }
    ).__authState = {
      isAuthenticated,
    }
    vi.stubGlobal('navigateTo', navigateTo)

    const middleware = (await importAuthMiddleware()).default
    expect(middleware({} as never, {} as never)).toBeUndefined()
    expect(navigateTo).not.toHaveBeenCalled()
  })
})
