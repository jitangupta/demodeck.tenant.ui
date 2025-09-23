import axios from 'axios'
import { useTenantConfigStore } from '../stores/tenantConfig.js'

class ApiClient {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor to handle auth errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user_info')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  async get(url, config) {
    const response = await this.client.get(url, config)
    return response.data
  }

  async post(url, data, config) {
    const response = await this.client.post(url, data, config)
    return response.data
  }
}

// API clients for different services
const createApiClients = async () => {
  const tenantConfigStore = useTenantConfigStore()

  // Use already loaded tenant config
  if (!tenantConfigStore.initialized) {
    throw new Error('Tenant configuration not loaded. Cannot create API clients.')
  }

  const config = tenantConfigStore.config

  return {
    authApi: new ApiClient(config.authApiUrl),
    productApi: new ApiClient(`${config.apiBaseUrl}/${config.tenantName}`)
  }
}

// Initialize API clients asynchronously
let apiClients = null
let initPromise = null

const initializeApiClients = async () => {
  if (!initPromise) {
    initPromise = createApiClients()
  }
  if (!apiClients) {
    apiClients = await initPromise
  }
  return apiClients
}

// Reset API clients when tenant config changes
export const resetApiClients = () => {
  apiClients = null
  initPromise = null
  console.log('🔄 API clients reset - will reinitialize with new tenant config')
}

export const getApiClients = async () => {
  return await initializeApiClients()
}

// Legacy exports for backward compatibility - these will be async
export const getAuthApi = async () => {
  const clients = await getApiClients()
  return clients.authApi
}

export const getProductApi = async () => {
  const clients = await getApiClients()
  return clients.productApi
}