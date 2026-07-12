import type { ApiResourceResponse, PaginatedResponse } from '~/types/api/common'

export type TaskStatus = 'pending' | 'completed' | 'in_progress'
export type TaskSortField = 'updated_at' | 'created_at' | 'due_date' | 'status'
export type SortDirection = 'asc' | 'desc'

export interface Task {
  id: number
  title: string
  description: string | null
  due_date: string | null
  status: TaskStatus
  user_id: number
  user_name: string | null
  created_at: string
  updated_at: string
}

export interface CreateTaskData {
  title: string
  description?: string | null
  due_date: string | null
}

export interface UpdateTaskData {
  id: number
  title: string
  description?: string | null
  due_date: string | null
  status: TaskStatus
}

export type TaskListResponse = PaginatedResponse<Task>
export type TaskResponse = ApiResourceResponse<Task>
