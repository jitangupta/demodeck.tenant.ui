const getRuntimeConfig = (key) => {
  // First try runtime config (from container startup)
  if (window.RUNTIME_CONFIG && window.RUNTIME_CONFIG[key]) {
    return window.RUNTIME_CONFIG[key]
  }
  // Fallback to build-time environment variables (for local development)
  return process.env[key] || null
}

const getTenantFromUrl = () => {
  const hostname = window.location.hostname
  
  // For production: extract tenant from subdomain (e.g., acme.demodeck.xyz)
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    const parts = hostname.split('.')
    if (parts.length >= 2) {
      return parts[0] // First part is the tenant name
    }
  }
  
  // For local development: use runtime config or build-time env var or default
  return getRuntimeConfig('VUE_APP_TENANT_NAME') || 'acme'
}

export const getTenantConfig = () => {
  const tenantName = getTenantFromUrl()
  
  return {
    tenantName,
    displayName: getRuntimeConfig('VUE_APP_TITLE') || `${tenantName.charAt(0).toUpperCase() + tenantName.slice(1)} Portal`,
    primaryColor: getRuntimeConfig('VUE_APP_PRIMARY_COLOR') || '#dc2626',
    logoUrl: getRuntimeConfig('VUE_APP_LOGO_URL') || `/logos/${tenantName}-logo.png`,
    apiBaseUrl: getRuntimeConfig('VUE_APP_API_BASE_URL') || 'https://localhost:7231',
    authApiUrl: getRuntimeConfig('VUE_APP_AUTH_API_URL') || 'https://localhost:7258'
  }
}

export const setTenantStyling = (config) => {
  document.documentElement.style.setProperty('--primary-color', config.primaryColor)
  document.title = config.displayName
  
  // Update favicon if needed
  const favicon = document.querySelector('link[rel="icon"]')
  if (favicon) {
    favicon.href = `/favicons/${config.tenantName}-favicon.ico`
  }
}