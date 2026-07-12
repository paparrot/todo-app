import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

async function importAuthMiddleware() {
  vi.resetModules()
  return import('./auth')
}

describe('auth middleware', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  it('redirects unauthenticated users to login', async () => {
    const isAuthenticated = ref(false)
    const navigateTo = vi.fn()

    vi.stubGlobal('useAuth', () => ({ isAuthenticated }))
    vi.stubGlobal('navigateTo', navigateTo)

    const middleware = (await importAuthMiddleware()).default
    expect(middleware()).toBeUndefined()
    expect(navigateTo).toHaveBeenCalledWith('/login')
  })

  it('allows authenticated users to continue', async () => {
    const isAuthenticated = ref(true)
    const navigateTo = vi.fn()

    vi.stubGlobal('useAuth', () => ({ isAuthenticated }))
    vi.stubGlobal('navigateTo', navigateTo)

    const middleware = (await importAuthMiddleware()).default
    expect(middleware()).toBeUndefined()
    expect(navigateTo).not.toHaveBeenCalled()
  })
})
