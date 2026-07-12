import type { LocationQuery, LocationQueryValue } from 'vue-router'
import type { SortDirection, TaskSortField, TaskStatus } from './types'

export interface TaskFiltersState {
  searchQuery: string
  statusFilter: TaskStatus | ''
  sortBy: TaskSortField
  sortDirection: SortDirection
}

const DEFAULT_TASK_FILTERS: TaskFiltersState = {
  searchQuery: '',
  statusFilter: '',
  sortBy: 'updated_at',
  sortDirection: 'desc',
}

const VALID_SORT_FIELDS: TaskSortField[] = [
  'updated_at',
  'created_at',
  'due_date',
  'status',
]
const VALID_SORT_DIRECTIONS: SortDirection[] = ['asc', 'desc']
const VALID_STATUSES: Array<TaskStatus> = [
  'pending',
  'in_progress',
  'completed',
]

function firstQueryValue(
  value: LocationQueryValue | LocationQueryValue[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    const firstValue = value[0]
    return typeof firstValue === 'string' ? firstValue : undefined
  }

  return typeof value === 'string' ? value : undefined
}

function isTaskSortField(value: string): value is TaskSortField {
  return VALID_SORT_FIELDS.includes(value as TaskSortField)
}

function isSortDirection(value: string): value is SortDirection {
  return VALID_SORT_DIRECTIONS.includes(value as SortDirection)
}

function isTaskStatus(value: string): value is TaskStatus {
  return VALID_STATUSES.includes(value as TaskStatus)
}

export function getTaskFiltersFromQuery(
  query: LocationQuery,
): Partial<TaskFiltersState> {
  const searchQuery = firstQueryValue(query.search)
  const statusFilter = firstQueryValue(query.status)
  const sortBy = firstQueryValue(query.sort)
  const sortDirection = firstQueryValue(query.direction)
  const filters: Partial<TaskFiltersState> = {}

  if (searchQuery) {
    filters.searchQuery = searchQuery
  }

  if (statusFilter && isTaskStatus(statusFilter)) {
    filters.statusFilter = statusFilter
  }

  if (sortBy && isTaskSortField(sortBy)) {
    filters.sortBy = sortBy
  }

  if (sortDirection && isSortDirection(sortDirection)) {
    filters.sortDirection = sortDirection
  }

  return filters
}

export function createTaskFiltersState(
  filters: Partial<TaskFiltersState> = {},
): TaskFiltersState {
  return {
    ...DEFAULT_TASK_FILTERS,
    ...filters,
  }
}

export function hasTaskFiltersQuery(query: LocationQuery): boolean {
  return Boolean(query.search || query.status || query.sort || query.direction)
}

export function buildTaskFiltersQuery(
  filters: TaskFiltersState,
  baseQuery: LocationQuery = {},
): LocationQuery {
  const nextQuery: LocationQuery = { ...baseQuery }

  if (filters.searchQuery) {
    nextQuery.search = filters.searchQuery
  } else {
    delete nextQuery.search
  }

  if (filters.statusFilter) {
    nextQuery.status = filters.statusFilter
  } else {
    delete nextQuery.status
  }

  nextQuery.sort = filters.sortBy
  nextQuery.direction = filters.sortDirection

  return nextQuery
}

export function serializeTaskFiltersQuery(query: LocationQuery): string {
  const params = new URLSearchParams()

  for (const key of Object.keys(query).sort()) {
    const value = query[key]

    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === 'string') {
          params.append(key, item)
        }
      }

      continue
    }

    if (typeof value === 'string') {
      params.append(key, value)
    }
  }

  return params.toString()
}

export function areTaskFiltersEqual(
  first: TaskFiltersState,
  second: TaskFiltersState,
): boolean {
  return (
    first.searchQuery === second.searchQuery &&
    first.statusFilter === second.statusFilter &&
    first.sortBy === second.sortBy &&
    first.sortDirection === second.sortDirection
  )
}
