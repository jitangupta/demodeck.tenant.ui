const getTenantAndEnvironmentFromUrl = () => {
  const hostname = window.location.hostname

  console.log(`Current hostname: ${hostname}`)

  // For local development: use acme tenant
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    console.log('Detected local environment')
    return {
      tenantName: 'acme',
      environment: 'local'
    }
  }

  // Parse hostname for tenant and environment
  // Expected formats:
  // - acme.qa.k8s.demodeck.xyz (tenant: acme, environment: qa)
  // - acme.k8s.demodeck.xyz (tenant: acme, environment: production)
  const parts = hostname.split('.')

  if (parts.length >= 4 && parts.includes('k8s') && parts.includes('demodeck')) {
    const tenantName = parts[0]
    const environmentPart = parts[1]

    // If second part is 'k8s', then it's production
    if (environmentPart === 'k8s') {
      return {
        tenantName,
        environment: 'production'
      }
    }

    // If second part is not 'k8s', treat it as environment (e.g., qa, staging)
    if (parts[2] === 'k8s') {
      return {
        tenantName,
        environment: environmentPart
      }
    }
  }

  // Fallback for unknown hostname patterns
  return {
    tenantName: process.env.VUE_APP_TENANT_NAME || 'acme',
    environment: 'unknown'
  }
}

const fetchTenantConfigFromApi = async (tenantName, environment) => {
  try {
    const tenantApiUrl = process.env.VUE_APP_TENANT_API_URL || 'https://tenant-api.demodeck.xyz'
    console.log(`tenant api url: ${tenantApiUrl}`);
    const response = await fetch(`${tenantApiUrl}/api/tenant/${tenantName}?environment=${environment}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch tenant config: ${response.statusText}`)
    }

    const apiResponse = await response.json()

    if (apiResponse.success && apiResponse.data) {
      const tenantData = apiResponse.data
      return {
        tenantId: tenantData.tenantId,
        tenantName: tenantData.tenantName,
        displayName: tenantData.displayName,
        logoUrl: tenantData.logoUrl,
        primaryColor: tenantData.themeColor,
        serviceName: tenantData.serviceName,
        isActive: tenantData.isActive,
        isHealthy: tenantData.isHealthy,
        primaryRegion: tenantData.primaryRegion,
        currentVersion: tenantData.currentVersion,
        customHeaders: tenantData.customHeaders,
        createdAt: tenantData.createdAt,
        authApiUrl: tenantData.authAPI,
        apiBaseUrl: tenantData.productAPI
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching tenant configuration:', error)
    return null
  }
}

const getDefaultTenantConfig = (tenantName, environment) => {
  // For local environment, always use "Acme Corporation"
  const defaultTitle = environment === 'local'
    ? 'Acme Corporation'
    : process.env.VUE_APP_TITLE || `${tenantName.charAt(0).toUpperCase() + tenantName.slice(1)} Portal`

  return {
    tenantName,
    environment,
    displayName: defaultTitle,
    primaryColor: process.env.VUE_APP_PRIMARY_COLOR || '#dc2626',
    logoUrl: process.env.VUE_APP_LOGO_URL || `/logos/${tenantName}-logo.png`,
    authApiUrl: process.env.VUE_APP_AUTH_API_URL || 'http://localhost:5130',
    apiBaseUrl: process.env.VUE_APP_API_BASE_URL || 'http://localhost:5142',
    // Default values for other tenant properties
    tenantId: `tnt_${tenantName}001`,
    isActive: true,
    isHealthy: true,
    serviceName: `${tenantName}-service`,
    primaryRegion: 'local',
    currentVersion: '1.0',
    customHeaders: {},
    createdAt: new Date().toISOString()
  }
}

export const getTenantConfig = async () => {
  const { tenantName, environment } = getTenantAndEnvironmentFromUrl()
  console.log(`Getting tenant config for tenant: ${tenantName}, environment: ${environment}`)

  // For local development, always use default acme configuration
  if (environment === 'local') {
    console.log('Using local environment config - defaulting to acme')
    return getDefaultTenantConfig('acme', environment)
  }

  // For unknown environment, throw error
  if (environment === 'unknown') {
    const error = new Error(`Unknown tenant hostname pattern. Unable to determine tenant configuration.`)
    console.error(error.message)
    throw error
  }

  // For hosted environments, try to fetch from tenant-api
  console.log('Attempting to fetch from tenant API...')
  const apiConfig = await fetchTenantConfigFromApi(tenantName, environment)

  if (apiConfig) {
    console.log('Successfully fetched tenant config from API')
    return {
      ...apiConfig,
      tenantName,
      environment
    }
  }

  // For production environments, if API fails, throw error (don't fallback)
  if (environment === 'production' || environment === 'qa' || environment === 'staging') {
    const error = new Error(`Tenant '${tenantName}' not found or tenant API is unavailable. Cannot proceed without valid tenant configuration.`)
    console.error(error.message)
    throw error
  }

  // For other environments, fallback to acme default
  console.log('Falling back to acme default tenant config')
  return getDefaultTenantConfig('acme', environment)
}

export const setTenantStyling = (config) => {
  console.log('🎨 Setting tenant styling:', config)

  // Set CSS variables
  document.documentElement.style.setProperty('--primary-color', config.primaryColor)

  // Set title with a small delay to ensure DOM is ready
  setTimeout(() => {
    document.title = config.displayName
    console.log('✅ Title set to:', document.title)
  }, 10)

  console.log('✅ Primary color set to:', config.primaryColor)

  // Update favicon if needed
  const favicon = document.querySelector('link[rel="icon"]')
  if (favicon) {
    favicon.href = `/favicons/${config.tenantName}-favicon.ico`
  }
}