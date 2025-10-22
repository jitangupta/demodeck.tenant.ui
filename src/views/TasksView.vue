<template>
  <div class="min-h-screen bg-gray-50">
    <Header />

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Page Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">
            Tasks
          </h1>
          <p class="mt-2 text-gray-600">
            Manage your tasks for {{ tenantConfigStore.config.displayName }}
          </p>
        </div>

        <!-- Task List -->
        <TaskList />
      </div>
    </main>
  </div>
</template>

<script setup>
import Header from '../components/common/AppHeader.vue'
import TaskList from '../components/task/TaskList.vue'
import { useTaskStore } from '../stores/task.js'
import { useTenantConfigStore } from '../stores/tenantConfig.js'
import { useDocumentTitle } from '../composables/useDocumentTitle.js'
import { onMounted } from 'vue'

const taskStore = useTaskStore()
const tenantConfigStore = useTenantConfigStore()

// Use the document title composable
useDocumentTitle()

onMounted(async () => {
  // Tenant config should already be loaded by main.js
  // Only load if not already initialized (shouldn't happen normally)
  if (!tenantConfigStore.initialized) {
    try {
      await tenantConfigStore.loadTenantConfig()
    } catch (error) {
      // Error is already handled in the store
    }
  }

  // Fetch tasks when component is mounted
  await taskStore.fetchTasks()
})
</script>
