# Zitadel Audience Configuration Guide

This guide explains what the `audience` claim means and how to configure it for your frontend and backend.

---

## What is Audience?

The **audience** (`aud`) claim in a JWT token identifies **who the token is intended for**. It's a security measure that ensures tokens can only be used by the intended recipient (your backend API).

**Think of it like this:**
- **Frontend Client ID**: "Who is requesting the token" (the user/app)
- **Audience**: "Who should accept this token" (your backend API)

---

## Two Configuration Options

You have two approaches:

### Option 1: Use Same Client ID (Simple, Less Secure)

**Current Setup:**
- Frontend Client ID: `344501045671493635` (your Dashboard app)
- Audience: `344501045671493635` (same as client ID)

**How it works:**
- Frontend authenticates with Dashboard app
- Token is issued with `aud: "344501045671493635"`
- Backend validates token has this audience

**Pros:**
- ✅ Simple setup
- ✅ Works immediately
- ✅ No additional configuration needed

**Cons:**
- ❌ No separation between frontend and backend
- ❌ Less secure (frontend and API share same identity)
- ❌ Can't distinguish between different APIs
- ❌ Not following best practices

**When to use:** Small projects, prototypes, development/testing

---

### Option 2: Create Separate API Application (Recommended, Best Practice)

**Better Setup:**
- Frontend Client ID: `344501045671493635` (Dashboard app - for authentication)
- Backend Audience: `NEW_API_CLIENT_ID` (new API application - for token validation)

**How it works:**
- Frontend authenticates with Dashboard app
- Frontend requests token with `audience: NEW_API_CLIENT_ID`
- Token is issued with `aud: "NEW_API_CLIENT_ID"`
- Backend validates token has `aud: "NEW_API_CLIENT_ID"`

**Pros:**
- ✅ Better security (separation of concerns)
- ✅ Can have multiple APIs with different audiences
- ✅ Follows OAuth 2.0 best practices
- ✅ More flexible for future expansion
- ✅ Better audit trails (can distinguish API access)

**Cons:**
- ⚠️ Requires creating new application in Zitadel
- ⚠️ Slightly more configuration

**When to use:** Production applications, multiple APIs, enterprise setups

---

## Recommended Approach: Create API Application

### Step 1: Create API Application in Zitadel

1. **Log into Zitadel Console**
   - Go to your project
   - Navigate to **Applications** → **New Application**

2. **Create API Application**
   - **Application Type**: Select **API** (not OAuth/Web)
   - **Name**: e.g., "PrivyMesh Backend API" or "PrivyMesh API"
   - **Auth Method**: You can choose:
     - **JWT Profile** (recommended for service-to-service)
     - **Bearer Token** (for user tokens)
   
   **Important:** For user tokens from frontend, you typically want to create it as:
   - **Application Type**: **OIDC** (not API)
   - But configure it as an **API Resource** instead
   
   Actually, the better approach in Zitadel is to use **Project Resources**:

3. **Alternative: Use Project Resource (Recommended)**
   - Go to your **Project** in Zitadel
   - Navigate to **Resources** (or **API Resources**)
   - Click **New Resource**
   - **Name**: e.g., "PrivyMesh API"
   - **Type**: API Resource
   - **Audience**: This becomes your audience value
   - Copy the **Resource ID** or **Audience** value

**Example Resource Configuration:**
```
Resource Name: PrivyMesh Backend API
Audience: privymesh-api (or a UUID)
```

### Step 2: Configure Frontend to Request This Audience

Update your frontend configuration:

```typescript
// src/lib/zitadel-auth.ts
const ZITADEL_CONFIG = {
  // ... existing config
  auth_audience: getEnv('AUTH_AUDIENCE') || 
                 getEnv('ZITADEL_AUTH_AUDIENCE') || 
                 'YOUR_API_RESOURCE_AUDIENCE', // Use the resource audience here
};
```

**Environment Variable:**
```bash
ZITADEL_AUTH_AUDIENCE=privymesh-api
# OR use the resource ID if it's a UUID
# ZITADEL_AUTH_AUDIENCE=uuid-of-your-resource
```

### Step 3: Configure Backend to Validate This Audience

Update your Go backend:

```go
// Use the same audience value as frontend
cfg := ZitadelConfig{
    InstanceURL: "http://localhost:8080",
    Audience:    "privymesh-api", // Must match frontend audience
}
```

**Environment Variable:**
```bash
export ZITADEL_AUDIENCE=privymesh-api
```

---

## How to Find the Correct Audience Value

### Method 1: Check Your Token

1. Use your `TokenDisplay` component in the frontend
2. Decode the token (it shows the decoded payload)
3. Look for the `aud` claim:
   ```json
   {
     "sub": "user-id",
     "aud": "344501045671493635",  // <-- This is your current audience
     "iss": "http://localhost:8080",
     ...
   }
   ```

### Method 2: Zitadel Console

1. Go to **Applications** → Your Dashboard app
2. Check **Advanced Settings** or **Token Settings**
3. Look for **Audience** or **Allowed Audiences**

### Method 3: Check Frontend Code

Your current config shows:
```typescript
auth_audience: '344501045671493635'
```

So your tokens currently have `aud: "344501045671493635"`

---

## Implementation Steps

### If Using Same Client ID (Quick Start)

**Backend Configuration:**
```go
// Use the same client ID as frontend
validator, err := auth.NewTokenValidator(
    "http://localhost:8080",
    "344501045671493635", // Same as frontend client ID
)
```

**Environment:**
```bash
export ZITADEL_AUDIENCE=344501045671493635
```

✅ **This will work immediately** - tokens from frontend will have this audience.

---

### If Creating New API Resource (Recommended)

**1. Create Resource in Zitadel:**
- Project → Resources → New Resource
- Name: `privymesh-api`
- Audience: `privymesh-api` (or auto-generated UUID)
- Save and copy the Audience value

**2. Update Frontend:**
```typescript
// .env or environment variable
ZITADEL_AUTH_AUDIENCE=privymesh-api
```

**3. Update Backend:**
```go
validator, err := auth.NewTokenValidator(
    "http://localhost:8080",
    "privymesh-api", // New API resource audience
)
```

**4. Update Frontend Request:**
Make sure your frontend passes the audience when requesting tokens (already configured in your code):
```typescript
// This is already in your code at line 54
...(ZITADEL_CONFIG.auth_audience ? { extraQueryParams: { audience: ZITADEL_CONFIG.auth_audience } } : {}),
```

---

## Token Structure Comparison

### Current Setup (Same Client ID)
```json
{
  "sub": "USER_ID",
  "aud": "344501045671493635",  // Same as client ID
  "iss": "http://localhost:8080",
  "exp": 1234567890,
  ...
}
```

### With Separate API Resource
```json
{
  "sub": "USER_ID",
  "aud": "privymesh-api",  // Different from client ID
  "iss": "http://localhost:8080",
  "exp": 1234567890,
  ...
}
```

**Backend validates:**
```go
if token.Audience() != "privymesh-api" {
    return error("invalid audience")
}
```

---

## Validation in Backend

The backend should validate the audience like this:

```go
// In your ValidateToken function
if tv.audience != "" {
    audiences := token.Audience()
    found := false
    for _, aud := range audiences {
        if aud == tv.audience {
            found = true
            break
        }
    }
    if !found {
        return nil, fmt.Errorf("token audience '%v' does not match expected '%s'", 
            audiences, tv.audience)
    }
}
```

**Note:** `aud` can be a string or array of strings, so handle both cases.

---

## Recommendations

### For Development/Testing
**Use Option 1** (same client ID):
- Quick to set up
- No additional Zitadel configuration needed
- Your current setup will work

```bash
# Backend .env
ZITADEL_AUDIENCE=344501045671493635
```

### For Production
**Use Option 2** (separate API resource):
- Better security
- Follows best practices
- More maintainable

```bash
# Frontend .env
ZITADEL_AUTH_AUDIENCE=privymesh-api

# Backend .env
ZITADEL_AUDIENCE=privymesh-api
```

---

## Quick Decision Guide

**Use Same Client ID if:**
- ✅ Quick prototype/MVP
- ✅ Single application
- ✅ Development/testing environment
- ✅ You want to get started quickly

**Create API Resource if:**
- ✅ Production application
- ✅ Multiple APIs/services
- ✅ Need better security separation
- ✅ Want to follow OAuth 2.0 best practices
- ✅ Enterprise/company project

---

## Testing Your Configuration

### Test 1: Check Token Audience

1. Login in frontend
2. Open TokenDisplay component
3. Decode token and check `aud` claim
4. Ensure it matches your backend configuration

### Test 2: Backend Validation

```go
token, err := validator.ValidateToken(ctx, tokenString)
if err != nil {
    // Check if it's an audience mismatch
    log.Printf("Validation failed: %v", err)
}
```

### Test 3: Invalid Audience Test

If you change the backend audience to something wrong, validation should fail:
```go
validator, _ := auth.NewTokenValidator("http://localhost:8080", "wrong-audience")
// This should fail when validating real tokens
```

---

## Summary

**Your Current Situation:**
- Frontend client ID: `344501045671493635`
- Current audience: `344501045671493635` (same as client ID)

**Quick Start (Option 1):**
```bash
# Backend
export ZITADEL_AUDIENCE=344501045671493635
```
✅ Works immediately with your current setup

**Best Practice (Option 2):**
1. Create API Resource in Zitadel (audience: `privymesh-api`)
2. Update frontend: `ZITADEL_AUTH_AUDIENCE=privymesh-api`
3. Update backend: `ZITADEL_AUDIENCE=privymesh-api`
✅ Better security and separation

**Recommendation:** Start with Option 1 for development, then migrate to Option 2 before production.

---

## Additional Notes

- **Audience is Optional**: If you don't set an audience, the backend can still validate tokens (just won't check audience)
- **Multiple Audiences**: Tokens can have multiple audiences if configured
- **Case Sensitive**: Audience values are case-sensitive
- **URIs vs Strings**: Audience can be a URI (like `https://api.example.com`) or a simple string (like `privymesh-api`)

