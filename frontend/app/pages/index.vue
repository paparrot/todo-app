<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800">Todo List</h1>
        <Button @click="showAddModal = true">Add Task</Button>
      </div>

      <div class="grid gap-4">
        <Card v-for="task in tasks" :key="task.id">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h3 class="text-xl font-semibold text-gray-800">{{ task.title }}</h3>
              <p v-if="task.description" class="text-gray-600 mt-2">{{ task.description }}</p>
              <div class="flex items-center gap-4 mt-4">
                <span class="text-sm text-gray-500">Due: {{ task.due_date }}</span>
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    task.status === 'completed' ? 'bg-success-100 text-success-800' :
                    task.status === 'in_progress' ? 'bg-warning-100 text-warning-800' :
                    'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ task.status }}
                </span>
              </div>
            </div>
            <div class="flex gap-2">
              <IconButton @click="openEditModal(task)">Edit</IconButton>
              <IconButton variant="danger" @click="openDeleteModal(task)">Delete</IconButton>
            </div>
          </div>
        </Card>
      </div>
    </div>

    <!-- Add Modal -->
    <Dialog v-model="showAddModal">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Add New Task</h2>
      <Form @submit="() => {}">
        <Input
          id="add-title"
          label="Title"
          placeholder="Buy milk"
          v-model="addForm.title"
        />
        <Textarea
          id="add-description"
          label="Description"
          placeholder="From store"
          v-model="addForm.description"
        />
        <Input
          id="add-due-date"
          label="Due Date"
          type="date"
          v-model="addForm.due_date"
        />
        <Select
          id="add-status"
          label="Status"
          v-model="addForm.status"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </Select>
        <div class="flex gap-3 mt-6">
          <Button type="button" variant="secondary" @click="showAddModal = false" class="flex-1">Cancel</Button>
          <Button type="submit" class="flex-1">Add Task</Button>
        </div>
      </Form>
    </Dialog>

    <!-- Edit Modal -->
    <Dialog v-model="showEditModal">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Edit Task</h2>
      <Form @submit="() => {}">
        <Input
          id="edit-title"
          label="Title"
          v-model="editForm.title"
        />
        <Textarea
          id="edit-description"
          label="Description"
          v-model="editForm.description"
        />
        <Input
          id="edit-due-date"
          label="Due Date"
          type="date"
          v-model="editForm.due_date"
        />
        <Select
          id="edit-status"
          label="Status"
          v-model="editForm.status"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </Select>
        <div class="flex gap-3 mt-6">
          <Button type="button" variant="secondary" @click="showEditModal = false" class="flex-1">Cancel</Button>
          <Button type="submit" class="flex-1">Save Changes</Button>
        </div>
      </Form>
    </Dialog>

    <!-- Delete Modal -->
    <Dialog v-model="showDeleteModal">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Delete Task</h2>
      <p class="text-gray-600 mb-8">Are you sure you want to delete this task? This action cannot be undone.</p>
      <div class="flex gap-3">
        <Button variant="secondary" @click="showDeleteModal = false" class="flex-1">Cancel</Button>
        <Button variant="danger" class="flex-1">Delete</Button>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

const addForm = ref({
  title: '',
  description: '',
  due_date: '',
  status: 'pending'
})

const editForm = ref({
  id: null,
  title: '',
  description: '',
  due_date: '',
  status: 'pending'
})

const tasks = ref([
  {
    id: 1,
    title: 'Buy milk',
    description: 'From the grocery store',
    due_date: '2026-07-15',
    status: 'pending',
    user_id: 1
  },
  {
    id: 2,
    title: 'Finish project',
    description: 'Complete the todo app',
    due_date: '2026-07-12',
    status: 'in_progress',
    user_id: 1
  }
])

function openEditModal(task) {
  editForm.value = { ...task }
  showEditModal.value = true
}

function openDeleteModal(task) {
  showDeleteModal.value = true
}
</script>
