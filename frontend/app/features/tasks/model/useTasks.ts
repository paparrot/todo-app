import type {
  ActionResult,
  ApiErrorResponse,
  ApiResourceResponse,
  CreateTaskData,
  PaginatedResponse,
  SortDirection,
  Task,
  TaskSortField,
  TaskStatus,
  UpdateTaskData
} from '~/types/api'
import type { FieldErrors } from '~/types/ui'

function debounce<T extends (...args: unknown[]) => unknown>(
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

function extractApiErrors(error: unknown): FieldErrors {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const apiError = (error as { data?: ApiErrorResponse }).data
    if (apiError?.errors) {
      return apiError.errors
    }
  }

  return { general: ['Something went wrong'] }
}

export const useTasks = () => {
  const { apiFetch } = useApi()
  const tasks = ref<Task[]>([])
  const loading = ref<boolean>(false)
  const errors = ref<FieldErrors>({})
  const searchQuery = ref<string>('')
  const statusFilter = ref<TaskStatus | ''>('')
  const sortBy = ref<TaskSortField>('created_at')
  const sortDirection = ref<SortDirection>('desc')

  const getTasks = async (): Promise<void> => {
    loading.value = true
    errors.value = {}

    try {
      const params = new URLSearchParams()
      if (searchQuery.value) {
        params.append('search', searchQuery.value)
      }

      if (statusFilter.value) {
        params.append('status', statusFilter.value)
      }

      params.append('sort', sortBy.value)
      params.append('direction', sortDirection.value)

      const query = params.toString()
      const response = await apiFetch<PaginatedResponse<Task>>(
        query ? `/tasks?${query}` : '/tasks'
      )
      tasks.value = response.data
    } catch (error: unknown) {
      errors.value = extractApiErrors(error)
    } finally {
      loading.value = false
    }
  }

  const debouncedGetTasks = debounce(getTasks, 300)
  watch([searchQuery, statusFilter, sortBy, sortDirection], () => {
    debouncedGetTasks()
  })

  const createTask = async (data: CreateTaskData): Promise<ActionResult> => {
    loading.value = true
    errors.value = {}

    try {
      const response = await apiFetch<ApiResourceResponse<Task>>('/tasks', {
        method: 'POST',
        body: data
      })
      tasks.value.push(response.data)
      return { success: true }
    } catch (error: unknown) {
      errors.value = extractApiErrors(error)
      return { success: false, errors: errors.value }
    } finally {
      loading.value = false
    }
  }

  const updateTask = async (data: UpdateTaskData): Promise<ActionResult> => {
    loading.value = true
    errors.value = {}

    try {
      const response = await apiFetch<ApiResourceResponse<Task>>(`/tasks/${data.id}`, {
        method: 'PUT',
        body: data
      })
      const index = tasks.value.findIndex(task => task.id === data.id)
      if (index !== -1) {
        tasks.value[index] = response.data
      }
      return { success: true }
    } catch (error: unknown) {
      errors.value = extractApiErrors(error)
      return { success: false, errors: errors.value }
    } finally {
      loading.value = false
    }
  }

  const deleteTask = async (id: number): Promise<ActionResult> => {
    loading.value = true
    errors.value = {}

    try {
      await apiFetch(`/tasks/${id}`, {
        method: 'DELETE'
      })
      tasks.value = tasks.value.filter(task => task.id !== id)
      return { success: true }
    } catch (error: unknown) {
      errors.value = extractApiErrors(error)
      return { success: false, errors: errors.value }
    } finally {
      loading.value = false
    }
  }

  return {
    tasks,
    loading,
    errors,
    searchQuery,
    statusFilter,
    sortBy,
    sortDirection,
    getTasks,
    createTask,
    updateTask,
    deleteTask
  }
}
