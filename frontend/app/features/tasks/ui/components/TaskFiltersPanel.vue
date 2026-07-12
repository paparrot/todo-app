<template>
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
      Filter: <span class="font-medium text-slate-700">{{ statusFilter ? props.taskStatusLabels[statusFilter] : 'All statuses' }}</span>
      <span class="mx-1">·</span>
      Sorting by <span class="font-medium text-slate-700">{{ props.sortFieldLabels[sortBy] }}</span>
      <span class="mx-1">·</span>
      <span class="font-medium text-slate-700">{{ props.sortDirectionLabels[sortDirection] }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import type { SortDirection, TaskSortField, TaskStatus } from '../../model/types'

const searchQuery = defineModel<string>('searchQuery', { required: true })
const statusFilter = defineModel<TaskStatus | ''>('statusFilter', { required: true })
const sortBy = defineModel<TaskSortField>('sortBy', { required: true })
const sortDirection = defineModel<SortDirection>('sortDirection', { required: true })

const props = defineProps<{
  taskStatusLabels: Record<TaskStatus, string>
  sortFieldLabels: Record<TaskSortField, string>
  sortDirectionLabels: Record<SortDirection, string>
}>()
</script>
