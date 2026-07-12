import type { ActionResult } from '~/types/api/common'
import type { FieldErrors } from '~/types/ui'
import { buildTaskQuery, createDebouncedFunction, extractTaskApiErrors } from './helpers'
import type {
  CreateTaskData,
  SortDirection,
  Task,
  TaskListResponse,
  TaskResponse,
  TaskSortField,
  TaskStatus,
  UpdateTaskData
} from './types'

import { ref, watch } from 'vue'
import { useApi } from '~/composables/useApi'

export const useTasks = () => {
  const { apiFetch } = useApi()
  const tasks = ref<Task[]>([])
  const loading = ref<boolean>(true)
  const loadingMore = ref<boolean>(false)
  const errors = ref<FieldErrors>({})
  const searchQuery = ref<string>('')
  const statusFilter = ref<TaskStatus | ''>('')
  const sortBy = ref<TaskSortField>('updated_at')
  const sortDirection = ref<SortDirection>('desc')
  const currentPage = ref<number>(0)
  const lastPage = ref<number>(1)
  const perPage = 15

  const resetTasks = (): void => {
    tasks.value = []
    currentPage.value = 0
    lastPage.value = 1
  }

  const matchesCurrentFilters = (task: Task): boolean => {
    if (statusFilter.value && task.status !== statusFilter.value) {
      return false
    }

    if (!searchQuery.value) {
      return true
    }

    const query = searchQuery.value.toLowerCase()
    const title = task.title.toLowerCase()
    const description = task.description?.toLowerCase() ?? ''

    return title.includes(query) || description.includes(query)
  }

  const prependTask = (task: Task): void => {
    tasks.value = [task, ...tasks.value.filter((existingTask: Task) => existingTask.id !== task.id)]
  }

  const removeTaskFromList = (id: number): void => {
    tasks.value = tasks.value.filter((task: Task) => task.id !== id)
  }

  const appendUniqueTasks = (newTasks: Task[]): void => {
    const existingIds = new Set(tasks.value.map((task: Task) => task.id))
    const uniqueNewTasks = newTasks.filter((task) => !existingIds.has(task.id))

    if (uniqueNewTasks.length === 0) {
      return
    }

    tasks.value = [...tasks.value, ...uniqueNewTasks]
  }

  const fetchTasks = async (page: number, replace = false): Promise<void> => {
    if (replace) {
      loading.value = true
      errors.value = {}
      resetTasks()
    } else {
      loadingMore.value = true
    }

    try {
      const response = await apiFetch<TaskListResponse>(`/tasks?${buildTaskQuery({
        page,
        perPage,
        search: searchQuery.value,
        statusFilter: statusFilter.value,
        sortBy: sortBy.value,
        sortDirection: sortDirection.value
      })}`)
      if (replace) {
        tasks.value = response.data
      } else {
        appendUniqueTasks(response.data)
      }
      currentPage.value = response.meta.current_page
      lastPage.value = response.meta.last_page
    } catch (error: unknown) {
      errors.value = extractTaskApiErrors(error)
    } finally {
      loading.value = false
      loadingMore.value = false
    }
  }

  const getTasks = async (): Promise<void> => {
    await fetchTasks(1, true)
  }

  const loadMoreTasks = async (): Promise<void> => {
    if (loading.value || loadingMore.value || currentPage.value >= lastPage.value) {
      return
    }

    await fetchTasks(currentPage.value + 1)
  }

  const debouncedGetTasks = createDebouncedFunction(getTasks, 300)
  watch([searchQuery, statusFilter, sortBy, sortDirection], () => {
    loading.value = true
    errors.value = {}
    resetTasks()
    debouncedGetTasks()
  })

  const createTask = async (data: CreateTaskData): Promise<ActionResult> => {
    loading.value = true
    errors.value = {}

    try {
      const response = await apiFetch<TaskResponse>('/tasks', {
        method: 'POST',
        body: data
      })

      if (matchesCurrentFilters(response.data)) {
        prependTask(response.data)
      }

      return { success: true }
    } catch (error: unknown) {
      errors.value = extractTaskApiErrors(error)
      return { success: false, errors: errors.value }
    } finally {
      loading.value = false
    }
  }

  const updateTask = async (data: UpdateTaskData): Promise<ActionResult> => {
    loading.value = true
    errors.value = {}

    try {
      const response = await apiFetch<TaskResponse>(`/tasks/${data.id}`, {
        method: 'PATCH',
        body: data
      })

      if (!matchesCurrentFilters(response.data)) {
        removeTaskFromList(response.data.id)
      } else {
        removeTaskFromList(response.data.id)
        prependTask(response.data)
      }

      return { success: true }
    } catch (error: unknown) {
      errors.value = extractTaskApiErrors(error)
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

      removeTaskFromList(id)
      return { success: true }
    } catch (error: unknown) {
      errors.value = extractTaskApiErrors(error)
      return { success: false, errors: errors.value }
    } finally {
      loading.value = false
    }
  }

  return {
    tasks,
    loading,
    loadingMore,
    errors,
    searchQuery,
    statusFilter,
    sortBy,
    sortDirection,
    currentPage,
    lastPage,
    getTasks,
    loadMoreTasks,
    createTask,
    updateTask,
    deleteTask
  }
}
