# Multi-stage build for Vue.js application

# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Set build-time environment variables with defaults
ARG VUE_APP_TENANT_NAME=acme
ARG VUE_APP_AUTH_API_URL=http://localhost:5130
ARG VUE_APP_API_BASE_URL=http://localhost:5142
ARG VUE_APP_TITLE="Acme Corporation Portal"
ARG VUE_APP_TENANT_API_URL=http://localhost:5121
ARG VUE_APP_ENVIRONMENT

# Set environment variables for the build process
ENV VUE_APP_TENANT_NAME=$VUE_APP_TENANT_NAME
ENV VUE_APP_AUTH_API_URL=$VUE_APP_AUTH_API_URL
ENV VUE_APP_API_BASE_URL=$VUE_APP_API_BASE_URL
ENV VUE_APP_TITLE=$VUE_APP_TITLE
ENV VUE_APP_TENANT_API_URL=$VUE_APP_TENANT_API_URL
ENV VUE_APP_ENVIRONMENT=$VUE_APP_ENVIRONMENT

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM nginx:alpine AS final

# Create nginx configuration
RUN cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
EOF

# Copy built application from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]