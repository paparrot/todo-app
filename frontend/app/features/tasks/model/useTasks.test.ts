import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import type { Task, TaskListResponse } from './types'

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    apiFetch: (globalThis as typeof globalThis & { __apiFetch?: ReturnType<typeof vi.fn> }).__apiFetch
  })
}))

function createTaskListResponse(tasks: Task[], currentPage = 1, lastPage = 1): TaskListResponse {
  return {
    data: tasks,
    links: {
      first: null,
      last: null,
      prev: null,
      next: null
    },
    meta: {
      current_page: currentPage,
      from: tasks.length > 0 ? 1 : null,
      last_page: lastPage,
      path: 'http://localhost:8000/api/tasks',
      per_page: 15,
      to: tasks.length > 0 ? tasks.length : null,
      total: tasks.length
    }
  }
}

function makeTask(id: number, overrides: Partial<Task> = {}): Task {
  return {
    id,
    title: `Task ${id}`,
    description: `Description ${id}`,
    due_date: '2026-07-12',
    status: 'pending',
    user_id: 1,
    user_name: 'Jane Doe',
    created_at: `2026-07-12T10:00:${String(id).padStart(2, '0')}.000000Z`,
    updated_at: `2026-07-12T10:00:${String(id).padStart(2, '0')}.000000Z`,
    ...overrides
  }
}

async function importUseTasks() {
  vi.resetModules()
  return import('./useTasks')
}

describe('useTasks', () => {
  beforeEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    ;(globalThis as typeof globalThis & { __apiFetch?: ReturnType<typeof vi.fn> }).__apiFetch = undefined
  })

  it('loads tasks with the current filters', async () => {
    const apiFetch = vi.fn(async (url: string) => {
      expect(url).toBe('/tasks?page=1&per_page=15&sort=updated_at&direction=desc')
      return createTaskListResponse([makeTask(1)], 1, 1)
    })

    ;(globalThis as typeof globalThis & { __apiFetch?: ReturnType<typeof vi.fn> }).__apiFetch = apiFetch

    const { useTasks } = await importUseTasks()
    const { tasks, getTasks, loading, loadingMore, currentPage, lastPage } = useTasks()

    expect(loading.value).toBe(true)
    await getTasks()

    expect(tasks.value).toHaveLength(1)
    expect(tasks.value[0]?.id).toBe(1)
    expect(currentPage.value).toBe(1)
    expect(lastPage.value).toBe(1)
    expect(loading.value).toBe(false)
    expect(loadingMore.value).toBe(false)
  })

  it('reloads tasks when filters change', async () => {
    vi.useFakeTimers()
    const apiFetch = vi.fn(async () => createTaskListResponse([makeTask(1)], 1, 1))

    ;(globalThis as typeof globalThis & { __apiFetch?: ReturnType<typeof vi.fn> }).__apiFetch = apiFetch

    const { useTasks } = await importUseTasks()
    const { searchQuery, tasks } = useTasks()

    searchQuery.value = 'milk'
    await nextTick()
    expect(tasks.value).toEqual([])

    await vi.advanceTimersByTimeAsync(300)
    expect(apiFetch).toHaveBeenCalledWith('/tasks?page=1&per_page=15&search=milk&sort=updated_at&direction=desc')
    expect(tasks.value).toHaveLength(1)
    vi.useRealTimers()
  })

  it('loads the next page when more tasks are available', async () => {
    const firstPage = createTaskListResponse([makeTask(1)], 1, 2)
    const secondPage = createTaskListResponse([makeTask(2)], 2, 2)
    const apiFetch = vi.fn(async (url: string) => {
      if (url === '/tasks?page=1&per_page=15&sort=updated_at&direction=desc') {
        return firstPage
      }

      if (url === '/tasks?page=2&per_page=15&sort=updated_at&direction=desc') {
        return secondPage
      }

      throw new Error(`Unexpected url: ${url}`)
    })

    ;(globalThis as typeof globalThis & { __apiFetch?: ReturnType<typeof vi.fn> }).__apiFetch = apiFetch

    const { useTasks } = await importUseTasks()
    const { getTasks, loadMoreTasks, tasks, currentPage, lastPage } = useTasks()

    await getTasks()
    expect(currentPage.value).toBe(1)
    expect(lastPage.value).toBe(2)

    await loadMoreTasks()
    expect(apiFetch).toHaveBeenCalledWith('/tasks?page=2&per_page=15&sort=updated_at&direction=desc')
    expect(tasks.value).toHaveLength(2)
    expect(currentPage.value).toBe(2)
  })

  it('skips duplicate tasks when loading more pages', async () => {
    const firstPage = createTaskListResponse([makeTask(1)], 1, 2)
    const secondPage = createTaskListResponse([makeTask(1), makeTask(2)], 2, 2)
    const apiFetch = vi.fn(async (url: string) => {
      if (url === '/tasks?page=1&per_page=15&sort=updated_at&direction=desc') {
        return firstPage
      }

      if (url === '/tasks?page=2&per_page=15&sort=updated_at&direction=desc') {
        return secondPage
      }

      throw new Error(`Unexpected url: ${url}`)
    })

    ;(globalThis as typeof globalThis & { __apiFetch?: ReturnType<typeof vi.fn> }).__apiFetch = apiFetch

    const { useTasks } = await importUseTasks()
    const { getTasks, loadMoreTasks, tasks } = useTasks()

    await getTasks()
    await loadMoreTasks()

    expect(tasks.value.map((task: Task) => task.id)).toEqual([1, 2])
  })

  it('does not load more when already loading or at the last page', async () => {
    const apiFetch = vi.fn(async () => createTaskListResponse([makeTask(1)], 1, 1))

    ;(globalThis as typeof globalThis & { __apiFetch?: ReturnType<typeof vi.fn> }).__apiFetch = apiFetch

    const { useTasks } = await importUseTasks()
    const { getTasks, loadMoreTasks, loading, loadingMore } = useTasks()

    await getTasks()
    apiFetch.mockClear()

    loading.value = true
    await loadMoreTasks()
    expect(apiFetch).not.toHaveBeenCalled()

    loading.value = false
    loadingMore.value = true
    await loadMoreTasks()
    expect(apiFetch).not.toHaveBeenCalled()
  })

  it('creates a task in the current order', async () => {
    const apiFetch = vi.fn(async (url: string, options?: { method?: string }) => {
      if (url === '/tasks?page=1&per_page=15&sort=updated_at&direction=desc') {
        return createTaskListResponse([makeTask(1)], 1, 1)
      }

      if (url === '/tasks' && options?.method === 'POST') {
        return { data: makeTask(10) }
      }

      throw new Error(`Unexpected url: ${url}`)
    })

    ;(globalThis as typeof globalThis & { __apiFetch?: ReturnType<typeof vi.fn> }).__apiFetch = apiFetch

    const { useTasks } = await importUseTasks()
    const { getTasks, createTask: createTaskAction, tasks, loading } = useTasks()

    await getTasks()
    apiFetch.mockClear()

    const result = await createTaskAction({
      title: 'New task',
      description: 'A created task',
      due_date: '2026-07-12'
    })

    expect(result).toEqual({ success: true })
    expect(tasks.value.map((task: Task) => task.id)).toEqual([10, 1])
    expect(loading.value).toBe(false)
    expect(apiFetch).toHaveBeenCalledTimes(1)
    expect(apiFetch).toHaveBeenCalledWith('/tasks', {
      method: 'POST',
      body: {
        title: 'New task',
        description: 'A created task',
        due_date: '2026-07-12'
      }
    })
  })

  it('does not add created tasks that do not match current filters', async () => {
    const apiFetch = vi.fn(async (url: string, options?: { method?: string }) => {
      if (url === '/tasks?page=1&per_page=15&status=completed&sort=updated_at&direction=desc') {
        return createTaskListResponse([makeTask(1, { status: 'completed' })], 1, 1)
      }

      if (url === '/tasks' && options?.method === 'POST') {
        return { data: makeTask(10, { status: 'pending' }) }
      }

      throw new Error(`Unexpected url: ${url}`)
    })

    ;(globalThis as typeof globalThis & { __apiFetch?: ReturnType<typeof vi.fn> }).__apiFetch = apiFetch

    const { useTasks } = await importUseTasks()
    const { getTasks, createTask: createTaskAction, tasks, statusFilter } = useTasks()

    statusFilter.value = 'completed'

    await getTasks()
    apiFetch.mockClear()

    const result = await createTaskAction({
      title: 'Hidden task',
      description: 'Does not match the current filter',
      due_date: '2026-07-12'
    })

    expect(result).toEqual({ success: true })
    expect(tasks.value.map((task: Task) => task.id)).toEqual([1])
    expect(apiFetch).toHaveBeenCalledTimes(1)
  })

  it('removes updated tasks that no longer match current filters', async () => {
    const apiFetch = vi.fn(async (url: string, options?: { method?: string }) => {
      if (url === '/tasks?page=1&per_page=15&status=pending&sort=updated_at&direction=desc') {
        return createTaskListResponse([makeTask(1, { status: 'pending' })], 1, 1)
      }

      if (url === '/tasks/1' && options?.method === 'PATCH') {
        return { data: makeTask(1, { status: 'completed' }) }
      }

      throw new Error(`Unexpected url: ${url}`)
    })

    ;(globalThis as typeof globalThis & { __apiFetch?: ReturnType<typeof vi.fn> }).__apiFetch = apiFetch

    const { useTasks } = await importUseTasks()
    const { getTasks, updateTask, tasks, statusFilter } = useTasks()

    statusFilter.value = 'pending'

    await getTasks()
    apiFetch.mockClear()

    const result = await updateTask({
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      due_date: '2026-07-12',
      status: 'completed'
    })

    expect(result).toEqual({ success: true })
    expect(tasks.value).toHaveLength(0)
    expect(apiFetch).toHaveBeenCalledTimes(1)
    expect(apiFetch).toHaveBeenCalledWith('/tasks/1', {
      method: 'PATCH',
      body: {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        due_date: '2026-07-12',
        status: 'completed'
      }
    })
  })

  it('returns validation errors when creating a task fails', async () => {
    const apiFetch = vi.fn(async () => {
      throw {
        data: {
          errors: {
            title: ['The title field is required.']
          }
        }
      }
    })

    ;(globalThis as typeof globalThis & { __apiFetch?: ReturnType<typeof vi.fn> }).__apiFetch = apiFetch

    const { useTasks } = await importUseTasks()
    const { createTask: createTaskAction, errors, loading } = useTasks()

    const result = await createTaskAction({
      title: '',
      description: null,
      due_date: null
    })

    expect(result).toEqual({
      success: false,
      errors: {
        title: ['The title field is required.']
      }
    })
    expect(errors.value).toEqual({
      title: ['The title field is required.']
    })
    expect(loading.value).toBe(false)
  })

  it('updates tasks in place and deletes tasks', async () => {
    const apiFetch = vi.fn(async (url: string, options?: { method?: string }) => {
      if (url === '/tasks?page=1&per_page=15&sort=updated_at&direction=desc') {
        return createTaskListResponse([makeTask(1)], 1, 1)
      }

      if (url === '/tasks/1' && options?.method === 'PATCH') {
        return { data: makeTask(1, { status: 'completed' }) }
      }

      if (url === '/tasks/1' && options?.method === 'DELETE') {
        return null
      }

      throw new Error(`Unexpected url: ${url}`)
    })

    ;(globalThis as typeof globalThis & { __apiFetch?: ReturnType<typeof vi.fn> }).__apiFetch = apiFetch

    const { useTasks } = await importUseTasks()
    const { getTasks, updateTask, deleteTask, tasks } = useTasks()

    await getTasks()
    apiFetch.mockClear()

    const updateResult = await updateTask({
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      due_date: '2026-07-12',
      status: 'completed'
    })

    expect(updateResult).toEqual({ success: true })
    expect(tasks.value).toHaveLength(1)
    expect(tasks.value[0]?.status).toBe('completed')
    expect(apiFetch).toHaveBeenCalledTimes(1)
    expect(apiFetch).toHaveBeenCalledWith('/tasks/1', {
      method: 'PATCH',
      body: {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        due_date: '2026-07-12',
        status: 'completed'
      }
    })

    apiFetch.mockClear()

    const deleteResult = await deleteTask(1)
    expect(deleteResult).toEqual({ success: true })
    expect(tasks.value).toHaveLength(0)
    expect(apiFetch).toHaveBeenCalledTimes(1)
    expect(apiFetch).toHaveBeenCalledWith('/tasks/1', { method: 'DELETE' })
  })

  it('returns validation errors when updating a task fails', async () => {
    const apiFetch = vi.fn(async () => {
      throw {
        data: {
          errors: {
            status: ['The selected status is invalid.']
          }
        }
      }
    })

    ;(globalThis as typeof globalThis & { __apiFetch?: ReturnType<typeof vi.fn> }).__apiFetch = apiFetch

    const { useTasks } = await importUseTasks()
    const { updateTask, errors } = useTasks()

    const result = await updateTask({
      id: 1,
      title: 'Task 1',
      description: null,
      due_date: null,
      status: 'pending'
    })

    expect(result).toEqual({
      success: false,
      errors: {
        status: ['The selected status is invalid.']
      }
    })
    expect(errors.value).toEqual({
      status: ['The selected status is invalid.']
    })
  })
})
