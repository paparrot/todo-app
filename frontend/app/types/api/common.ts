import type { FieldErrors } from '../ui'

export interface ApiErrorResponse {
  message?: string
  errors?: FieldErrors
}

export interface ActionResult {
  success: boolean
  errors?: FieldErrors
}

export interface ApiListLinks {
  first: string | null
  last: string | null
  prev: string | null
  next: string | null
}

export interface ApiPaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  path: string
  per_page: number
  to: number | null
  total: number
}

export interface PaginatedResponse<T> {
  data: T[]
  links: ApiListLinks
  meta: ApiPaginationMeta
}

export interface ApiResourceResponse<T> {
  data: T
}
