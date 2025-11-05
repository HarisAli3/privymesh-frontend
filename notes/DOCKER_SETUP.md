# Frontend Docker Setup Guide

This guide explains how to run the PrivyMesh frontend using Docker with profile management features enabled.

## Quick Start

```bash
# Build and run
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f frontend

# Stop
docker-compose down
```

## Environment Configuration

### Option 1: Using .env File (Recommended)

Create a `.env` file in the frontend root directory:

```bash
# Zitadel Configuration
ZITADEL_INSTANCE_URL=http://localhost:8080
ZITADEL_CLIENT_ID=344631193884491779
ZITADEL_REDIRECT_URI=http://localhost:3080/pm-auth
ZITADEL_SILENT_REDIRECT_URI=http://localhost:3080/pm-silent-auth
ZITADEL_POST_LOGOUT_REDIRECT_URI=http://localhost:3080/

# API Configuration
API_BASE_URL=http://localhost:8090
```

The `docker-compose.yml` file will automatically load this `.env` file.

### Option 2: Environment Variables in docker-compose.yml

Edit `docker-compose.yml` directly:

```yaml
environment:
  - ZITADEL_INSTANCE_URL=http://localhost:8080
  - ZITADEL_CLIENT_ID=your_client_id
  - API_BASE_URL=http://localhost:8090
```

### Option 3: Command Line

```bash
docker run -d \
  --name privymesh-frontend \
  -p 3080:80 \
  -e ZITADEL_INSTANCE_URL=http://localhost:8080 \
  -e ZITADEL_CLIENT_ID=344631193884491779 \
  -e API_BASE_URL=http://localhost:8090 \
  privymesh-frontend
```

## Profile Management Features

The frontend now includes user profile management features:

- **Update Email** - Change your email address
- **Update Name** - Change your display name  
- **Delete Account** - Permanently delete your account

### Prerequisites

These features require the **backend** to be configured with Zitadel Management API:

1. **Backend must have `ZITADEL_MANAGEMENT_TOKEN` set**
   - This is configured in the backend `.env` file
   - See `backend/USER_PROFILE_MANAGEMENT_SETUP.md` for details

2. **Frontend API URL must point to configured backend**
   ```bash
   API_BASE_URL=http://localhost:8090  # Or your backend URL
   ```

### How It Works

```
Frontend (Settings Page)
    ↓
POST /api/user/profile (with user's Bearer token)
    ↓
Backend validates token & extracts user ID
    ↓
Backend calls Zitadel Management API (with service account PAT)
    ↓
Zitadel updates/deletes user
    ↓
Response → Frontend
```

## Network Configuration

### Accessing Backend on Host Machine

If the backend is running on your host machine:

```bash
API_BASE_URL=http://localhost:8090
```

The `extra_hosts` configuration in `docker-compose.yml` maps `localhost` to the host gateway.

### Accessing Backend in Docker Network

If both frontend and backend are in Docker:

```bash
API_BASE_URL=http://privymesh-backend:8090
```

Both containers must be on the same Docker network.

### Accessing Zitadel on Host Machine

If Zitadel is on your host:

```yaml
extra_hosts:
  - "localhost:host-gateway"
```

## Troubleshooting

### Profile Management Not Working

1. **Check backend is configured:**
   ```bash
   # Check backend logs
   docker-compose logs backend | grep -i management
   ```
   
   Should see: "Zitadel Management API client initialized"

2. **Verify API connection:**
   ```bash
   # From browser console or curl
   curl http://localhost:8090/api/user
   ```

3. **Check frontend API URL:**
   ```bash
   # In browser console
   console.log(window.__ENV__.API_BASE_URL)
   ```

### Authentication Issues

1. **Verify Zitadel URLs match:**
   - Frontend `ZITADEL_INSTANCE_URL` must match your Zitadel instance
   - Redirect URIs must be correctly configured

2. **Check browser console for errors:**
   - Open DevTools > Console
   - Look for authentication errors

3. **Test Zitadel connectivity:**
   ```bash
   curl http://localhost:8080/.well-known/openid-configuration
   ```

### Environment Variables Not Loading

1. **Check `.env` file exists:**
   ```bash
   ls -la .env
   ```

2. **Verify `docker-entrypoint.sh` is running:**
   ```bash
   docker exec privymesh-frontend cat /usr/share/nginx/html/env-config.js
   ```

3. **Check `index.html` includes env-config.js:**
   ```bash
   docker exec privymesh-frontend grep env-config index.html
   ```

## Development Mode

For development with hot reload, use Vite directly:

```bash
yarn install
yarn dev
```

Or use the development Dockerfile (if available):

```bash
docker-compose -f docker-compose.dev.yml up
```

## Production Deployment

For production:

1. **Build optimized image:**
   ```bash
   docker build -t privymesh-frontend:latest .
   ```

2. **Use specific image tag:**
   ```yaml
   image: privymesh-frontend:v1.0.0
   ```

3. **Set production environment variables:**
   ```bash
   ZITADEL_INSTANCE_URL=https://your-zitadel-instance.com
   ZITADEL_REDIRECT_URI=https://your-domain.com/pm-auth
   API_BASE_URL=https://your-backend.com
   ```

4. **Use secrets management for sensitive values**

## Integration with Backend

The frontend connects to the backend for:

- **Authentication** - Token validation (through Zitadel)
- **Peer Management** - List, create, delete peers
- **User Profile** - Get user info
- **Profile Management** - Update email/name, delete account (requires backend Management API)

### Backend Requirements

- Backend must be accessible from the browser (not just Docker network)
- Backend must have CORS configured (already done)
- For profile management: Backend must have `ZITADEL_MANAGEMENT_TOKEN` set

## Files

- `docker-compose.yml` - Main Docker Compose configuration
- `Dockerfile` - Multi-stage build for production
- `docker-entrypoint.sh` - Runtime environment variable injection
- `.env` - Your local environment variables (create from template)

## References

- Backend Docker Setup: `../privymesh-backend/DOCKER.md`
- Profile Management Setup: `../privymesh-backend/USER_PROFILE_MANAGEMENT_SETUP.md`
- Frontend Profile Management: `USER_PROFILE_MANAGEMENT.md`

