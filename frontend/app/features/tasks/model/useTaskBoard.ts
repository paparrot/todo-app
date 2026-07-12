import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter, useFormatDate, useInfiniteScroll } from '#imports'
import { useAuth } from '~/features/auth/model/useAuth'
import { useTasks } from '~/features/tasks/model/useTasks'
import { useTaskDialog } from '~/features/tasks/model/useTaskDialog'
import {
  areTaskFiltersEqual,
  buildTaskFiltersQuery,
  createTaskFiltersState,
  getTaskFiltersFromQuery,
  serializeTaskFiltersQuery,
  type TaskFiltersState
} from './queryParams'
import { sortDirectionLabels, sortFieldLabels, taskStatusClasses, taskStatusLabels } from './constants'
import type { CreateTaskData, Task, TaskStatus, UpdateTaskData } from './types'
import type { FieldErrors } from '~/types/ui'

export const useTaskBoard = () => {
  const route = useRoute()
  const router = useRouter()
  const initialFilters = createTaskFiltersState(getTaskFiltersFromQuery(route.query))
  const { currentUser } = useAuth()
  const { tasks, loading: tasksLoading, loadingMore, errors, searchQuery, statusFilter, sortBy, sortDirection, currentPage, lastPage, getTasks, loadMoreTasks, createTask, updateTask, deleteTask } = useTasks(initialFilters)
  const { isAddTaskDialogOpen: showAddModal, openAddTaskDialog, closeAddTaskDialog } = useTaskDialog()
  const { formatDate } = useFormatDate()

  const showEditModal = ref<boolean>(false)
  const showDeleteModal = ref<boolean>(false)
  const taskToDelete = ref<number | null>(null)
  const taskToEdit = ref<Task | null>(null)
  const addErrors = ref<FieldErrors>({})
  const editErrors = ref<FieldErrors>({})
  const isApplyingRouteFilters = ref<boolean>(false)
  const isUpdatingRouteQuery = ref<boolean>(false)

  const canCreateTask = computed(() => currentUser.value?.role === 'owner')

  const getCurrentFilters = (): TaskFiltersState => ({
    searchQuery: searchQuery.value,
    statusFilter: statusFilter.value,
    sortBy: sortBy.value,
    sortDirection: sortDirection.value
  })

  const applyRouteFilters = async (): Promise<void> => {
    const nextFilters = createTaskFiltersState(getTaskFiltersFromQuery(route.query))

    if (areTaskFiltersEqual(getCurrentFilters(), nextFilters)) {
      return
    }

    isApplyingRouteFilters.value = true
    searchQuery.value = nextFilters.searchQuery
    statusFilter.value = nextFilters.statusFilter
    sortBy.value = nextFilters.sortBy
    sortDirection.value = nextFilters.sortDirection
    await nextTick()
    isApplyingRouteFilters.value = false
  }

  const syncRouteQuery = async (): Promise<void> => {
    const nextQuery = buildTaskFiltersQuery(getCurrentFilters(), route.query)

    if (serializeTaskFiltersQuery(route.query) === serializeTaskFiltersQuery(nextQuery)) {
      return
    }

    isUpdatingRouteQuery.value = true

    try {
      await router.replace({ query: nextQuery })
    } finally {
      isUpdatingRouteQuery.value = false
    }
  }

  const openEditModal = (task: Task): void => {
    taskToEdit.value = task
    editErrors.value = {}
    showEditModal.value = true
  }

  const openDeleteModal = (task: Task): void => {
    taskToDelete.value = task.id
    showDeleteModal.value = true
  }

  const handleAddTask = async (data: CreateTaskData): Promise<void> => {
    addErrors.value = {}
    const result = await createTask(data)
    if (result.success) {
      closeAddTaskDialog()
    } else {
      addErrors.value = result.errors || {}
    }
  }

  const handleUpdateTask = async (data: UpdateTaskData): Promise<void> => {
    editErrors.value = {}
    const result = await updateTask(data)
    if (result.success) {
      showEditModal.value = false
      taskToEdit.value = null
    } else {
      editErrors.value = result.errors || {}
    }
  }

  const handleSetTaskStatus = async (task: Task, status: TaskStatus): Promise<void> => {
    await updateTask({
      id: task.id,
      title: task.title,
      description: task.description,
      due_date: task.due_date,
      status
    })
  }

  const handleTaskStatus = (task: Task, status: TaskStatus): void => {
    void handleSetTaskStatus(task, status)
  }

  watch(showEditModal, (open: boolean) => {
    if (!open) {
      taskToEdit.value = null
    }
  })

  watch([searchQuery, statusFilter, sortBy, sortDirection], () => {
    if (isApplyingRouteFilters.value) {
      return
    }

    void syncRouteQuery()
  })

  watch(
    () => [route.query.search, route.query.status, route.query.sort, route.query.direction],
    () => {
      if (isUpdatingRouteQuery.value) {
        return
      }

      void applyRouteFilters()
    }
  )

  const handleDeleteTask = async (): Promise<void> => {
    if (taskToDelete.value) {
      const result = await deleteTask(taskToDelete.value)
      if (result.success) {
        showDeleteModal.value = false
        taskToDelete.value = null
      }
    }
  }

  const { trigger: loadMoreTrigger } = useInfiniteScroll({
    canLoadMore: () => tasks.value.length > 0 && currentPage.value < lastPage.value,
    isLoading: () => tasksLoading.value || loadingMore.value,
    onLoadMore: loadMoreTasks
  })

  onMounted(() => {
    void syncRouteQuery()
    void getTasks()
  })

  return {
    tasks,
    tasksLoading,
    loadingMore,
    errors,
    searchQuery,
    statusFilter,
    sortBy,
    sortDirection,
    currentPage,
    lastPage,
    loadMoreTrigger,
    formatDate,
    canCreateTask,
    showAddModal,
    openAddTaskDialog,
    showEditModal,
    showDeleteModal,
    taskToDelete,
    taskToEdit,
    addErrors,
    editErrors,
    taskStatusClasses,
    taskStatusLabels,
    sortFieldLabels,
    sortDirectionLabels,
    openEditModal,
    openDeleteModal,
    handleAddTask,
    handleUpdateTask,
    handleTaskStatus,
    handleDeleteTask,
  }
}
