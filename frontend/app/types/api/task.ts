export type TaskStatus = 'pending' | 'completed' | 'in_progress'
export type TaskSortField = 'title' | 'due_date' | 'status' | 'created_at' | 'updated_at'
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
  status: TaskStatus
}

export interface UpdateTaskData extends CreateTaskData {
  id: number
}
