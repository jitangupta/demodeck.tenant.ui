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
    // Error is already handled in the store
    // For critical tenant errors, the store will throw and prevent app initialization
  }

  app.mount('#app')
}

initializeApp()
