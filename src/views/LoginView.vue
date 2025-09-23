<template>
  <LoginForm />
</template>

<script setup>
import LoginForm from '../components/tenant/LoginForm.vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useTenantConfigStore } from '../stores/tenantConfig.js'
import { useDocumentTitle } from '../composables/useDocumentTitle.js'

const router = useRouter()
const authStore = useAuthStore()
const tenantConfigStore = useTenantConfigStore()

// Use the document title composable
useDocumentTitle()

onMounted(async () => {
  // Tenant config should already be loaded by main.js
  // Only load if not already initialized (shouldn't happen normally)
  if (!tenantConfigStore.initialized) {
    try {
      await tenantConfigStore.loadTenantConfig()
    } catch (error) {
      // Error is already handled in the store
    }
  }

  // Redirect if already authenticated
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
})
</script>