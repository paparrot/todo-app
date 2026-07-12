<template>
  <div class="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
    <div
      class="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-soft lg:flex-row lg:items-center lg:justify-between"
    >
      <div>
        <p
          class="text-sm font-medium uppercase tracking-[0.2em] text-primary-600"
        >
          Workspace
        </p>
        <h1 class="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
          Todo List
        </h1>
        <p class="mt-2 text-sm text-slate-600">
          Track work in a clean, focused view.
        </p>
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
      <TaskEmptyState
        :can-create-task="canCreateTask"
        @add-task="openAddTaskDialog"
      />
    </div>

    <div
      v-if="errors.general?.length"
      class="mb-6 rounded-2xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700"
    >
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
        <div
          v-if="loadingMore"
          class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-soft"
        >
          Loading more tasks...
        </div>
        <p v-else-if="currentPage >= lastPage" class="text-sm text-slate-500">
          You have reached the end.
        </p>
      </div>
    </div>
  </div>

  <TaskCreateDialog
    v-if="canCreateTask"
    v-model="showAddModal"
    :loading="tasksLoading"
    :errors="addErrors"
    @submit="handleAddTask"
  />

  <TaskEditDialog
    v-model="showEditModal"
    :task="taskToEdit"
    :loading="tasksLoading"
    :errors="editErrors"
    @submit="handleUpdateTask"
  />

  <TaskDeleteDialog
    v-model="showDeleteModal"
    :loading="tasksLoading"
    @confirm="handleDeleteTask"
  />
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useTaskBoard } from '../model/useTaskBoard'
import TaskBoardSkeleton from './components/TaskBoardSkeleton.vue'
import TaskCard from './components/TaskCard.vue'
import TaskCreateDialog from './components/TaskCreateDialog.vue'
import TaskDeleteDialog from './components/TaskDeleteDialog.vue'
import TaskEditDialog from './components/TaskEditDialog.vue'
import TaskEmptyState from './components/TaskEmptyState.vue'
import TaskFiltersPanel from './components/TaskFiltersPanel.vue'

const {
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
} = useTaskBoard()
</script>
