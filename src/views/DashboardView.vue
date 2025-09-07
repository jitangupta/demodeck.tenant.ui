<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <h1 class="text-2xl font-semibold text-gray-900 mb-6">
          Dashboard
        </h1>
        
        <!-- Welcome Card -->
        <div class="bg-white overflow-hidden shadow rounded-lg mb-6">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Welcome back, {{ authStore.user?.username }}!
            </h3>
            <div class="mt-2 max-w-xl text-sm text-gray-500">
              <p>You are logged in as {{ authStore.user?.role }} for {{ tenantConfig.displayName }}.</p>
            </div>
          </div>
        </div>
        
        <!-- User List -->
        <UserList />
      </div>
    </main>
  </div>
</template>

<script setup>
import Header from '../components/common/AppHeader.vue'
import UserList from '../components/tenant/UserList.vue'
import { useAuthStore } from '../stores/auth.js'
import { getTenantConfig } from '../utils/tenant-config.js'

const authStore = useAuthStore()
const tenantConfig = getTenantConfig()
</script>