import { describe, expect, it, vi } from 'vitest'
import {
  buildTaskQuery,
  createDebouncedFunction,
  extractTaskApiErrors,
} from './helpers'

describe('task helpers', () => {
  it('builds a query string with all filters', () => {
    const query = buildTaskQuery({
      page: 2,
      perPage: 15,
      search: 'milk',
      statusFilter: 'in_progress',
      sortBy: 'status',
      sortDirection: 'asc',
    })

    expect(query).toBe(
      'page=2&per_page=15&search=milk&status=in_progress&sort=status&direction=asc',
    )
  })

  it('builds a query string without optional filters', () => {
    const query = buildTaskQuery({
      page: 1,
      perPage: 15,
      search: '',
      statusFilter: '',
      sortBy: 'updated_at',
      sortDirection: 'desc',
    })

    expect(query).toBe('page=1&per_page=15&sort=updated_at&direction=desc')
  })

  it('extracts api validation errors', () => {
    const errors = extractTaskApiErrors({
      data: {
        errors: {
          title: ['The title field is required.'],
        },
      },
    })

    expect(errors).toEqual({
      title: ['The title field is required.'],
    })
  })

  it('falls back to a general error message', () => {
    const errors = extractTaskApiErrors(new Error('boom'))

    expect(errors).toEqual({
      general: ['Something went wrong'],
    })
  })

  it('debounces function calls', () => {
    vi.useFakeTimers()

    const fn = vi.fn()
    const debouncedFn = createDebouncedFunction(fn, 300)

    debouncedFn('first')
    debouncedFn('second')

    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(300)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('second')

    vi.useRealTimers()
  })
})
