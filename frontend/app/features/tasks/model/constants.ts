import type { SortDirection, TaskSortField, TaskStatus } from './types'

export const taskStatusClasses: Record<TaskStatus, string> = {
  pending: 'bg-slate-100 text-slate-700',
  in_progress: 'bg-warning-50 text-warning-700',
  completed: 'bg-success-50 text-success-700'
}

export const taskStatusLabels: Record<TaskStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed'
}

export const sortFieldLabels: Record<TaskSortField, string> = {
  updated_at: 'Updated time',
  created_at: 'Created time',
  due_date: 'Due date',
  status: 'Status'
}

export const sortDirectionLabels: Record<SortDirection, string> = {
  asc: 'Ascending',
  desc: 'Descending'
}
