<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Page Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p class="mt-2 text-gray-600">
            Manage your {{ tenantConfig.displayName }} workspace
          </p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="card">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">{{ tenantStore.users.length }}</h3>
                <p class="text-sm text-gray-500">Total Users</p>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Active</h3>
                <p class="text-sm text-gray-500">System Status</p>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">{{ tenantConfig.tenantName.toUpperCase() }}</h3>
                <p class="text-sm text-gray-500">Tenant ID</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Welcome Card -->
        <div class="card mb-8">
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                <span class="text-lg font-semibold text-white">
                  {{ authStore.user?.username?.charAt(0).toUpperCase() }}
                </span>
              </div>
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-semibold text-gray-900">
                Welcome back, {{ authStore.user?.username }}!
              </h3>
              <p class="mt-1 text-gray-600">
                You are logged in as <span class="font-medium text-primary-600">{{ authStore.user?.role }}</span> for {{ tenantConfig.displayName }}.
              </p>
              <div class="mt-4 flex items-center space-x-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Online
                </span>
                <span class="text-sm text-gray-500">
                  Last login: Today
                </span>
              </div>
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
import { useTenantStore } from '../stores/tenant.js'
import { getTenantConfig } from '../utils/tenant-config.js'

const authStore = useAuthStore()
const tenantStore = useTenantStore()
const tenantConfig = getTenantConfig()
</script>