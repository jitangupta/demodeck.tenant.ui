const getTenantFromUrl = () => {
  const hostname = window.location.hostname
  
  // For production: extract tenant from subdomain (e.g., acme.demodeck.xyz)
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    const parts = hostname.split('.')
    if (parts.length >= 2) {
      return parts[0] // First part is the tenant name
    }
  }
  
  // For local development: use environment variable or default
  return process.env.VUE_APP_TENANT_NAME || 'acme'
}

// Fetch tenant configuration from Tenant API
const fetchTenantFromApi = async (tenantName) => {
  try {
    const tenantApiUrl = process.env.VUE_APP_TENANT_API_URL || 'http://localhost:5121'
    const response = await fetch(`${tenantApiUrl}/api/tenant/${tenantName}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tenant: ${response.status}`)
    }
    
    const result = await response.json()
    return result.data
  } catch (error) {
    console.warn('Failed to fetch tenant from API, using defaults:', error.message)
    return null
  }
}

export const getTenantConfig = async () => {
  const tenantName = getTenantFromUrl()
  
  // Try to fetch tenant data from API
  const tenantData = await fetchTenantFromApi(tenantName)
  
  return {
    tenantName,
    displayName: process.env.VUE_APP_TITLE || tenantData?.displayName || `${tenantName.charAt(0).toUpperCase() + tenantName.slice(1)} Portal`,
    primaryColor: tenantData?.themeColor || '#dc2626',
    logoUrl: tenantData?.logoUrl || `/logos/${tenantName}-logo.png`,
    apiBaseUrl: process.env.VUE_APP_API_BASE_URL || 'https://localhost:7231',
    authApiUrl: process.env.VUE_APP_AUTH_API_URL || 'https://localhost:7258',
    tenantApiUrl: process.env.VUE_APP_TENANT_API_URL || 'http://localhost:5121',
    environment: process.env.VUE_APP_ENVIRONMENT || 'development'
  }
}

// Synchronous version for cases where we need immediate config
export const getTenantConfigSync = () => {
  const tenantName = getTenantFromUrl()
  
  return {
    tenantName,
    displayName: process.env.VUE_APP_TITLE || `${tenantName.charAt(0).toUpperCase() + tenantName.slice(1)} Portal`,
    primaryColor: '#dc2626', // Default fallback
    logoUrl: `/logos/${tenantName}-logo.png`, // Default fallback
    apiBaseUrl: process.env.VUE_APP_API_BASE_URL || 'https://localhost:7231',
    authApiUrl: process.env.VUE_APP_AUTH_API_URL || 'https://localhost:7258',
    tenantApiUrl: process.env.VUE_APP_TENANT_API_URL || 'http://localhost:5121',
    environment: process.env.VUE_APP_ENVIRONMENT || 'development'
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