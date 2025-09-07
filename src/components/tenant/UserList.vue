<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-md">
    <div class="px-4 py-5 sm:p-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
        Team Members
      </h3>
      
      <div v-if="tenantStore.loading" class="text-center py-4">
        Loading users...
      </div>
      
      <div v-else-if="tenantStore.error" class="text-red-600 text-center py-4">
        {{ tenantStore.error }}
      </div>
      
      <ul v-else-if="tenantStore.users.length > 0" class="divide-y divide-gray-200">
        <li v-for="user in tenantStore.users" :key="user.id" class="py-4">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <div class="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-white">
                  {{ user.username.charAt(0).toUpperCase() }}
                </span>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ user.username }}
              </p>
              <p class="text-sm text-gray-500 truncate">
                {{ user.email }}
              </p>
            </div>
            <div class="inline-flex items-center text-sm text-gray-500">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getRoleBadgeClass(user.role)">
                {{ user.role }}
              </span>
            </div>
          </div>
        </li>
      </ul>
      
      <div v-else class="text-center py-4 text-gray-500">
        No users found
      </div>
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

<style scoped>
.bg-primary {
  background-color: var(--primary-color);
}
</style>