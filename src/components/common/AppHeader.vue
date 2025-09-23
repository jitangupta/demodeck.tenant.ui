<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo and Title -->
        <div class="flex items-center space-x-4">
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span class="text-sm font-bold text-white">
              {{ (tenantConfigStore.config.tenantName ? tenantConfigStore.config.tenantName.charAt(0).toUpperCase() : '?') }}
            </span>
          </div>
          <h1 class="text-xl font-semibold text-gray-900">
            {{ tenantConfigStore.config.displayName }}
          </h1>
        </div>

        <!-- User Menu -->
        <div class="flex items-center space-x-6" v-if="authStore.isAuthenticated">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span class="text-sm font-medium text-gray-700">
                {{ (authStore.user?.username ? authStore.user.username.charAt(0).toUpperCase() : '?') }}
              </span>
            </div>
            <div class="hidden md:block">
              <p class="text-sm font-medium text-gray-900">{{ authStore.user?.username }}</p>
              <p class="text-xs text-gray-500">{{ authStore.user?.role }}</p>
            </div>
          </div>
          <button 
            @click="handleLogout"
            class="btn-secondary text-sm"
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
import { useTenantConfigStore } from '../../stores/tenantConfig.js'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const tenantConfigStore = useTenantConfigStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>