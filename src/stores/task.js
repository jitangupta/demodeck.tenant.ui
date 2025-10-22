import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getProductApi } from '../utils/api.js'

export const useTaskStore = defineStore('task', () => {
  // State
  const tasks = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Actions
  const fetchTasks = async () => {
    loading.value = true
    error.value = null

    try {
      const productApi = await getProductApi()
      const response = await productApi.get('/api/Task')

      if (response.success) {
        tasks.value = response.data
      } else {
        error.value = response.message
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch tasks'
      console.error('Fetch tasks error:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    tasks,
    loading,
    error,
    // Actions
    fetchTasks
  }
})
