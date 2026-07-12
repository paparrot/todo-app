import type { ApiResourceResponse, PaginatedResponse } from '~/types/api/common'

export type TaskStatus = 'pending' | 'completed' | 'in_progress'
export type TaskSortField = 'due_date' | 'status'
export type SortDirection = 'asc' | 'desc'

export interface Task {
  id: number
  title: string
  description: string | null
  due_date: string
  status: TaskStatus
  user_id: number
}

export interface CreateTaskData {
  title: string
  description?: string | null
  due_date: string
}

export interface UpdateTaskData {
  id: number
  title: string
  description?: string | null
  due_date: string
  status: TaskStatus
}

export type TaskListResponse = PaginatedResponse<Task>
export type TaskResponse = ApiResourceResponse<Task>
