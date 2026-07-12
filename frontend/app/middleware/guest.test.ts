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

async function importGuestMiddleware() {
  vi.resetModules()
  return import('./guest')
}

describe('guest middleware', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
    ;(
      globalThis as typeof globalThis & {
        __authState?: { isAuthenticated: { value: boolean } }
      }
    ).__authState = undefined
  })

  it('redirects authenticated users to home', async () => {
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

    const middleware = (await importGuestMiddleware()).default
    expect(middleware({} as never, {} as never)).toBeUndefined()
    expect(navigateTo).toHaveBeenCalledWith('/')
  })

  it('allows guests to continue', async () => {
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

    const middleware = (await importGuestMiddleware()).default
    expect(middleware({} as never, {} as never)).toBeUndefined()
    expect(navigateTo).not.toHaveBeenCalled()
  })
})
