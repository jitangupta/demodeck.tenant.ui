import { onMounted, watch } from 'vue'
import { useTenantConfigStore } from '../stores/tenantConfig.js'

export function useDocumentTitle() {
  const tenantConfigStore = useTenantConfigStore()

  const updateTitle = () => {
    // Set a default title while loading, then use tenant config when available
    if (tenantConfigStore.config.displayName && tenantConfigStore.config.displayName !== 'Loading...') {
      document.title = tenantConfigStore.config.displayName
    } else if (!tenantConfigStore.initialized) {
      // While loading, use default
      document.title = 'Loading...'
    } else {
      // Fallback if something goes wrong
      document.title = 'Acme Corporation'
    }
  }

  onMounted(() => {
    updateTitle()
  })

  // Watch for changes in tenant config and initialization status
  watch(
    [() => tenantConfigStore.config.displayName, () => tenantConfigStore.initialized],
    () => {
      updateTitle()
    },
    { immediate: true }
  )

  return {
    updateTitle
  }
}