import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'
import './assets/tailwind.css'
import { useTenantConfigStore } from './stores/tenantConfig.js'

const initializeApp = async () => {
  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(router)

  // Initialize tenant configuration store
  try {
    const tenantConfigStore = useTenantConfigStore()
    await tenantConfigStore.loadTenantConfig()

    // Make tenant config available globally if needed
    app.config.globalProperties.$tenantConfig = tenantConfigStore.config
  } catch (error) {
    console.error('Failed to initialize tenant configuration:', error)

    // For critical tenant errors, show error page instead of continuing
    if (error.message.includes('not found') || error.message.includes('Unknown tenant')) {
      // You can redirect to an error page or show an error component
      // For now, we'll log the error and let the app handle it in components
      console.error('Critical tenant configuration error - app may not function properly')
    }
  }

  app.mount('#app')
}

initializeApp()
