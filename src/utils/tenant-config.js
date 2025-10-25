const getTenantAndEnvironmentFromUrl = () => {
  const hostname = window.location.hostname
  // const hostname = "acme.qa.k8s.demodeck.xyz" // Development override 

  // For local development: use acme tenant
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
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
    // Determine API gateway URL based on environment
    let apiGatewayUrl
    if (process.env.VUE_APP_API_GATEWAY_URL) {
      apiGatewayUrl = process.env.VUE_APP_API_GATEWAY_URL
    } else if (environment === 'local') {
      apiGatewayUrl = 'http://localhost:5008'
    } else {
      apiGatewayUrl = 'http://api.k8s.demodeck.xyz'
    }

    const response = await fetch(`${apiGatewayUrl}/tenant/api/tenant/${tenantName}?environment=${environment}`, {
      headers: {
        'X-Tenant': tenantName
      }
    })

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
        authApiUrl: `${apiGatewayUrl}/auth`,
        apiBaseUrl: `${apiGatewayUrl}/product`
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

  // Determine API gateway URL based on environment
  // Environment variable takes precedence, otherwise use environment-specific defaults
  let apiGatewayUrl
  if (process.env.VUE_APP_API_GATEWAY_URL) {
    apiGatewayUrl = process.env.VUE_APP_API_GATEWAY_URL
  } else if (environment === 'local') {
    apiGatewayUrl = 'http://localhost:5008'
  } else {
    // For deployed environments (qa, staging, production, etc.)
    apiGatewayUrl = 'http://api.k8s.demodeck.xyz'
  }

  return {
    tenantName,
    environment,
    displayName: defaultTitle,
    primaryColor: process.env.VUE_APP_PRIMARY_COLOR || '#dc2626',
    logoUrl: process.env.VUE_APP_LOGO_URL || `/logos/${tenantName}-logo.png`,
    authApiUrl: `${apiGatewayUrl}/auth`,
    apiBaseUrl: `${apiGatewayUrl}/product`,
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

  // For local development, always use default acme configuration
  if (environment === 'local') {
    return getDefaultTenantConfig('acme', environment)
  }

  // For unknown environment, throw error
  if (environment === 'unknown') {
    const error = new Error(`Unknown tenant hostname pattern. Unable to determine tenant configuration.`)
    throw error
  }

  // For hosted environments, try to fetch from tenant-api
  const apiConfig = await fetchTenantConfigFromApi(tenantName, environment)

  if (apiConfig) {
    return {
      ...apiConfig,
      tenantName,
      environment
    }
  }

  // For production environments, if API fails, throw error (don't fallback)
  if (environment === 'production' || environment === 'qa' || environment === 'staging') {
    const error = new Error(`Tenant '${tenantName}' not found or tenant API is unavailable. Cannot proceed without valid tenant configuration.`)
    throw error
  }

  // For other environments, fallback to acme default
  return getDefaultTenantConfig('acme', environment)
}

export const setTenantStyling = (config) => {
  // Set CSS variables
  document.documentElement.style.setProperty('--primary-color', config.primaryColor)

  // Set title immediately and with delays to ensure it sticks
  document.title = config.displayName

  // Try multiple times to ensure title is set
  setTimeout(() => {
    document.title = config.displayName
  }, 50)

  setTimeout(() => {
    document.title = config.displayName
  }, 200)

  setTimeout(() => {
    document.title = config.displayName
  }, 500)

  // Update favicon if needed
  const favicon = document.querySelector('link[rel="icon"]')
  if (favicon) {
    favicon.href = `/favicons/${config.tenantName}-favicon.ico`
  }
}