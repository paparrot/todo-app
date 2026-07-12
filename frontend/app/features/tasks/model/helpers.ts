import type { ApiErrorResponse } from '../../../types/api/common'
import type { FieldErrors } from '../../../types/ui'
import type { SortDirection, TaskSortField, TaskStatus } from './types'

export function createDebouncedFunction<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      void func(...args)
    }, wait)
  }
}

export function buildTaskQuery(params: {
  page: number
  perPage: number
  search: string
  statusFilter: TaskStatus | ''
  sortBy: TaskSortField
  sortDirection: SortDirection
}): string {
  const searchParams = new URLSearchParams()

  searchParams.append('page', String(params.page))
  searchParams.append('per_page', String(params.perPage))

  if (params.search) {
    searchParams.append('search', params.search)
  }

  if (params.statusFilter) {
    searchParams.append('status', params.statusFilter)
  }

  searchParams.append('sort', params.sortBy)
  searchParams.append('direction', params.sortDirection)

  return searchParams.toString()
}

export function extractTaskApiErrors(error: unknown, fallbackMessage = 'Something went wrong'): FieldErrors {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const apiError = (error as { data?: ApiErrorResponse }).data

    if (apiError?.errors) {
      return apiError.errors
    }
  }

  return { general: [fallbackMessage] }
}
