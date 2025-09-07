<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth.js'
import { getTenantConfig, setTenantStyling } from './utils/tenant-config.js'

const authStore = useAuthStore()

onMounted(() => {
  // Restore authentication state
  authStore.restoreSession()
  
  // Apply tenant-specific styling
  const tenantConfig = getTenantConfig()
  setTenantStyling(tenantConfig)
})
</script>

<style>
:root {
  --primary-color: #dc2626;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

#app {
  min-height: 100vh;
}
</style>
