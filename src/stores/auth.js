import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { jwtDecode } from 'jwt-decode'
import { getAuthApi } from '../utils/api.js'
import { useTenantConfigStore } from './tenantConfig.js'

export const useAuthStore = defineStore('auth', () => {
  // State
  const isAuthenticated = ref(false)
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)

  // Getters
  const userRole = computed(() => user.value?.role || '')
  const isAdmin = computed(() => userRole.value === 'Admin')

  // Actions
  const login = async (credentials) => {
    loading.value = true

    try {
      const tenantConfigStore = useTenantConfigStore()

      // Use already loaded tenant config (should be loaded at app startup)
      // Don't reload tenant config during login
      if (!tenantConfigStore.initialized) {
        throw new Error('Tenant configuration not loaded. Please refresh the page.')
      }

      const authApi = await getAuthApi()
      const loginRequest = {
        ...credentials,
        tenantName: tenantConfigStore.config.tenantName
      }

      const response = await authApi.post('/api/Auth/token', loginRequest)

      if (response.success) {
        token.value = response.token
        user.value = response.user
        isAuthenticated.value = true

        // Store in localStorage for persistence
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('user_info', JSON.stringify(response.user))
      }

      return response
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    isAuthenticated.value = false
    user.value = null
    token.value = null
    
    // Clear localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_info')
  }

  const restoreSession = () => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('user_info')

    if (savedToken && savedUser) {
      try {
        // Check if token is expired
        const decoded = jwtDecode(savedToken)
        const now = Date.now() / 1000
        
        if (decoded.exp > now) {
          token.value = savedToken
          user.value = JSON.parse(savedUser)
          isAuthenticated.value = true
        } else {
          // Token expired, clear storage
          logout()
        }
      } catch (error) {
        console.error('Token validation error:', error)
        logout()
      }
    }
  }

  return {
    // State
    isAuthenticated,
    user,
    token,
    loading,
    // Getters
    userRole,
    isAdmin,
    // Actions
    login,
    logout,
    restoreSession
  }
})