# Build stage
FROM node:25-alpine3.21 AS builder

# Install dependencies for lib first (better caching)
WORKDIR /app/lib
COPY lib/package.json lib/yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 100000

# Install root dependencies (better caching)
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 100000

# Copy lib source and build
WORKDIR /app/lib
COPY lib/src ./src
COPY lib/tsconfig.json ./
RUN yarn build

# Copy app source and build (lib/dist already exists from previous build)
WORKDIR /app
COPY src ./src
COPY public ./public
COPY index.html vite.config.ts tsconfig.json postcss.config.js tailwind.config.js eslint.config.mjs prettier.config.mjs ./
RUN yarn build

# Production stage
FROM nginx:1.29.4-alpine

# Copy built files from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Create entrypoint script and nginx config in one layer
RUN printf '#!/bin/sh\n\
set -e\n\
cat > /usr/share/nginx/html/env-config.js <<EOF\n\
window.__ENV__ = {\n\
  ZITADEL_INSTANCE_URL: "${ZITADEL_INSTANCE_URL:-}",\n\
  ZITADEL_CLIENT_ID: "${ZITADEL_CLIENT_ID:-}",\n\
  ZITADEL_REDIRECT_URI: "${ZITADEL_REDIRECT_URI:-}",\n\
  ZITADEL_SILENT_REDIRECT_URI: "${ZITADEL_SILENT_REDIRECT_URI:-}",\n\
  ZITADEL_POST_LOGOUT_REDIRECT_URI: "${ZITADEL_POST_LOGOUT_REDIRECT_URI:-}",\n\
  ZITADEL_AUTH_AUDIENCE: "${ZITADEL_AUTH_AUDIENCE:-}",\n\
  API_BASE_URL: "${API_BASE_URL:-}",\n\
  AUTH_AUTHORITY: "${AUTH_AUTHORITY:-}",\n\
  AUTH_CLIENT_ID: "${AUTH_CLIENT_ID:-}",\n\
  AUTH_REDIRECT_URI: "${AUTH_REDIRECT_URI:-}",\n\
  AUTH_SILENT_REDIRECT_URI: "${AUTH_SILENT_REDIRECT_URI:-}",\n\
  AUTH_SUPPORTED_SCOPES: "${AUTH_SUPPORTED_SCOPES:-}",\n\
  AUTH_AUDIENCE: "${AUTH_AUDIENCE:-}"\n\
};\n\
EOF\n\
INDEX_FILE="/usr/share/nginx/html/index.html"\n\
[ -f "$INDEX_FILE" ] && ! grep -q "env-config.js" "$INDEX_FILE" && sed -i '"'"'s|<body>|<body>\\n    <script src="/env-config.js"></script>|'"'"' "$INDEX_FILE"\n\
exec "$@"\n' > /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh && \
    printf 'server {\n\
    listen 80;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / { try_files $uri $uri/ /index.html; }\n\
    location /env-config.js { add_header Cache-Control "no-cache, no-store, must-revalidate"; add_header Pragma "no-cache"; add_header Expires "0"; }\n\
    location /health { access_log off; return 200 "healthy\\n"; add_header Content-Type text/plain; }\n\
}\n' > /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Use entrypoint to generate env-config.js at runtime
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

