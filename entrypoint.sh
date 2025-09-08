#!/bin/sh

# entrypoint.sh - Runtime Environment Variable Substitution for Vue.js App

set -e

echo "🚀 Starting tenant-ui with runtime configuration..."

# Default values if environment variables are not set
VUE_APP_TENANT_NAME=${VUE_APP_TENANT_NAME:-"acme"}
VUE_APP_TITLE=${VUE_APP_TITLE:-"${VUE_APP_TENANT_NAME} Portal"}
VUE_APP_PRIMARY_COLOR=${VUE_APP_PRIMARY_COLOR:-"#dc2626"}
VUE_APP_LOGO_URL=${VUE_APP_LOGO_URL:-"/logos/${VUE_APP_TENANT_NAME}-logo.png"}
VUE_APP_API_BASE_URL=${VUE_APP_API_BASE_URL:-"https://localhost:7231"}
VUE_APP_AUTH_API_URL=${VUE_APP_AUTH_API_URL:-"https://localhost:7258"}

echo "📝 Configuration:"
echo "   Tenant Name: $VUE_APP_TENANT_NAME"
echo "   Title: $VUE_APP_TITLE"
echo "   Primary Color: $VUE_APP_PRIMARY_COLOR"
echo "   API Base URL: $VUE_APP_API_BASE_URL"
echo "   Auth API URL: $VUE_APP_AUTH_API_URL"

# Create runtime config file that will be served by nginx
CONFIG_FILE="/usr/share/nginx/html/runtime-config.js"

echo "🔧 Creating runtime configuration file at $CONFIG_FILE"

cat > "$CONFIG_FILE" << EOF
// Runtime Configuration - Generated at container startup
window.RUNTIME_CONFIG = {
  VUE_APP_TENANT_NAME: "$VUE_APP_TENANT_NAME",
  VUE_APP_TITLE: "$VUE_APP_TITLE",
  VUE_APP_PRIMARY_COLOR: "$VUE_APP_PRIMARY_COLOR",
  VUE_APP_LOGO_URL: "$VUE_APP_LOGO_URL",
  VUE_APP_API_BASE_URL: "$VUE_APP_API_BASE_URL",
  VUE_APP_AUTH_API_URL: "$VUE_APP_AUTH_API_URL"
};
EOF

echo "✅ Runtime configuration created successfully"

# Optional: Update the HTML to include the runtime config
echo "🔄 Updating index.html to include runtime configuration"
sed -i 's|</head>|<script src="/runtime-config.js"></script></head>|' /usr/share/nginx/html/index.html

echo "🎯 Starting nginx server..."
exec nginx -g "daemon off;"