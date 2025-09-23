import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getProductApi } from '../utils/api.js'

export const useTenantStore = defineStore('tenant', () => {
  // State
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Actions
  const fetchUsers = async () => {
    loading.value = true
    error.value = null

    try {
      const productApi = await getProductApi()
      const response = await productApi.get('/api/User')

      if (response.success) {
        users.value = response.data
      } else {
        error.value = response.message
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch users'
      console.error('Fetch users error:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    users,
    loading,
    error,
    // Actions
    fetchUsers
  }
})