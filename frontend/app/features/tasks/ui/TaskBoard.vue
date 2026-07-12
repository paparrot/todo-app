<template>
  <div class="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-soft lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p class="text-sm font-medium uppercase tracking-[0.2em] text-primary-600">Workspace</p>
        <h1 class="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Todo List</h1>
        <p class="mt-2 text-sm text-slate-600">Track work in a clean, focused view.</p>
      </div>
      <div v-if="canCreateTask" class="flex gap-3">
        <Button @click="openAddTaskDialog">
          <PlusIcon class="h-4 w-4" />
          Add task
        </Button>
      </div>
    </div>

    <TaskFiltersPanel
      v-model:search-query="searchQuery"
      v-model:status-filter="statusFilter"
      v-model:sort-by="sortBy"
      v-model:sort-direction="sortDirection"
      :task-status-labels="taskStatusLabels"
      :sort-field-labels="sortFieldLabels"
      :sort-direction-labels="sortDirectionLabels"
    />

      <TaskBoardSkeleton v-if="tasksLoading" />

      <div v-else-if="tasks.length === 0" class="mb-6">
        <TaskEmptyState :can-create-task="canCreateTask" @add-task="openAddTaskDialog" />
      </div>

      <div v-if="errors.general?.length" class="mb-6 rounded-2xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
        {{ errors.general[0] }}
      </div>

      <div v-if="tasks.length > 0" class="space-y-6">
        <div class="grid gap-6">
          <TaskCard
            v-for="task in tasks"
            :key="task.id"
            :task="task"
            :disabled="tasksLoading || loadingMore"
            :task-status-labels="taskStatusLabels"
            :task-status-classes="taskStatusClasses"
            :format-date="formatDate"
            @set-status="handleTaskStatus(task, $event)"
            @edit="openEditModal(task)"
            @delete="openDeleteModal(task)"
          />
        </div>

        <div ref="loadMoreTrigger" class="flex items-center justify-center py-6">
          <div v-if="loadingMore" class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-soft">
            Loading more tasks...
          </div>
          <p v-else-if="currentPage >= lastPage" class="text-sm text-slate-500">You have reached the end.</p>
        </div>
      </div>
    </div>

    <Dialog v-if="canCreateTask" v-model="showAddModal">
      <h2 class="mb-6 text-2xl font-semibold tracking-tight text-slate-900">Add New Task</h2>
      <Form @submit="handleAddTask">
        <Input
          id="add-title"
          label="Title *"
          placeholder="Buy milk"
          :required="true"
          :minlength="3"
          v-model="addForm.title"
        />
        <p class="mt-1 text-xs text-slate-500">Required, at least 3 characters.</p>
        <div v-if="addErrors.title" class="mt-1 text-sm text-danger-600">{{ addErrors.title[0] }}</div>
        <Textarea
          id="add-description"
          label="Description"
          placeholder="From store"
          v-model="addForm.description"
        />
        <div v-if="addErrors.description" class="mt-1 text-sm text-danger-600">{{ addErrors.description[0] }}</div>
        <Input
          id="add-due-date"
          label="Due Date"
          type="date"
          v-model="addForm.due_date"
        />
        <div v-if="addErrors.due_date" class="mt-1 text-sm text-danger-600">{{ addErrors.due_date[0] }}</div>
        <div class="mt-6 flex gap-3">
          <Button type="button" variant="secondary" class="flex-1" @click="closeAddTaskDialog">Cancel</Button>
          <Button type="submit" class="flex-1" :disabled="tasksLoading">
            {{ tasksLoading ? 'Adding...' : 'Add task' }}
          </Button>
        </div>
      </Form>
    </Dialog>

    <Dialog v-model="showEditModal">
      <h2 class="mb-6 text-2xl font-semibold tracking-tight text-slate-900">Edit Task</h2>
      <Form @submit="handleUpdateTask">
        <Input
          id="edit-title"
          label="Title *"
          :required="true"
          :minlength="3"
          v-model="editForm.title"
        />
        <p class="mt-1 text-xs text-slate-500">Required, at least 3 characters.</p>
        <div v-if="editErrors.title" class="mt-1 text-sm text-danger-600">{{ editErrors.title[0] }}</div>
        <Textarea
          id="edit-description"
          label="Description"
          v-model="editForm.description"
        />
        <div v-if="editErrors.description" class="mt-1 text-sm text-danger-600">{{ editErrors.description[0] }}</div>
        <Input
          id="edit-due-date"
          label="Due Date"
          type="date"
          v-model="editForm.due_date"
        />
        <div v-if="editErrors.due_date" class="mt-1 text-sm text-danger-600">{{ editErrors.due_date[0] }}</div>
        <Select id="edit-status" label="Status" v-model="editForm.status">
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </Select>
        <div v-if="editErrors.status" class="mt-1 text-sm text-danger-600">{{ editErrors.status[0] }}</div>
        <div class="mt-6 flex gap-3">
          <Button type="button" variant="secondary" class="flex-1" @click="showEditModal = false">Cancel</Button>
          <Button type="submit" class="flex-1" :disabled="tasksLoading">
            {{ tasksLoading ? 'Saving...' : 'Save Changes' }}
          </Button>
        </div>
      </Form>
    </Dialog>

    <Dialog v-model="showDeleteModal">
      <h2 class="mb-4 text-2xl font-semibold tracking-tight text-slate-900">Delete Task</h2>
      <p class="mb-8 text-slate-600">Are you sure you want to delete this task? This action cannot be undone.</p>
      <div class="flex gap-3">
        <Button variant="secondary" class="flex-1" @click="showDeleteModal = false">Cancel</Button>
        <Button variant="danger" class="flex-1" :disabled="tasksLoading" @click="handleDeleteTask">
          {{ tasksLoading ? 'Deleting...' : 'Delete' }}
        </Button>
      </div>
    </Dialog>
</template>

<script setup lang="ts">
import TaskBoardSkeleton from './components/TaskBoardSkeleton.vue'
import TaskCard from './components/TaskCard.vue'
import TaskEmptyState from './components/TaskEmptyState.vue'
import TaskFiltersPanel from './components/TaskFiltersPanel.vue'
import type {
  CreateTaskData,
  SortDirection,
  Task,
  TaskSortField,
  TaskStatus,
  UpdateTaskData
} from '../model/types'
import type { FieldErrors } from '~/types/ui'

const { currentUser } = useAuth()
const { tasks, loading: tasksLoading, loadingMore, errors, searchQuery, statusFilter, sortBy, sortDirection, currentPage, lastPage, getTasks, loadMoreTasks, createTask, updateTask, deleteTask } = useTasks()
const { formatDate } = useFormatDate()
const { isAddTaskDialogOpen: showAddModal, openAddTaskDialog, closeAddTaskDialog } = useTaskDialog()
const canCreateTask = computed(() => currentUser.value?.role === 'owner')
const showEditModal = ref<boolean>(false)
const showDeleteModal = ref<boolean>(false)
const taskToDelete = ref<number | null>(null)
const loadMoreTrigger = ref<HTMLElement | null>(null)
const addErrors = ref<FieldErrors>({})
const editErrors = ref<FieldErrors>({})

const taskStatusClasses: Record<TaskStatus, string> = {
  pending: 'bg-slate-100 text-slate-700',
  in_progress: 'bg-warning-50 text-warning-700',
  completed: 'bg-success-50 text-success-700'
}

const taskStatusLabels: Record<TaskStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed'
}

const sortFieldLabels: Record<TaskSortField, string> = {
  due_date: 'Due date',
  status: 'Status'
}

const sortDirectionLabels: Record<SortDirection, string> = {
  asc: 'Ascending',
  desc: 'Descending'
}

const addForm = ref<CreateTaskData>({
  title: '',
  description: '',
  due_date: null
})

const editForm = ref<UpdateTaskData>({
  id: 0,
  title: '',
  description: '',
  due_date: null,
  status: 'pending'
})

const openEditModal = (task: Task): void => {
  editForm.value = {
    id: task.id,
    title: task.title,
    description: task.description ?? '',
    due_date: task.due_date,
    status: task.status
  }
  editErrors.value = {}
  showEditModal.value = true
}

const openDeleteModal = (task: Task): void => {
  taskToDelete.value = task.id
  showDeleteModal.value = true
}

const handleAddTask = async (): Promise<void> => {
  addErrors.value = {}
  const result = await createTask(addForm.value)
  if (result.success) {
    closeAddTaskDialog()
    addForm.value = {
      title: '',
      description: '',
      due_date: null
    }
  } else {
    addErrors.value = result.errors || {}
  }
}

const handleUpdateTask = async (): Promise<void> => {
  editErrors.value = {}
  const result = await updateTask(editForm.value)
  if (result.success) {
    showEditModal.value = false
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
</script>
