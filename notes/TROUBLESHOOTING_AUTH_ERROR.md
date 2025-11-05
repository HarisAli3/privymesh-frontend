# Troubleshooting "Errors.App.NotFound" Authentication Error

If you see this error when clicking Sign In:
```json
{"error":"invalid_request","error_description":"Errors.App.NotFound"}
```

This means Zitadel cannot find the OAuth application with the Client ID you're using.

## Quick Fix Checklist

### 1. Verify Client ID is Set

Check your browser console - you should see:
```
🔐 Zitadel Configuration:
- Instance URL: http://localhost:8080
- Client ID: YOUR_CLIENT_ID_HERE
```

**If Client ID shows as empty or undefined:**
- Environment variable is not being loaded
- Check `.env` file or Docker environment variables

### 2. Verify Client ID Exists in Zitadel

1. **Log into Zitadel Console:** http://localhost:8080/ui/console
2. **Navigate to:** Projects > Your Project > Applications
3. **Find your application** and check the Client ID
4. **Verify it matches** what's configured in your frontend

### 3. Check Environment Variables

#### For Docker:
```bash
# Check what's loaded in container
docker exec privymesh-frontend env | grep ZITADEL_CLIENT_ID

# Check env-config.js in browser
# Open: http://localhost:3080/env-config.js
```

#### For Local Development:
```bash
# Check .env.local file exists
cat .env.local

# Should contain:
ZITADEL_CLIENT_ID=your_actual_client_id
```

### 4. Common Issues

#### Issue: Client ID is Empty
**Symptoms:** Console shows `Client ID: ` (empty)
**Solution:**
1. Create or update `.env` file (for Docker) or `.env.local` (for local dev)
2. Add: `ZITADEL_CLIENT_ID=your_client_id_here`
3. Restart container/app

#### Issue: Wrong Client ID
**Symptoms:** Console shows wrong Client ID
**Solution:**
1. Get correct Client ID from Zitadel Console
2. Update environment variable
3. Rebuild Docker container if using Docker:
   ```bash
   docker-compose up --build
   ```

#### Issue: Application Deleted/Disabled
**Symptoms:** Client ID looks correct but still getting error
**Solution:**
1. Check Zitadel Console if application exists
2. Verify application is enabled
3. Check application type is "User Agent" (not "Web" or "Native")
4. Verify PKCE is enabled (required for User Agent apps)

#### Issue: Redirect URI Mismatch
**Symptoms:** Error might be redirect URI related
**Solution:**
1. In Zitadel Console, check Redirect URIs configured for your app
2. Must include:
   - `http://localhost:3080/pm-auth` (or your frontend URL + `/pm-auth`)
   - `http://localhost:3080/pm-silent-auth` (for silent refresh)
3. For Docker: Make sure `ZITADEL_REDIRECT_URI` matches

### 5. Debug Steps

#### Step 1: Check Browser Console
Open DevTools > Console and look for:
- Zitadel configuration logs
- Any error messages about missing Client ID

#### Step 2: Check Network Tab
Open DevTools > Network:
1. Click Sign In
2. Look for the authorization request
3. Check the URL - it should contain `client_id=...`
4. If `client_id` is missing or empty, environment variable is not loaded

#### Step 3: Verify env-config.js
1. Open: http://localhost:3080/env-config.js
2. Check `ZITADEL_CLIENT_ID` value
3. If undefined, Docker entrypoint is not injecting variables

#### Step 4: Check Zitadel Console
1. Log into Zitadel
2. Go to: Projects > Your Project > Applications
3. Verify application exists and is enabled
4. Copy the exact Client ID

### 6. Docker-Specific Fixes

If using Docker and Client ID is not loading:

#### Fix 1: Check env_file in docker-compose.yml
```yaml
env_file:
  - .env  # Make sure this is uncommented
```

#### Fix 2: Verify .env file exists
```bash
# In frontend directory
cat .env

# Should contain:
ZITADEL_CLIENT_ID=your_client_id
```

#### Fix 3: Rebuild with fresh environment
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

#### Fix 4: Check docker-entrypoint.sh is working
```bash
docker exec privymesh-frontend cat /usr/share/nginx/html/env-config.js
```

Should show your environment variables.

### 7. Local Development Fixes

If running locally (`yarn dev`):

#### Fix 1: Create .env.local
```bash
# In frontend root directory
cat > .env.local <<EOF
ZITADEL_INSTANCE_URL=http://localhost:8080
ZITADEL_CLIENT_ID=your_client_id_here
ZITADEL_REDIRECT_URI=http://localhost:3000/pm-auth
ZITADEL_SILENT_REDIRECT_URI=http://localhost:3000/pm-silent-auth
API_BASE_URL=http://localhost:8090
EOF
```

#### Fix 2: Restart Dev Server
```bash
# Stop current server (Ctrl+C)
# Then restart
yarn dev
```

### 8. Verify Correct Client ID

Common client IDs in your setup:
- `344631193884491779` (from docker-compose.yml default)
- `344501045671493635` (from config/zitadel.ts - but not used)

**Find your actual Client ID:**
1. Log into Zitadel Console
2. Go to Projects > Your Project > Applications
3. Click on your application (should be "User Agent" type)
4. Copy the Client ID

### 9. Test Configuration

After fixing, test:

1. **Clear browser cache/cookies**
2. **Restart container/server**
3. **Check console logs** for configuration
4. **Try signing in again**

You should see:
```
🔐 Zitadel Configuration:
- Instance URL: http://localhost:8080
- Client ID: YOUR_CORRECT_CLIENT_ID
- Redirect URI: http://localhost:3080/pm-auth
```

## Still Not Working?

1. **Check Zitadel is running:**
   ```bash
   curl http://localhost:8080/.well-known/openid-configuration
   ```

2. **Verify application type:**
   - Must be "User Agent" (not "Web" or "Native")
   - PKCE must be enabled

3. **Check application is in correct project:**
   - Application must be in the same project as your service account

4. **Verify network connectivity:**
   - Frontend can reach Zitadel instance
   - For Docker: Check `extra_hosts` configuration

## Need More Help?

Check:
- Backend logs: `docker-compose logs backend`
- Frontend logs: `docker-compose logs frontend`
- Browser console for detailed error messages
- Network tab for request/response details

