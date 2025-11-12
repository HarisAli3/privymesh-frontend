# Backend Setup with nginx-proxy

This guide shows how to configure the PrivyMesh backend to work with nginx-proxy for automatic SSL.

## Overview

- **Frontend**: `privymesh.com` (already configured)
- **Backend API**: `api.privymesh.com` (to be configured)

## Step 1: Update Backend docker-compose.yml

Add nginx-proxy configuration to your backend docker-compose.yml:

```yaml
services:
  backend:
    # ... your existing backend configuration ...
    expose:
      - "8090"  # Expose the port, don't publish it
    environment:
      # ... your existing environment variables ...
      # nginx-proxy configuration
      - VIRTUAL_HOST=api.privymesh.com
      - VIRTUAL_PORT=8090
      - LETSENCRYPT_HOST=api.privymesh.com
      - LETSENCRYPT_EMAIL=harisali3@gmail.com
    networks:
      - privymesh-network
      - nginx-proxy  # Add nginx-proxy network
    # ... rest of your configuration ...

networks:
  privymesh-network:
    # ... your existing network config ...
  nginx-proxy:
    external: true  # Use the existing nginx-proxy network
```

## Step 2: DNS Configuration

Add an A record for the API subdomain:

```
Type: A
Name: api
Value: 128.199.212.147
TTL: 3600
```

This creates `api.privymesh.com` pointing to your server.

## Step 3: Update Frontend API URL

Update your frontend `docker-compose.yml` to use the backend through HTTPS:

```yaml
environment:
  # ... other variables ...
  - API_BASE_URL=https://api.privymesh.com
```

Or update your `.env` file:

```bash
API_BASE_URL=https://api.privymesh.com
```

## Step 4: Restart Services

```bash
# Restart backend
cd /path/to/backend
docker-compose down
docker-compose up -d

# Restart frontend (to pick up new API URL)
cd /path/to/frontend
docker-compose down
docker-compose up -d
```

## Step 5: Verify Setup

1. **Check backend is accessible**:
   ```bash
   curl https://api.privymesh.com/health
   # Should return healthy response
   ```

2. **Check SSL certificate**:
   ```bash
   docker exec nginx-proxy ls -la /etc/nginx/certs/ | grep api.privymesh
   # Should show api.privymesh.com.crt and api.privymesh.com.key
   ```

3. **Check nginx-proxy detected backend**:
   ```bash
   docker logs nginx-proxy | grep -i api.privymesh
   # Should show configuration for api.privymesh.com
   ```

## Alternative: Use Path-Based Routing

If you prefer to use the same domain with path-based routing (e.g., `privymesh.com/api`), you can configure nginx-proxy to route `/api/*` to the backend.

### Option A: Path-Based Routing (Same Domain)

Update your backend docker-compose.yml:

```yaml
services:
  backend:
    # ... existing config ...
    environment:
      - VIRTUAL_HOST=privymesh.com
      - VIRTUAL_PORT=8090
      - VIRTUAL_PATH=/api
      - LETSENCRYPT_HOST=privymesh.com
      - LETSENCRYPT_EMAIL=harisali3@gmail.com
```

Then update frontend API URL:

```yaml
environment:
  - API_BASE_URL=https://privymesh.com/api
```

**Note**: Path-based routing requires nginx-proxy to be configured properly. The subdomain approach (api.privymesh.com) is simpler and more reliable.

## Troubleshooting

### Backend Not Accessible

1. **Check backend is running**:
   ```bash
   docker ps | grep backend
   ```

2. **Check backend logs**:
   ```bash
   docker logs privymesh-backend
   ```

3. **Verify network**:
   ```bash
   docker inspect privymesh-backend | grep -A 10 Networks
   # Should show nginx-proxy network
   ```

4. **Test internal connectivity**:
   ```bash
   docker exec nginx-proxy curl http://privymesh-backend:8090/health
   ```

### SSL Certificate Not Generated

1. **Check Let's Encrypt logs**:
   ```bash
   docker logs nginx-proxy-letsencrypt | grep -i api.privymesh
   ```

2. **Verify DNS**:
   ```bash
   dig api.privymesh.com +short
   # Should return: 128.199.212.147
   ```

3. **Check port 80 is accessible** (for validation):
   ```bash
   curl -I http://api.privymesh.com
   ```

### CORS Issues

If you get CORS errors, make sure your backend CORS configuration allows:

```go
// Example Go backend CORS config
allowedOrigins := []string{
    "https://privymesh.com",
    "https://www.privymesh.com",
}
```

## Complete Example: Backend docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    image: ghcr.io/harisali3/privymesh-backend:latest
    # or build: ...
    container_name: privymesh-backend
    expose:
      - "8090"
    environment:
      # Your backend environment variables
      - PORT=8090
      - ZITADEL_INSTANCE_URL=https://privymesh-dysjkn.us1.zitadel.cloud
      # ... other variables ...
      
      # nginx-proxy configuration
      - VIRTUAL_HOST=api.privymesh.com
      - VIRTUAL_PORT=8090
      - LETSENCRYPT_HOST=api.privymesh.com
      - LETSENCRYPT_EMAIL=harisali3@gmail.com
    restart: unless-stopped
    networks:
      - privymesh-network
      - nginx-proxy

networks:
  privymesh-network:
    # Your existing network config
  nginx-proxy:
    external: true
```

## Summary

1. ✅ Add nginx-proxy environment variables to backend
2. ✅ Add backend to nginx-proxy network
3. ✅ Configure DNS A record for `api.privymesh.com`
4. ✅ Update frontend `API_BASE_URL` to `https://api.privymesh.com`
5. ✅ Restart both services
6. ✅ Verify SSL certificate is generated
7. ✅ Test API access via HTTPS

Both frontend and backend will now have automatic SSL certificates from Let's Encrypt!

