<template>
  <div class="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-soft lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p class="text-sm font-medium uppercase tracking-[0.2em] text-primary-600">Workspace</p>
        <h1 class="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Todo List</h1>
        <p class="mt-2 text-sm text-slate-600">Track work in a clean, focused view.</p>
      </div>
      <div class="flex gap-3">
        <Button @click="showAddModal = true">
          <PlusIcon class="h-4 w-4" />
          Add Task
        </Button>
      </div>
    </div>

      <div class="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div class="grid gap-4 lg:grid-cols-4">
          <div class="lg:col-span-1">
            <Input
              id="search"
              label="Search Tasks"
              placeholder="Search by title..."
              v-model="searchQuery"
            />
          </div>
          <div>
            <Select id="filter-status" label="Status" v-model="statusFilter">
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </Select>
          </div>
          <div>
            <Select id="sort-by" label="Sort by" v-model="sortBy">
              <option value="due_date">Due date</option>
              <option value="status">Status</option>
            </Select>
          </div>
          <div>
            <Select id="sort-direction" label="Direction" v-model="sortDirection">
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </Select>
          </div>
        </div>
        <p class="mt-4 text-sm text-slate-500">
          Filter: <span class="font-medium text-slate-700">{{ statusFilter ? taskStatusLabels[statusFilter] : 'All statuses' }}</span>
          <span class="mx-1">·</span>
          Sorting by <span class="font-medium text-slate-700">{{ sortFieldLabels[sortBy] }}</span>
          <span class="mx-1">·</span>
          <span class="font-medium text-slate-700">{{ sortDirectionLabels[sortDirection] }}</span>
        </p>
      </div>

      <div v-if="tasksLoading" class="flex justify-center py-12">
        <p class="text-slate-600">Loading tasks...</p>
      </div>

      <div v-if="errors.general?.length" class="mb-6 rounded-2xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
        {{ errors.general[0] }}
      </div>

      <div class="grid gap-6">
        <Card v-for="task in tasks" :key="task.id">
          <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div class="flex-1">
              <div :class="['inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.18em]', taskStatusClasses[task.status]]">
                {{ taskStatusLabels[task.status] }}
              </div>
              <h3 class="mt-2 text-xl font-semibold text-slate-900">{{ task.title }}</h3>
              <p v-if="task.description" class="mt-2 text-slate-600">{{ task.description }}</p>
              <div class="mt-4 flex flex-wrap items-center gap-4">
                <span class="text-sm text-slate-500">Due: {{ formatDate(task.due_date) }}</span>
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <Button
                v-if="task.status === 'pending'"
                size="sm"
                type="button"
                variant="secondary"
                :disabled="tasksLoading"
                @click="handleSetTaskStatus(task, 'in_progress')"
              >
                <PlayIcon class="h-3.5 w-3.5" />
                Start
              </Button>
              <Button
                v-else-if="task.status === 'in_progress'"
                size="sm"
                type="button"
                :disabled="tasksLoading"
                @click="handleSetTaskStatus(task, 'completed')"
              >
                <CheckIcon class="h-3.5 w-3.5" />
                Complete
              </Button>
              <IconButton aria-label="Edit task" :disabled="tasksLoading" @click="openEditModal(task)">
                <PencilIcon class="h-4 w-4" />
              </IconButton>
              <IconButton aria-label="Delete task" variant="danger" :disabled="tasksLoading" @click="openDeleteModal(task)">
                <TrashIcon class="h-4 w-4" />
              </IconButton>
            </div>
          </div>
        </Card>
      </div>
    </div>

    <Dialog v-model="showAddModal">
      <h2 class="mb-6 text-2xl font-semibold tracking-tight text-slate-900">Add New Task</h2>
      <Form @submit="handleAddTask">
        <Input
          id="add-title"
          label="Title"
          placeholder="Buy milk"
          v-model="addForm.title"
        />
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
          <Button type="button" variant="secondary" class="flex-1" @click="showAddModal = false">Cancel</Button>
          <Button type="submit" class="flex-1" :disabled="tasksLoading">
            {{ tasksLoading ? 'Adding...' : 'Add Task' }}
          </Button>
        </div>
      </Form>
    </Dialog>

    <Dialog v-model="showEditModal">
      <h2 class="mb-6 text-2xl font-semibold tracking-tight text-slate-900">Edit Task</h2>
      <Form @submit="handleUpdateTask">
        <Input
          id="edit-title"
          label="Title"
          v-model="editForm.title"
        />
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
import { CheckIcon, PencilIcon, PlayIcon, PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import type {
  CreateTaskData,
  SortDirection,
  Task,
  TaskSortField,
  TaskStatus,
  UpdateTaskData
} from '../model/types'
import type { FieldErrors } from '~/types/ui'

const { tasks, loading: tasksLoading, errors, searchQuery, statusFilter, sortBy, sortDirection, getTasks, createTask, updateTask, deleteTask } = useTasks()
const { formatDate } = useFormatDate()
const showAddModal = ref<boolean>(false)
const showEditModal = ref<boolean>(false)
const showDeleteModal = ref<boolean>(false)
const taskToDelete = ref<number | null>(null)
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
    showAddModal.value = false
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

const handleDeleteTask = async (): Promise<void> => {
  if (taskToDelete.value) {
    const result = await deleteTask(taskToDelete.value)
    if (result.success) {
      showDeleteModal.value = false
      taskToDelete.value = null
    }
  }
}

onMounted(() => {
  void getTasks()
})
</script>
