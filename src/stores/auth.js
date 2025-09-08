import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { jwtDecode } from 'jwt-decode'
import { authApi } from '../utils/api.js'
import { getTenantConfig, getTenantConfigSync } from '../utils/tenant-config.js'

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
      // Try to get full config, fallback to sync config
      let tenantConfig
      try {
        tenantConfig = await getTenantConfig()
      } catch (error) {
        console.warn('Failed to get async tenant config, using sync fallback:', error)
        tenantConfig = getTenantConfigSync()
      }
      
      const loginRequest = {
        ...credentials,
        tenantName: tenantConfig.tenantName
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