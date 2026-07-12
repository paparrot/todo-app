import { describe, expect, it } from 'vitest'
import { buildTaskFiltersQuery, createTaskFiltersState, getTaskFiltersFromQuery, areTaskFiltersEqual, serializeTaskFiltersQuery } from './queryParams'

describe('task query params', () => {
  it('reads filters from a query string', () => {
    const filters = getTaskFiltersFromQuery({
      search: 'milk',
      status: 'completed',
      sort: 'created_at',
      direction: 'asc'
    })

    expect(createTaskFiltersState(filters)).toEqual({
      searchQuery: 'milk',
      statusFilter: 'completed',
      sortBy: 'created_at',
      sortDirection: 'asc'
    })
  })

  it('ignores invalid query values', () => {
    const filters = createTaskFiltersState(
      getTaskFiltersFromQuery({
        search: ['milk', 'tea'],
        status: 'invalid',
        sort: 'unknown',
        direction: 'sideways'
      })
    )

    expect(filters).toEqual({
      searchQuery: 'milk',
      statusFilter: '',
      sortBy: 'updated_at',
      sortDirection: 'desc'
    })
  })

  it('builds a canonical query from filters while preserving unrelated params', () => {
    const query = buildTaskFiltersQuery(
      {
        searchQuery: 'milk',
        statusFilter: 'pending',
        sortBy: 'updated_at',
        sortDirection: 'desc'
      },
      {
        page: '2',
        token: 'keep-me'
      }
    )

    expect(query).toEqual({
      page: '2',
      token: 'keep-me',
      search: 'milk',
      status: 'pending',
      sort: 'updated_at',
      direction: 'desc'
    })
  })

  it('serializes query params in a stable way', () => {
    expect(
      serializeTaskFiltersQuery({
        direction: 'desc',
        search: 'milk',
        sort: 'updated_at',
        status: 'pending'
      })
    ).toBe('direction=desc&search=milk&sort=updated_at&status=pending')
  })

  it('compares filter states correctly', () => {
    const first = createTaskFiltersState({
      searchQuery: 'milk',
      statusFilter: 'completed',
      sortBy: 'created_at',
      sortDirection: 'asc'
    })
    const second = createTaskFiltersState({
      searchQuery: 'milk',
      statusFilter: 'completed',
      sortBy: 'created_at',
      sortDirection: 'asc'
    })
    const third = createTaskFiltersState({
      searchQuery: 'tea'
    })

    expect(areTaskFiltersEqual(first, second)).toBe(true)
    expect(areTaskFiltersEqual(first, third)).toBe(false)
  })
})
