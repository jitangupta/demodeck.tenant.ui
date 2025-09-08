# Runtime Environment Variable Configuration

This Vue.js application now supports **runtime environment variable substitution**, perfect for multi-tenant, multi-version deployments.

## How It Works

### 🔄 Runtime vs Build-time Configuration

**Before (Build-time):**
- `VUE_APP_*` variables baked into JavaScript during `npm run build`
- Required separate Docker builds for each tenant/environment
- No flexibility after container creation

**After (Runtime):**
- Environment variables processed at container startup
- Same Docker image works for ALL tenants and environments
- Configuration injected via Kubernetes environment variables

### 🚀 Implementation Details

1. **entrypoint.sh** - Runs at container startup
2. **runtime-config.js** - Generated configuration file served by nginx
3. **tenant-config.js** - Updated to check `window.RUNTIME_CONFIG` first
4. **Dockerfile** - Uses custom entrypoint instead of direct nginx start

## 🏗️ Deployment Examples

### Single Tenant Deployment
```yaml
env:
  VUE_APP_TENANT_NAME: "acme"
  VUE_APP_TITLE: "ACME Corporation Portal"
  VUE_APP_PRIMARY_COLOR: "#dc2626"
  VUE_APP_AUTH_API_URL: "https://auth-api-v1.demodeck.local"
  VUE_APP_API_BASE_URL: "https://product-api-v1.demodeck.local"
```

### Multi-Version Deployment
```yaml
# ACME v1
env:
  VUE_APP_TENANT_NAME: "acme"
  VUE_APP_AUTH_API_URL: "https://auth-api-v1.demodeck.local"
  VUE_APP_API_BASE_URL: "https://product-api-v1.demodeck.local"

---
# ACME v2  
env:
  VUE_APP_TENANT_NAME: "acme"
  VUE_APP_AUTH_API_URL: "https://auth-api-v2.demodeck.local"
  VUE_APP_API_BASE_URL: "https://product-api-v2.demodeck.local"
```

### Multi-Environment Deployment
```yaml
# Development
env:
  VUE_APP_AUTH_API_URL: "https://auth-api.dev.demodeck.local"
  VUE_APP_API_BASE_URL: "https://product-api.dev.demodeck.local"

# Staging
env:
  VUE_APP_AUTH_API_URL: "https://auth-api.staging.demodeck.local" 
  VUE_APP_API_BASE_URL: "https://product-api.staging.demodeck.local"

# Production
env:
  VUE_APP_AUTH_API_URL: "https://auth-api.prod.demodeck.local"
  VUE_APP_API_BASE_URL: "https://product-api.prod.demodeck.local"
```

## 🧪 Testing the Implementation

### 1. Build the Image
```bash
docker build -t demodeck-tenant-ui:runtime .
```

### 2. Test Different Configurations
```bash
# Test ACME configuration
docker run -p 8080:80 \
  -e VUE_APP_TENANT_NAME="acme" \
  -e VUE_APP_TITLE="ACME Portal" \
  -e VUE_APP_PRIMARY_COLOR="#dc2626" \
  demodeck-tenant-ui:runtime

# Test Initech configuration
docker run -p 8081:80 \
  -e VUE_APP_TENANT_NAME="initech" \
  -e VUE_APP_TITLE="Initech Portal" \
  -e VUE_APP_PRIMARY_COLOR="#059669" \
  demodeck-tenant-ui:runtime
```

### 3. Verify Runtime Configuration
Visit `http://localhost:8080/runtime-config.js` to see the generated config.

## 📊 Benefits for Multi-Tenant Architecture

✅ **Single Image**: One `demodeck-tenant-ui:v1.0.0` works for all tenants  
✅ **Flexible Deployment**: Change config without rebuilding  
✅ **Version Management**: Easy API version routing per tenant  
✅ **Environment Promotion**: Same image from dev → staging → prod  
✅ **Quick Onboarding**: New tenants = new Helm values only  
✅ **A/B Testing**: Runtime switching between API versions  

## 🔧 Supported Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VUE_APP_TENANT_NAME` | Tenant identifier | `acme` |
| `VUE_APP_TITLE` | Browser title | `{Tenant} Portal` |
| `VUE_APP_PRIMARY_COLOR` | Theme color | `#dc2626` |
| `VUE_APP_LOGO_URL` | Logo path | `/logos/{tenant}-logo.png` |
| `VUE_APP_AUTH_API_URL` | Authentication API | `https://localhost:7258` |
| `VUE_APP_API_BASE_URL` | Product API base | `https://localhost:7231` |

## 🚨 Important Notes

- **Backwards Compatible**: Still works with build-time variables for local development
- **Fallback Handling**: Runtime config takes precedence over build-time config
- **Container Startup**: Configuration happens at container start, not build time
- **Nginx Serving**: The `runtime-config.js` file is served by nginx like any static asset