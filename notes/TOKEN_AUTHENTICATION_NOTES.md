# Frontend Token Authentication Flow - Technical Notes

## Overview

This document explains how the frontend creates and manages authentication tokens that are used by the backend API. The application uses **Zitadel OAuth 2.0/OIDC** for authentication.

## Important Note

⚠️ **The frontend does NOT create tokens directly.** Instead, it initiates an OAuth 2.0 flow with Zitadel (the identity provider), which issues the tokens. The frontend then stores and uses these tokens for backend API requests.

---

## Authentication Flow Diagram

```
User → Frontend → Zitadel Auth Server → Frontend → Backend API
                    ↓
              [User Authenticates]
                    ↓
              [Zitadel Issues Tokens]
                    ↓
Frontend Receives Tokens → Stores Them → Sends in API Requests
```

---

## Step-by-Step Token Creation Process

### 1. **Initial Login - Authorization Request**

**Location:** `src/lib/zitadel-auth.ts` → `login()` method

**Process:**
- User clicks login
- Frontend redirects to Zitadel authorization endpoint
- User authenticates with Zitadel (username/password, etc.)
- Zitadel validates credentials

**Configuration:**
- `response_type: 'code'` - Uses Authorization Code flow
- `scope: 'openid email profile offline_access'` - Requests OIDC scopes + refresh token
- `redirect_uri` - Where Zitadel sends user back after auth

### 2. **Authorization Code Exchange → Tokens**

**Location:** `src/lib/zitadel-auth.ts` → `handleCallback()` method  
**Trigger:** User redirected to `/pm-auth` route

**Process:**
```typescript
// Zitadel redirects back with authorization code in URL
// Frontend exchanges code for tokens (handled by @zitadel/react library)
const user = await zitadel.userManager.signinRedirectCallback();
```

**What Happens:**
1. Frontend receives authorization code from Zitadel
2. `@zitadel/react` library makes backend call to Zitadel token endpoint
3. Exchanges authorization code for:
   - **Access Token** (JWT) - Used for API requests
   - **Refresh Token** - Used to get new access tokens
   - **ID Token** - Contains user identity claims
4. Tokens stored in `User` object (from `oidc-client-ts`)

**Token Structure:**
- Access tokens are **JWTs** (JSON Web Tokens)
- Contain user identity (user ID, email, etc.)
- Include expiration time
- Signed by Zitadel's private key

### 3. **Token Storage**

**Location:** `src/lib/zitadel-auth.ts` → `setUserCookie()` method

**Storage Locations:**

1. **In-Memory (Primary):**
   ```typescript
   this.user = user; // User object from oidc-client-ts
   // Contains: user.access_token, user.refresh_token, user.id_token
   ```

2. **Browser Cookies (Persistence):**
   ```typescript
   Cookies.set('zitadel_token', user.access_token, { expires: 7 });
   Cookies.set('zitadel_user', JSON.stringify(userInfo), { expires: 7 });
   ```
   - Allows token to persist across page refreshes
   - 7-day expiration

3. **UserManager Storage (oidc-client-ts):**
   - Library stores tokens in browser storage (localStorage/sessionStorage)
   - Used for automatic token management

### 4. **Token Usage in API Requests**

**Location:** `src/lib/api.ts` → `request()` function

**Process:**
```typescript
const token = zitadelAuth.getAccessToken(); // Retrieves from User object
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`  // Token sent as Bearer token
};
```

**How Backend Receives Token:**
- Backend extracts token from `Authorization` header
- Validates JWT signature using Zitadel's public keys
- Extracts user identity from token claims
- Grants/denies access based on token validity

### 5. **Token Refresh (Automatic Renewal)**

**Location:** `src/lib/zitadel-auth.ts` → `refreshToken()` method

**Trigger:**
- When access token is about to expire
- Handled automatically by `oidc-client-ts` library

**Process:**
```typescript
const user = await zitadel.userManager.signinSilent();
// Uses refresh token to get new access token
// Happens silently in background (hidden iframe)
```

**Why Silent Refresh:**
- Access tokens typically expire in minutes/hours
- Refresh tokens last much longer (days/weeks)
- Allows seamless user experience without re-login

---

## Configuration Details

### Zitadel Configuration

**File:** `src/lib/zitadel-auth.ts`

```typescript
const zitadelConfig = {
  authority: ZITADEL_CONFIG.instanceUrl,        // Zitadel server URL
  client_id: ZITADEL_CONFIG.clientId,            // OAuth client ID
  redirect_uri: '/pm-auth',                      // Callback URL
  silent_redirect_uri: '/pm-silent-auth',        // Silent refresh callback
  response_type: 'code',                         // Authorization Code flow
  scope: 'openid email profile offline_access',  // Requested permissions
  audience: ZITADEL_CONFIG.auth_audience         // API audience (if needed)
};
```

### Environment Variables

**Supported Variables:**
- `AUTH_AUTHORITY` or `ZITADEL_INSTANCE_URL` - Zitadel server URL
- `AUTH_CLIENT_ID` or `ZITADEL_CLIENT_ID` - OAuth client ID
- `AUTH_REDIRECT_URI` or `ZITADEL_REDIRECT_URI` - Callback URL
- `AUTH_SILENT_REDIRECT_URI` or `ZITADEL_SILENT_REDIRECT_URI` - Silent refresh URL
- `AUTH_AUDIENCE` or `ZITADEL_AUTH_AUDIENCE` - API audience

---

## Token Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│ 1. User Login                                           │
│    → Redirect to Zitadel                                │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 2. User Authenticates                                   │
│    → Zitadel validates credentials                      │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Authorization Code Returned                          │
│    → Zitadel redirects to /pm-auth with code            │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Token Exchange                                       │
│    → Frontend exchanges code for tokens                │
│    → Receives: Access Token, Refresh Token, ID Token   │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Token Storage                                        │
│    → In-memory (User object)                            │
│    → Cookies (persistence)                              │
│    → Browser storage (oidc-client-ts)                  │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 6. Token Usage                                          │
│    → Retrieved via getAccessToken()                     │
│    → Sent as "Authorization: Bearer <token>"           │
│    → Backend validates token                            │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 7. Token Refresh (when expiring)                       │
│    → Silent refresh using refresh token                 │
│    → New access token obtained                          │
│    → Process repeats from step 5                        │
└─────────────────────────────────────────────────────────┘
```

---

## Key Components

### 1. **ZitadelAuthService** (`src/lib/zitadel-auth.ts`)
- Manages authentication lifecycle
- Handles token storage and retrieval
- Provides token refresh functionality

### 2. **AuthContext** (`src/contexts/AuthContext.tsx`)
- React context providing auth state to components
- Wraps ZitadelAuthService for React integration
- Manages loading states and user info

### 3. **API Client** (`src/lib/api.ts`)
- Wraps fetch with automatic token injection
- Adds `Authorization: Bearer <token>` header
- Handles API request/response logic

### 4. **Callback Pages**
- `src/pages/auth-callback.tsx` - Handles main auth callback
- `src/pages/silent-callback.tsx` - Handles silent refresh

---

## Security Considerations

### ✅ Good Practices Implemented:
1. **Tokens stored in HttpOnly cookies would be better** - Currently in regular cookies (can be accessed by JS)
2. **HTTPS in production** - Required for secure token transmission
3. **Token expiration** - Access tokens expire, reducing risk of theft
4. **Refresh token rotation** - Should be implemented for enhanced security
5. **CORS configuration** - Backend should validate origin

### ⚠️ Security Notes:
- Tokens are visible in browser storage/cookies
- XSS attacks could steal tokens (mitigate with CSP headers)
- CSRF protection needed (consider SameSite cookie attributes)
- Backend MUST validate token signature and expiration

---

## Troubleshooting

### Common Issues:

1. **Token Expired**
   - Check if `user.expired` is true
   - Trigger `refreshToken()` to get new token
   - If refresh fails, user must re-login

2. **Missing Authorization Header**
   - Verify `zitadelAuth.getAccessToken()` returns token
   - Check if user is authenticated: `zitadelAuth.isAuthenticated()`

3. **Backend Rejects Token**
   - Verify backend has correct Zitadel public keys
   - Check token audience matches backend expectation
   - Ensure token hasn't expired

4. **Silent Refresh Fails**
   - Check `silent_redirect_uri` is correctly configured
   - Verify Zitadel allows silent refresh
   - Check browser blocks third-party cookies

---

## Backend Integration Requirements

For the backend to accept these tokens:

1. **Token Validation:**
   - Verify JWT signature using Zitadel's public keys (JWKS endpoint)
   - Check token expiration (`exp` claim)
   - Validate token audience (`aud` claim) if configured
   - Verify issuer (`iss` claim) matches Zitadel instance

2. **User Identity Extraction:**
   - Read user ID from token claims (typically `sub` claim)
   - Extract email, name, etc. from token claims
   - Map to internal user records if needed

3. **API Endpoint Protection:**
   - Extract token from `Authorization: Bearer <token>` header
   - Validate token before processing request
   - Return 401 if token invalid/expired
   - Return 403 if user lacks required permissions

---

## References

- **Zitadel Documentation:** https://zitadel.com/docs
- **OAuth 2.0 Specification:** https://oauth.net/2/
- **OpenID Connect:** https://openid.net/connect/
- **JWT Specification:** https://jwt.io/

---

## Summary

**The frontend doesn't create tokens - it receives them from Zitadel through OAuth 2.0 flow:**

1. User logs in → Redirected to Zitadel
2. User authenticates → Zitadel issues authorization code
3. Frontend exchanges code → Receives access token, refresh token, ID token
4. Tokens stored → In memory, cookies, and browser storage
5. Tokens used → Sent as `Authorization: Bearer <token>` in API requests
6. Backend validates → Verifies JWT signature and extracts user identity

The token is a **JWT** issued by Zitadel, signed with Zitadel's private key. The backend validates it using Zitadel's public keys and extracts user information from the token's claims.

