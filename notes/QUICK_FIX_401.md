# Quick Fix for 401 Unauthorized Error

## Problem

You're logged in to the dashboard but getting "Unauthorized: Please login again" when making API calls.

## Most Likely Cause: Audience Mismatch

Your token has an `aud` (audience) claim that doesn't match what the backend expects.

## Quick Fix

### Step 1: Check Backend Logs

```bash
# Check backend logs for the actual error
docker-compose logs backend | grep -i "audience\|token validation\|401"
```

Look for messages like:
- `"Audience mismatch - Expected: X, Got: Y"`
- `"Tip: Set ZITADEL_AUDIENCE to one of the token audiences"`

### Step 2: Get Your Token Audience

**Option A: Use Browser Console**

1. Open browser console (F12)
2. Find your token in cookies or localStorage
3. Copy the token (starts with `eyJ`)
4. Go to https://jwt.io
5. Paste token
6. Look for `"aud"` in the payload

**Option B: Check TokenDisplay Component**

If you have a token display component, it should show the audience.

### Step 3: Update Backend Configuration

**Edit backend `.env` file:**

```bash
# Backend directory
ZITADEL_AUDIENCE=the_aud_value_from_your_token
```

**Common values:**
- If using same Client ID as audience: `344631193884491779` or `344609159628521475`
- If you set a custom audience in frontend: Use that value

### Step 4: Restart Backend

```bash
docker-compose restart backend
```

### Step 5: Test

1. Refresh your browser page
2. Try accessing the dashboard again
3. Check browser console - should no longer see 401 errors

## Alternative: Disable Audience Validation (Not Recommended)

If you want to test without audience validation:

**Backend `.env`:**
```bash
# Leave ZITADEL_AUDIENCE empty or unset
# Backend will skip audience validation
```

**Warning:** This is less secure and not recommended for production.

## What I've Added

✅ Automatic token refresh before API calls
✅ Better error messages showing backend details
✅ Retry logic with refreshed tokens
✅ Detailed console logging for debugging

## Still Not Working?

1. **Check browser console** - Now shows detailed error messages
2. **Check backend logs** - Shows exact validation failure
3. **Verify token audience matches backend ZITADEL_AUDIENCE**
4. **Verify token issuer matches backend ZITADEL_INSTANCE_URL**

