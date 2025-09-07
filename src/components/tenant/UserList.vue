<template>
  <div class="card">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-xl font-semibold text-gray-900">
          Team Members
        </h3>
        <p class="text-sm text-gray-600 mt-1">
          Manage your team and their roles
        </p>
      </div>
      <button class="btn-primary">
        Add Member
      </button>
    </div>
    
    <div v-if="tenantStore.loading" class="flex items-center justify-center py-12">
      <div class="flex items-center space-x-2">
        <svg class="animate-spin h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-gray-600">Loading users...</span>
      </div>
    </div>
    
    <div v-else-if="tenantStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex">
        <svg class="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.768 0L3.046 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span class="text-sm text-red-800">{{ tenantStore.error }}</span>
      </div>
    </div>
    
    <div v-else-if="tenantStore.users.length > 0" class="space-y-3">
      <div v-for="user in tenantStore.users" :key="user.id" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0">
            <div class="h-10 w-10 bg-primary-600 rounded-full flex items-center justify-center">
              <span class="text-sm font-medium text-white">
                {{ user.username.charAt(0).toUpperCase() }}
              </span>
            </div>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900">
              {{ user.username }}
            </p>
            <p class="text-sm text-gray-600">
              {{ user.email }}
            </p>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <span class="px-3 py-1 text-xs font-medium rounded-full"
                :class="getRoleBadgeClass(user.role)">
            {{ user.role }}
          </span>
          <div class="flex items-center space-x-1">
            <button class="p-1 text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button class="p-1 text-gray-400 hover:text-red-600 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-12">
      <div class="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      </div>
      <p class="text-gray-500 text-sm">No team members found</p>
      <button class="btn-primary mt-4">
        Add Your First Member
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTenantStore } from '../../stores/tenant.js'

const tenantStore = useTenantStore()

const getRoleBadgeClass = (role) => {
  switch (role) {
    case 'Admin':
      return 'bg-red-100 text-red-800'
    case 'Manager':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

onMounted(() => {
  tenantStore.fetchUsers()
})
</script>

