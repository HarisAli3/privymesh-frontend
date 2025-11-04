# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first
COPY package.json yarn.lock ./
COPY lib/package.json lib/yarn.lock ./lib/

# Copy all source files (including lib)
COPY . .

# Install dependencies for lib first
WORKDIR /app/lib
RUN yarn install --frozen-lockfile

# Build lib (creates lib/dist)
RUN yarn build

# Install root dependencies (will link to built lib via link:./lib)
WORKDIR /app
RUN yarn install --frozen-lockfile

# Build the application (includes all profile management UI and API calls)
RUN yarn build

# Production stage
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Create entrypoint script to generate env-config.js at runtime
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'set -e' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '# Create env-config.js with environment variables from Docker' >> /docker-entrypoint.sh && \
    echo 'cat > /usr/share/nginx/html/env-config.js <<EOF' >> /docker-entrypoint.sh && \
    echo 'window.__ENV__ = {' >> /docker-entrypoint.sh && \
    echo '  ZITADEL_INSTANCE_URL: "${ZITADEL_INSTANCE_URL:-}",' >> /docker-entrypoint.sh && \
    echo '  ZITADEL_CLIENT_ID: "${ZITADEL_CLIENT_ID:-}",' >> /docker-entrypoint.sh && \
    echo '  ZITADEL_REDIRECT_URI: "${ZITADEL_REDIRECT_URI:-}",' >> /docker-entrypoint.sh && \
    echo '  ZITADEL_SILENT_REDIRECT_URI: "${ZITADEL_SILENT_REDIRECT_URI:-}",' >> /docker-entrypoint.sh && \
    echo '  ZITADEL_POST_LOGOUT_REDIRECT_URI: "${ZITADEL_POST_LOGOUT_REDIRECT_URI:-}",' >> /docker-entrypoint.sh && \
    echo '  ZITADEL_AUTH_AUDIENCE: "${ZITADEL_AUTH_AUDIENCE:-}",' >> /docker-entrypoint.sh && \
    echo '  API_BASE_URL: "${API_BASE_URL:-}",' >> /docker-entrypoint.sh && \
    echo '  AUTH_AUTHORITY: "${AUTH_AUTHORITY:-}",' >> /docker-entrypoint.sh && \
    echo '  AUTH_CLIENT_ID: "${AUTH_CLIENT_ID:-}",' >> /docker-entrypoint.sh && \
    echo '  AUTH_REDIRECT_URI: "${AUTH_REDIRECT_URI:-}",' >> /docker-entrypoint.sh && \
    echo '  AUTH_SILENT_REDIRECT_URI: "${AUTH_SILENT_REDIRECT_URI:-}",' >> /docker-entrypoint.sh && \
    echo '  AUTH_SUPPORTED_SCOPES: "${AUTH_SUPPORTED_SCOPES:-}",' >> /docker-entrypoint.sh && \
    echo '  AUTH_AUDIENCE: "${AUTH_AUDIENCE:-}"' >> /docker-entrypoint.sh && \
    echo '};' >> /docker-entrypoint.sh && \
    echo 'EOF' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '# Inject script tag into index.html if not already present' >> /docker-entrypoint.sh && \
    echo 'INDEX_FILE="/usr/share/nginx/html/index.html"' >> /docker-entrypoint.sh && \
    echo 'if [ -f "$INDEX_FILE" ] && ! grep -q "env-config.js" "$INDEX_FILE"; then' >> /docker-entrypoint.sh && \
    echo '  sed -i "s|<body>|<body>\\n    <script src=\"/env-config.js\"></script>|" "$INDEX_FILE"' >> /docker-entrypoint.sh && \
    echo 'fi' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '# Start nginx' >> /docker-entrypoint.sh && \
    echo 'exec "$@"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Configure nginx for SPA routing
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    location /env-config.js { \
        add_header Cache-Control "no-cache, no-store, must-revalidate"; \
        add_header Pragma "no-cache"; \
        add_header Expires "0"; \
    } \
    \
    location /health { \
        access_log off; \
        return 200 "healthy\n"; \
        add_header Content-Type text/plain; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Use entrypoint to generate env-config.js at runtime
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

