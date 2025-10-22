import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getTenantConfig, setTenantStyling } from '../utils/tenant-config.js'
import { resetApiClients } from '../utils/api.js'

export const useTenantConfigStore = defineStore('tenantConfig', () => {
  // State
  const config = ref({
    tenantId: null,
    tenantName: '',
    displayName: 'Loading...',
    logoUrl: '',
    primaryColor: '#dc2626',
    serviceName: '',
    isActive: false,
    isHealthy: false,
    primaryRegion: '',
    currentVersion: '',
    customHeaders: {},
    createdAt: null,
    environment: 'local',
    authApiUrl: '',
    apiBaseUrl: ''
  })

  const loading = ref(false)
  const error = ref(null)
  const initialized = ref(false)

  // Actions
  const loadTenantConfig = async () => {
    if (initialized.value) {
      return config.value
    }

    loading.value = true
    error.value = null

    try {
      const tenantConfig = await getTenantConfig()
      config.value = { ...config.value, ...tenantConfig }

      // Reset API clients so they use new tenant URLs
      resetApiClients()

      // Apply tenant styling
      setTenantStyling(config.value)

      initialized.value = true

      return config.value
    } catch (err) {
      error.value = err.message || 'Failed to load tenant configuration'

      // For critical errors (unknown tenant, API failures in production)
      // Don't set initialized to true, so retries are possible
      if (err.message.includes('not found') || err.message.includes('Unknown tenant')) {
        // This is a critical error - don't allow the app to continue normally
        throw err
      }

      // For other errors, use fallback acme configuration
      // Detect if we're in local or deployed environment
      const hostname = window.location.hostname
      const isLocal = hostname === 'localhost' || hostname === '127.0.0.1'

      let apiGatewayUrl
      if (process.env.VUE_APP_API_GATEWAY_URL) {
        apiGatewayUrl = process.env.VUE_APP_API_GATEWAY_URL
      } else if (isLocal) {
        apiGatewayUrl = 'http://localhost:5008'
      } else {
        apiGatewayUrl = 'http://api.k8s.demodeck.xyz'
      }

      config.value = {
        ...config.value,
        tenantName: 'acme',
        displayName: 'Acme Corporation',
        primaryColor: '#dc2626',
        logoUrl: '/logos/acme-logo.png',
        environment: 'fallback',
        authApiUrl: `${apiGatewayUrl}/auth`,
        apiBaseUrl: `${apiGatewayUrl}/product`
      }

      setTenantStyling(config.value)
      initialized.value = true

      return config.value
    } finally {
      loading.value = false
    }
  }

  const updateConfig = (newConfig) => {
    config.value = { ...config.value, ...newConfig }
    setTenantStyling(config.value)
  }

  const reset = () => {
    config.value = {
      tenantId: null,
      tenantName: '',
      displayName: 'Loading...',
      logoUrl: '',
      primaryColor: '#dc2626',
      serviceName: '',
      isActive: false,
      isHealthy: false,
      primaryRegion: '',
      currentVersion: '',
      customHeaders: {},
      createdAt: null,
      environment: 'local'
    }
    loading.value = false
    error.value = null
    initialized.value = false
  }

  return {
    // State
    config,
    loading,
    error,
    initialized,
    // Actions
    loadTenantConfig,
    updateConfig,
    reset
  }
})