# Fix "Errors.App.NotFound" - Client ID Issue

## Current Problem

Your application is trying to use Client ID: `344609159628521475`
But Zitadel cannot find this application.

**Error URL:**
```
http://localhost:8080/oauth/v2/authorize?client_id=344609159628521475&...
```

## Solutions

### Solution 1: Use an Existing Client ID

1. **Find your correct Client ID:**
   - Log into Zitadel Console: http://localhost:8080/ui/console
   - Navigate to: **Projects** → **Your Project** → **Applications**
   - Find your application (should be "User Agent" type)
   - Copy the **Client ID**

2. **Update your configuration:**

   **For Docker:**
   ```bash
   # Create or update .env file in frontend directory
   ZITADEL_CLIENT_ID=your_correct_client_id_here
   ZITADEL_INSTANCE_URL=http://localhost:8080
   ZITADEL_REDIRECT_URI=http://localhost:3080/pm-auth
   ZITADEL_SILENT_REDIRECT_URI=http://localhost:3080/pm-silent-auth
   API_BASE_URL=http://localhost:8090
   ```

   **For Local Development:**
   ```bash
   # Create or update .env.local file
   ZITADEL_CLIENT_ID=your_correct_client_id_here
   ZITADEL_INSTANCE_URL=http://localhost:8080
   ZITADEL_REDIRECT_URI=http://localhost:3000/pm-auth
   ```

3. **Restart:**
   ```bash
   # Docker
   docker-compose down
   docker-compose up --build
   
   # Local
   # Stop server and restart with: yarn dev
   ```

### Solution 2: Create New Application in Zitadel

If you want to use Client ID `344609159628521475`:

1. **Log into Zitadel Console:** http://localhost:8080/ui/console
2. **Navigate to:** Projects → Your Project → Applications
3. **Click:** "+ New" → **User Agent**
4. **Configure:**
   - Name: PrivyMesh Frontend
   - Application Type: **User Agent**
   - **Enable PKCE** (required)
   - Redirect URIs:
     - `http://localhost:3080/pm-auth` (for Docker)
     - `http://localhost:3000/pm-auth` (for local dev)
   - Silent Redirect URI:
     - `http://localhost:3080/pm-silent-auth` (for Docker)
     - `http://localhost:3000/pm-silent-auth` (for local dev)
   - Post Logout Redirect URI:
     - `http://localhost:3080/` (for Docker)
     - `http://localhost:3000/` (for local dev)

5. **Save** and copy the Client ID
6. **Update your .env/.env.local** with the new Client ID

### Solution 3: Check if AUTH_* Variables are Set

Your code prioritizes `AUTH_CLIENT_ID` over `ZITADEL_CLIENT_ID`. Check:

```bash
# Check what's set
docker exec privymesh-frontend env | grep -i client
```

If `AUTH_CLIENT_ID` is set to `344609159628521475`, either:
- Unset it, or
- Update it to the correct Client ID

## Verification Steps

### 1. Check Browser Console

After fixing, check browser console (F12) - you should see:
```
🔐 Zitadel Configuration:
- Instance URL: http://localhost:8080
- Client ID: YOUR_CORRECT_CLIENT_ID
- Redirect URI: http://localhost:3080/pm-auth
```

### 2. Verify Client ID in Zitadel

1. Log into Zitadel Console
2. Go to Projects → Your Project → Applications
3. Verify the Client ID matches what you configured
4. Ensure application is **enabled**

### 3. Check Redirect URI Match

The redirect URI in your request must **exactly match** what's configured in Zitadel:

**Your request shows:** `http://localhost:3001/pm-auth`

**But docker-compose.yml defaults to:** `http://localhost:3080/pm-auth`

**Fix:**
- Update Zitadel to include `http://localhost:3001/pm-auth` in redirect URIs, OR
- Update your config to use `http://localhost:3080/pm-auth`

## Common Client IDs in Your Setup

From your configuration files:
- `344631193884491779` - Default in docker-compose.yml
- `344501045671493635` - In config/zitadel.ts (not used)
- `344609159628521475` - Currently being used (doesn't exist)

**Action:** Use `344631193884491779` or verify/create the correct one in Zitadel.

## Quick Fix

**If you're running locally on port 3001:**

1. **Check your .env.local:**
   ```bash
   cat .env.local
   ```

2. **Update or create it:**
   ```bash
   ZITADEL_CLIENT_ID=344631193884491779  # Use the default from docker-compose.yml
   ZITADEL_INSTANCE_URL=http://localhost:8080
   ZITADEL_REDIRECT_URI=http://localhost:3001/pm-auth
   ZITADEL_SILENT_REDIRECT_URI=http://localhost:3001/pm-silent-auth
   API_BASE_URL=http://localhost:8090
   ```

3. **Verify in Zitadel Console:**
   - Application with Client ID `344631193884491779` exists
   - Redirect URI `http://localhost:3001/pm-auth` is configured
   - Application is enabled

## Still Not Working?

1. **Clear browser cache/cookies**
2. **Check Zitadel logs** for more details
3. **Verify Zitadel instance is accessible:** `curl http://localhost:8080/.well-known/openid-configuration`
4. **Check application type** - must be "User Agent" with PKCE enabled

