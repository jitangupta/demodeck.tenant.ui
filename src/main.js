import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'
import './assets/tailwind.css'
import { getTenantConfig, setTenantStyling } from './utils/tenant-config.js'

// Initialize tenant configuration asynchronously
const initApp = async () => {
  const app = createApp(App)
  
  app.use(createPinia())
  app.use(router)
  
  // Load tenant configuration from API and apply styling
  try {
    const config = await getTenantConfig()
    setTenantStyling(config)
    
    // Make config available globally if needed
    app.config.globalProperties.$tenantConfig = config
  } catch (error) {
    console.error('Failed to load tenant configuration:', error)
    // Continue with defaults
  }
  
  app.mount('#app')
}

initApp()
