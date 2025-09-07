<template>
  <header class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo and Title -->
        <div class="flex items-center space-x-4">
          <img 
            :src="tenantConfig.logoUrl" 
            :alt="`${tenantConfig.displayName} Logo`"
            class="h-8 w-auto"
          />
          <h1 class="text-xl font-semibold text-gray-900">
            {{ tenantConfig.displayName }}
          </h1>
        </div>

        <!-- User Menu -->
        <div class="flex items-center space-x-4" v-if="authStore.isAuthenticated">
          <span class="text-sm text-gray-700">
            Welcome, {{ authStore.user?.username }}
          </span>
          <button 
            @click="handleLogout"
            class="text-sm text-gray-500 hover:text-gray-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth.js'
import { getTenantConfig } from '../../utils/tenant-config.js'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const tenantConfig = getTenantConfig()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>