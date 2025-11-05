# Debugging 401 "Unauthorized: Please login again" Error

## Problem

You're logged in to the frontend (can see your name and email), but API calls to the backend return 401 Unauthorized.

## Root Causes

### 1. Token Expired (Most Common)
- Frontend token expired but not refreshing automatically
- Solution: I've added automatic token refresh in `api.ts`

### 2. Audience Mismatch
- Token has one audience, backend expects different one
- **Check:** Backend `ZITADEL_AUDIENCE` matches token `aud` claim

### 3. Issuer Mismatch  
- Token issued by different Zitadel instance than backend expects
- **Check:** Backend `ZITADEL_INSTANCE_URL` matches token `iss` claim

### 4. JWKS Not Loading
- Backend can't fetch Zitadel's public keys
- **Check:** Backend can reach Zitadel JWKS endpoint

### 5. Token Format Issue
- Token not being sent correctly in Authorization header
- **Check:** Network tab shows `Authorization: Bearer <token>`

## Debugging Steps

### Step 1: Check Browser Console

Open DevTools > Console and look for:
- Token refresh messages
- 401 error details
- Token validation logs

You should see:
```
401 Unauthorized - Token details: {
  hasToken: true,
  tokenLength: ...,
  isAuthenticated: true,
  isExpired: false
}
```

### Step 2: Check Network Tab

1. Open DevTools > Network
2. Make an API call (e.g., try to load peers)
3. Find the failed request
4. Check **Request Headers:**
   - Should see: `Authorization: Bearer eyJ...`
   - If missing: Token not being sent

5. Check **Response:**
   - Status: 401
   - Response body should have error message from backend

### Step 3: Check Backend Logs

```bash
# Docker
docker-compose logs backend | grep -i "token\|auth\|401\|unauthorized"

# Should see:
# - "Token validation failed: ..."
# - "Authenticated user: ID=..."
```

Common backend errors:
- `token validation failed: token signature is invalid`
- `token audience validation failed`
- `token expired`
- `invalid issuer`

### Step 4: Decode Your Token

1. Open browser console
2. Run:
   ```javascript
   const token = window.__ENV__?.API_BASE_URL ? 
     (await fetch('http://localhost:8090/api/user', {
       headers: { 'Authorization': 'Bearer ' + document.cookie.match(/zitadel_token=([^;]+)/)?.[1] }
     }).catch(() => null)) : null;
   
   // Or manually:
   // Get token from cookies/localStorage
   // Decode at https://jwt.io
   ```

3. Check token claims:
   - `iss` (issuer) - should match backend `ZITADEL_INSTANCE_URL`
   - `aud` (audience) - should match backend `ZITADEL_AUDIENCE`
   - `exp` (expiration) - check if expired

### Step 5: Verify Backend Configuration

**Check backend .env file:**
```bash
# Backend directory
cat .env | grep ZITADEL
```

Should have:
```bash
ZITADEL_INSTANCE_URL=http://localhost:8080
ZITADEL_AUDIENCE=your_audience_here
```

**Common issues:**
- `ZITADEL_AUDIENCE` not set (uses default)
- `ZITADEL_AUDIENCE` doesn't match token `aud` claim
- `ZITADEL_INSTANCE_URL` doesn't match token `iss` claim

## Quick Fixes

### Fix 1: Audience Mismatch

**Get token audience:**
1. Decode token at jwt.io
2. Find `aud` claim value

**Update backend:**
```bash
# Backend .env
ZITADEL_AUDIENCE=value_from_token_aud_claim
```

**Restart backend:**
```bash
docker-compose restart backend
```

### Fix 2: Token Not Refreshing

I've already added automatic token refresh. If still failing:

1. **Clear browser storage:**
   ```javascript
   // In browser console
   localStorage.clear();
   sessionStorage.clear();
   document.cookie.split(";").forEach(c => {
     document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
   });
   ```

2. **Re-login**

### Fix 3: Backend JWKS Not Loading

Check backend can reach Zitadel:
```bash
# From backend container
docker exec privymesh-backend wget -O- http://localhost:8080/oauth/v2/keys
```

Should return JSON with keys. If fails:
- Check Zitadel is running
- Check network connectivity
- Check `ZITADEL_INSTANCE_URL` is correct

### Fix 4: Verify Token is Being Sent

**Check in Network tab:**
- Request should have `Authorization: Bearer <token>` header
- Token should be a long JWT string (starts with `eyJ`)

**If missing:**
- Token refresh failed
- User not properly authenticated
- Check browser console for auth errors

## Common Configuration Issues

### Issue: Frontend and Backend Using Different Client IDs

**Frontend uses:** Client ID `344609159628521475` (or whatever)
**Backend expects:** Audience from that client or different one

**Solution:**
1. Token `aud` claim should match backend `ZITADEL_AUDIENCE`
2. If using same Client ID as audience:
   ```bash
   # Backend .env
   ZITADEL_AUDIENCE=344609159628521475  # Same as frontend client ID
   ```

### Issue: Different Zitadel Instances

**Frontend:** `http://localhost:8080`
**Backend:** `http://zitadel:8080` or different URL

**Solution:**
Ensure both use same Zitadel instance URL:
```bash
# Frontend
ZITADEL_INSTANCE_URL=http://localhost:8080

# Backend  
ZITADEL_INSTANCE_URL=http://localhost:8080
```

## Testing

After fixing, test:

1. **Check token refresh works:**
   ```javascript
   // In browser console
   console.log('Token:', await getValidAccessToken());
   ```

2. **Test API call:**
   ```javascript
   fetch('http://localhost:8090/api/user', {
     headers: { 'Authorization': 'Bearer ' + token }
   }).then(r => r.json()).then(console.log);
   ```

3. **Check backend logs:**
   ```bash
   docker-compose logs -f backend
   # Should see: "Authenticated user: ID=..."
   ```

## What I've Fixed

✅ Added automatic token refresh in `api.ts`
✅ Added better error logging for 401 errors
✅ Added token validation before requests
✅ Added retry logic with refreshed token

## Still Not Working?

1. **Check backend logs for specific error**
2. **Decode token and verify claims match backend config**
3. **Verify backend can reach Zitadel JWKS endpoint**
4. **Ensure audience matches between token and backend**

