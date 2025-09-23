<template>
  <LoginForm />
</template>

<script setup>
import LoginForm from '../components/tenant/LoginForm.vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useTenantConfigStore } from '../stores/tenantConfig.js'

const router = useRouter()
const authStore = useAuthStore()
const tenantConfigStore = useTenantConfigStore()

onMounted(async () => {
  // Tenant config should already be loaded by main.js
  // Only load if not already initialized (shouldn't happen normally)
  if (!tenantConfigStore.initialized) {
    console.warn('Tenant config not initialized on login page - loading now')
    try {
      await tenantConfigStore.loadTenantConfig()
    } catch (error) {
      console.error('Failed to load tenant configuration on login page:', error)
    }
  }

  // Redirect if already authenticated
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
})
</script>