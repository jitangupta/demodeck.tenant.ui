<template>
  <LoginForm />
</template>

<script setup>
import LoginForm from '../components/tenant/LoginForm.vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  // Redirect if already authenticated
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
})
</script>