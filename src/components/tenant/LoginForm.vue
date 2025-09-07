<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <img 
          class="mx-auto h-12 w-auto" 
          :src="tenantConfig.logoUrl" 
          :alt="`${tenantConfig.displayName} Logo`"
        />
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to {{ tenantConfig.displayName }}
        </h2>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <input
              v-model="form.username"
              type="text"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Username"
            />
          </div>
          <div>
            <input
              v-model="form.password"
              type="password"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="authStore.loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            <span v-if="!authStore.loading">Sign in</span>
            <span v-else>Signing in...</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'
import { getTenantConfig } from '../../utils/tenant-config.js'

const authStore = useAuthStore()
const router = useRouter()
const tenantConfig = getTenantConfig()

const form = reactive({
  username: '',
  password: ''
})

const error = ref(null)

const handleSubmit = async () => {
  error.value = null
  
  try {
    await authStore.login(form)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed'
  }
}
</script>

<style scoped>
.bg-primary {
  background-color: var(--primary-color);
}
.hover\:bg-primary-dark:hover {
  background-color: color-mix(in srgb, var(--primary-color) 90%, black);
}
.focus\:ring-primary:focus {
  --tw-ring-color: var(--primary-color);
}
.focus\:border-primary:focus {
  border-color: var(--primary-color);
}
</style>