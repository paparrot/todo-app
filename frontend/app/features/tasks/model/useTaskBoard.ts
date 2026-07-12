import type { FieldErrors } from '~/types/ui'
import { sortDirectionLabels, sortFieldLabels, taskStatusClasses, taskStatusLabels } from './constants'
import type { CreateTaskData, Task, TaskStatus, UpdateTaskData } from './types'

export const useTaskBoard = () => {
  const { currentUser } = useAuth()
  const { tasks, loading: tasksLoading, loadingMore, errors, searchQuery, statusFilter, sortBy, sortDirection, currentPage, lastPage, getTasks, loadMoreTasks, createTask, updateTask, deleteTask } = useTasks()
  const { isAddTaskDialogOpen: showAddModal, openAddTaskDialog, closeAddTaskDialog } = useTaskDialog()
  const { formatDate } = useFormatDate()

  const showEditModal = ref<boolean>(false)
  const showDeleteModal = ref<boolean>(false)
  const taskToDelete = ref<number | null>(null)
  const taskToEdit = ref<Task | null>(null)
  const loadMoreTrigger = ref<HTMLElement | null>(null)
  const addErrors = ref<FieldErrors>({})
  const editErrors = ref<FieldErrors>({})

  const canCreateTask = computed(() => currentUser.value?.role === 'owner')



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

  const handleDeleteTask = async (): Promise<void> => {
    if (taskToDelete.value) {
      const result = await deleteTask(taskToDelete.value)
      if (result.success) {
        showDeleteModal.value = false
        taskToDelete.value = null
      }
    }
  }

  watchEffect((onCleanup: (cleanup: () => void) => void) => {
    if (!loadMoreTrigger.value || tasksLoading.value || loadingMore.value || tasks.value.length === 0 || currentPage.value >= lastPage.value) {
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        void loadMoreTasks()
      }
    }, {
      rootMargin: '200px 0px'
    })

    observer.observe(loadMoreTrigger.value)

    onCleanup(() => {
      observer.disconnect()
    })
  })

  onMounted(() => {
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
