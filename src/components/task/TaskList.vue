<template>
  <div class="space-y-4">
    <!-- Loading State -->
    <div v-if="taskStore.loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="taskStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-800">{{ taskStore.error }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="taskStore.tasks.length === 0" class="text-center py-12">
      <p class="text-gray-500">No tasks found</p>
    </div>

    <!-- Tasks List -->
    <div v-else class="grid gap-4">
      <div
        v-for="task in taskStore.tasks"
        :key="task.id"
        class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start mb-3">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900">{{ task.title }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ task.description }}</p>
          </div>
          <span
            :class="getStatusClass(task.status)"
            class="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4"
          >
            {{ task.status }}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
          <div>
            <span class="font-medium">Assigned to:</span>
            <span class="text-gray-900">{{ task.assignedTo }}</span>
          </div>
          <div>
            <span class="font-medium">Created:</span>
            <span class="text-gray-900">{{ formatDate(task.createdAt) }}</span>
          </div>
          <div>
            <span class="font-medium">Due:</span>
            <span :class="isDueSoon(task.dueDate) ? 'text-red-600 font-semibold' : 'text-gray-900'">
              {{ formatDate(task.dueDate) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTaskStore } from '../../stores/task.js'

const taskStore = useTaskStore()

const getStatusClass = (status) => {
  const classes = {
    'Open': 'bg-blue-100 text-blue-800',
    'InProgress': 'bg-yellow-100 text-yellow-800',
    'Completed': 'bg-green-100 text-green-800',
    'Blocked': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const isDueSoon = (dueDate) => {
  const due = new Date(dueDate)
  const now = new Date()
  const daysDiff = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
  return daysDiff <= 3 && daysDiff >= 0
}
</script>
