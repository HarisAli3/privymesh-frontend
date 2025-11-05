# Docker Build Notes - Profile Management Features

This document explains how the Docker build process includes the user profile management features.

## What's Included

The Docker build includes all user profile management features:

### Frontend Components
- ✅ `src/pages/settings.tsx` - Settings page with profile update and account deletion
- ✅ `src/lib/api.ts` - API functions for `updateProfile()` and `deleteAccount()`
- ✅ `src/contexts/AuthContext.tsx` - Updated with `refreshUser()` function
- ✅ All UI components for profile management

### Build Process

1. **Dependencies Installation:**
   ```dockerfile
   RUN yarn install --frozen-lockfile
   ```

2. **Source Code Copy:**
   ```dockerfile
   COPY . .  # Includes all profile management code
   ```

3. **Application Build:**
   ```dockerfile
   RUN yarn build  # Builds React app with all features
   ```

4. **Environment Variables:**
   - Runtime environment variables are injected by `docker-entrypoint.sh`
   - Includes `API_BASE_URL` for backend communication

## Runtime Configuration

### Required Environment Variables

For profile management to work, ensure these are set in Docker:

```bash
# API Configuration - Backend URL
API_BASE_URL=http://localhost:8090

# Zitadel Configuration
ZITADEL_INSTANCE_URL=http://localhost:8080
ZITADEL_CLIENT_ID=your_client_id
```

### Backend Requirements

The backend must have `ZITADEL_MANAGEMENT_TOKEN` configured:
- Set in backend `.env` file
- Service account with `user.read`, `user.write`, `user.delete` permissions

## Verification

### Check Build Includes Profile Management

```bash
# Build the image
docker build -t privymesh-frontend .

# Check build output for profile management files
docker run --rm privymesh-frontend ls -la /usr/share/nginx/html/static/js/ | grep settings
```

### Test Profile Management in Container

1. **Start container:**
   ```bash
   docker-compose up
   ```

2. **Access Settings page:**
   - Navigate to http://localhost:3080/settings
   - Verify "Profile Information" section is visible
   - Verify "Delete Account" button is visible

3. **Test API calls:**
   - Open browser DevTools > Network
   - Update profile (should see `POST /api/user/profile`)
   - Try delete account (should see `POST /api/user/delete`)

## Troubleshooting

### Profile Management Not Working

1. **Check API URL:**
   ```bash
   # In browser console
   console.log(window.__ENV__.API_BASE_URL)
   ```
   
   Should match your backend URL.

2. **Verify backend is running:**
   ```bash
   curl http://localhost:8090/health
   ```

3. **Check backend Management API:**
   ```bash
   # In backend logs
   docker-compose logs backend | grep -i management
   ```
   
   Should see: "Zitadel Management API client initialized"

4. **Verify CORS:**
   - Backend must allow requests from frontend origin
   - Check backend CORS configuration

### Build Errors

If build fails:

1. **Check dependencies:**
   ```bash
   # Run locally first
   yarn install
   yarn build
   ```

2. **Clear Docker cache:**
   ```bash
   docker-compose build --no-cache
   ```

3. **Check for TypeScript errors:**
   ```bash
   yarn tsc --noEmit
   ```

## Files Verified in Build

- ✅ `src/pages/settings.tsx` - Profile management UI
- ✅ `src/lib/api.ts` - API request functions
- ✅ `src/contexts/AuthContext.tsx` - User refresh functionality
- ✅ `docker-entrypoint.sh` - Environment variable injection
- ✅ `Dockerfile` - Build configuration
- ✅ `docker-compose.yml` - Runtime configuration

## Production Build

The production build includes:

1. **Optimized bundle** - Minified JavaScript
2. **Tree shaking** - Unused code removed
3. **Code splitting** - Efficient loading
4. **Runtime env injection** - Dynamic configuration

All profile management features are included and optimized in the production build.

