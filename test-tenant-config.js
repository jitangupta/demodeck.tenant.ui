// Test script for tenant configuration
// Run with: node test-tenant-config.js

const testHostnames = [
  'localhost',
  '127.0.0.1',
  'acme.qa.k8s.demodeck.xyz',
  'acme.k8s.demodeck.xyz',
  'mycompany.staging.k8s.demodeck.xyz',
  'mycompany.k8s.demodeck.xyz',
  'unknown.hostname.com'
]

// Mock the getTenantAndEnvironmentFromUrl function
const getTenantAndEnvironmentFromUrl = (hostname) => {
  // For local development: use dev tenant
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return {
      tenantName: 'dev',
      environment: 'local'
    }
  }

  // Parse hostname for tenant and environment
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
    tenantName: 'dev',
    environment: 'unknown'
  }
}

console.log('Testing hostname parsing for multi-tenant configuration:')
console.log('='*60)

testHostnames.forEach(hostname => {
  const result = getTenantAndEnvironmentFromUrl(hostname)
  console.log(`${hostname.padEnd(35)} -> tenant: ${result.tenantName.padEnd(12)} environment: ${result.environment}`)
})

console.log('\nExpected results:')
console.log('localhost                          -> tenant: dev          environment: local')
console.log('127.0.0.1                          -> tenant: dev          environment: local')
console.log('acme.qa.k8s.demodeck.xyz           -> tenant: acme         environment: qa')
console.log('acme.k8s.demodeck.xyz              -> tenant: acme         environment: production')
console.log('mycompany.staging.k8s.demodeck.xyz -> tenant: mycompany    environment: staging')
console.log('mycompany.k8s.demodeck.xyz         -> tenant: mycompany    environment: production')
console.log('unknown.hostname.com               -> tenant: dev          environment: unknown')