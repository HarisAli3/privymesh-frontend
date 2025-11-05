# Go Backend Implementation for Zitadel Token Validation

This guide explains how to implement JWT token validation in your Go backend to work with tokens issued by Zitadel from the frontend.

---

## Table of Contents

1. [Overview](#overview)
2. [Required Packages](#required-packages)
3. [Zitadel Configuration](#zitadel-configuration)
4. [JWT Token Validation](#jwt-token-validation)
5. [JWKS Key Fetching](#jwks-key-fetching)
6. [Middleware Implementation](#middleware-implementation)
7. [User Information Extraction](#user-information-extraction)
8. [Complete Example](#complete-example)
9. [API Endpoint Protection](#api-endpoint-protection)
10. [Error Handling](#error-handling)
11. [Security Best Practices](#security-best-practices)
12. [Testing](#testing)

---

## Overview

Your frontend sends Zitadel-issued JWT tokens in the `Authorization: Bearer <token>` header. The Go backend must:

1. Extract the token from the HTTP header
2. Validate the JWT signature using Zitadel's public keys (JWKS)
3. Verify token expiration, issuer, and audience
4. Extract user information from token claims
5. Use the user information for authorization

**Token Format:**
```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjM0NDUwMTA0NTY3MTQ5MzYzNSIsInR5cCI6IkpXVCJ9...
```

---

## Required Packages

Add these dependencies to your `go.mod`:

```bash
go get github.com/golang-jwt/jwt/v5
go get github.com/lestrrat-go/jwx/v2
go get github.com/lestrrat-go/jwx/v2/jwk
```

Or manually add to `go.mod`:

```go
require (
    github.com/golang-jwt/jwt/v5 v5.2.0
    github.com/lestrrat-go/jwx/v2 v2.0.20
)
```

**Alternative (simpler, recommended):**

```bash
go get github.com/lestrrat-go/jwx/v2
```

The `jwx` library handles both JWT parsing and JWKS key fetching.

---

## Zitadel Configuration

Create a configuration file or use environment variables:

```go
package config

type ZitadelConfig struct {
    InstanceURL  string // e.g., "http://localhost:8080"
    JWKSEndpoint string // e.g., "http://localhost:8080/oauth/v2/keys"
    Audience     string // Your client ID or audience value (optional)
}

func LoadConfig() ZitadelConfig {
    return ZitadelConfig{
        InstanceURL:  getEnv("ZITADEL_INSTANCE_URL", "http://localhost:8080"),
        JWKSEndpoint: getEnv("ZITADEL_JWKS_URL", ""),
        Audience:     getEnv("ZITADEL_AUDIENCE", ""),
    }
}

func getEnv(key, defaultValue string) string {
    if value := os.Getenv(key); value != "" {
        return value
    }
    return defaultValue
}
```

**Environment Variables:**
```bash
export ZITADEL_INSTANCE_URL=http://localhost:8080
export ZITADEL_JWKS_URL=http://localhost:8080/oauth/v2/keys
export ZITADEL_AUDIENCE=344501045671493635  # Optional: your client ID
```

**JWKS Endpoint:**
The JWKS (JSON Web Key Set) endpoint is typically:
- `{ZITADEL_INSTANCE_URL}/oauth/v2/keys`
- Or `{ZITADEL_INSTANCE_URL}/.well-known/jwks.json`

---

## JWT Token Validation

### Step 1: Parse and Validate JWT

```go
package auth

import (
    "crypto/rsa"
    "fmt"
    "net/http"
    "strings"
    "time"

    "github.com/lestrrat-go/jwx/v2/jwk"
    "github.com/lestrrat-go/jwx/v2/jwt"
)

type TokenValidator struct {
    keySet    jwk.Set
    issuer    string
    audience  string
    keySetURL string
}

func NewTokenValidator(zitadelURL, audience string) (*TokenValidator, error) {
    jwksURL := zitadelURL + "/oauth/v2/keys"
    if !strings.HasPrefix(zitadelURL, "http") {
        jwksURL = "http://" + zitadelURL + "/oauth/v2/keys"
    }

    // Fetch and cache the JWKS
    keySet, err := jwk.Fetch(context.Background(), jwksURL)
    if err != nil {
        return nil, fmt.Errorf("failed to fetch JWKS: %w", err)
    }

    return &TokenValidator{
        keySet:    keySet,
        issuer:    zitadelURL,
        audience:  audience,
        keySetURL: jwksURL,
    }, nil
}

// RefreshJWKS refreshes the cached JWKS keys (call periodically)
func (tv *TokenValidator) RefreshJWKS(ctx context.Context) error {
    keySet, err := jwk.Fetch(ctx, tv.keySetURL)
    if err != nil {
        return fmt.Errorf("failed to refresh JWKS: %w", err)
    }
    tv.keySet = keySet
    return nil
}
```

### Step 2: Extract Token from Request

```go
// ExtractToken extracts the Bearer token from the Authorization header
func ExtractToken(r *http.Request) (string, error) {
    authHeader := r.Header.Get("Authorization")
    if authHeader == "" {
        return "", fmt.Errorf("authorization header missing")
    }

    parts := strings.Split(authHeader, " ")
    if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
        return "", fmt.Errorf("invalid authorization header format")
    }

    return parts[1], nil
}
```

### Step 3: Validate Token

```go
// ValidateToken validates the JWT token and returns the claims
func (tv *TokenValidator) ValidateToken(ctx context.Context, tokenString string) (jwt.Token, error) {
    // Parse and verify the token
    token, err := jwt.Parse(
        []byte(tokenString),
        jwt.WithKeySet(tv.keySet),
        jwt.WithValidate(true),
        jwt.WithIssuer(tv.issuer),
        jwt.WithClock(jwt.ClockFunc(func() time.Time {
            return time.Now()
        })),
    )
    if err != nil {
        return nil, fmt.Errorf("token validation failed: %w", err)
    }

    // Validate audience if configured
    if tv.audience != "" {
        if err := jwt.Validate(token, jwt.WithAudience(tv.audience)); err != nil {
            return nil, fmt.Errorf("token audience validation failed: %w", err)
        }
    }

    return token, nil
}
```

---

## JWKS Key Fetching

JWKS (JSON Web Key Set) contains Zitadel's public keys used to verify JWT signatures.

### Automatic Key Caching and Refresh

```go
package auth

import (
    "context"
    "sync"
    "time"
)

type JWKSCache struct {
    keySet    jwk.Set
    mutex     sync.RWMutex
    url       string
    lastFetch time.Time
    ttl       time.Duration
}

func NewJWKSCache(jwksURL string) *JWKSCache {
    return &JWKSCache{
        url: jwksURL,
        ttl: 1 * time.Hour, // Cache for 1 hour
    }
}

func (c *JWKSCache) GetKeySet(ctx context.Context) (jwk.Set, error) {
    c.mutex.RLock()
    if c.keySet != nil && time.Since(c.lastFetch) < c.ttl {
        keySet := c.keySet
        c.mutex.RUnlock()
        return keySet, nil
    }
    c.mutex.RUnlock()

    // Fetch new keys
    c.mutex.Lock()
    defer c.mutex.Unlock()

    // Double-check after acquiring write lock
    if c.keySet != nil && time.Since(c.lastFetch) < c.ttl {
        return c.keySet, nil
    }

    keySet, err := jwk.Fetch(ctx, c.url)
    if err != nil {
        return nil, err
    }

    c.keySet = keySet
    c.lastFetch = time.Now()
    return keySet, nil
}
```

---

## Middleware Implementation

Create a middleware that validates tokens for protected routes:

```go
package middleware

import (
    "context"
    "encoding/json"
    "net/http"
    "strings"

    "your-project/auth"
)

type AuthMiddleware struct {
    validator *auth.TokenValidator
}

func NewAuthMiddleware(validator *auth.TokenValidator) *AuthMiddleware {
    return &AuthMiddleware{
        validator: validator,
    }
}

// RequireAuth is a middleware that validates JWT tokens
func (m *AuthMiddleware) RequireAuth(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        // Extract token
        tokenString, err := auth.ExtractToken(r)
        if err != nil {
            http.Error(w, "Unauthorized: "+err.Error(), http.StatusUnauthorized)
            return
        }

        // Validate token
        token, err := m.validator.ValidateToken(r.Context(), tokenString)
        if err != nil {
            http.Error(w, "Unauthorized: Invalid token", http.StatusUnauthorized)
            return
        }

        // Store token claims in request context
        ctx := context.WithValue(r.Context(), "token", token)
        ctx = context.WithValue(ctx, "user_id", token.Subject())

        next.ServeHTTP(w, r.WithContext(ctx))
    }
}

// GetUserID extracts user ID from request context
func GetUserID(r *http.Request) string {
    if userID, ok := r.Context().Value("user_id").(string); ok {
        return userID
    }
    return ""
}

// GetToken extracts the validated token from request context
func GetToken(r *http.Request) jwt.Token {
    if token, ok := r.Context().Value("token").(jwt.Token); ok {
        return token
    }
    return nil
}
```

---

## User Information Extraction

Extract user information from token claims:

```go
package auth

import (
    "github.com/lestrrat-go/jwx/v2/jwt"
)

type UserInfo struct {
    ID            string
    Email         string
    Name          string
    EmailVerified bool
    Issuer        string
    Audience      []string
    ExpiresAt     time.Time
    IssuedAt      time.Time
}

// ExtractUserInfo extracts user information from validated token
func ExtractUserInfo(token jwt.Token) UserInfo {
    userInfo := UserInfo{
        ID:       token.Subject(),
        Issuer:   token.Issuer(),
        Audience: token.Audience(),
    }

    // Extract custom claims
    if email, ok := token.Get("email"); ok {
        if emailStr, ok := email.(string); ok {
            userInfo.Email = emailStr
        }
    }

    if name, ok := token.Get("name"); ok {
        if nameStr, ok := name.(string); ok {
            userInfo.Name = nameStr
        }
    }

    if emailVerified, ok := token.Get("email_verified"); ok {
        if verified, ok := emailVerified.(bool); ok {
            userInfo.EmailVerified = verified
        }
    }

    if exp, ok := token.Expiration(); ok {
        userInfo.ExpiresAt = exp
    }

    if iat, ok := token.IssuedAt(); ok {
        userInfo.IssuedAt = iat
    }

    return userInfo
}
```

---

## Complete Example

Here's a complete working example:

```go
package main

import (
    "context"
    "encoding/json"
    "log"
    "net/http"
    "os"
    "time"

    "your-project/auth"
    "your-project/middleware"
)

func main() {
    // Load configuration
    zitadelURL := os.Getenv("ZITADEL_INSTANCE_URL")
    if zitadelURL == "" {
        zitadelURL = "http://localhost:8080"
    }

    audience := os.Getenv("ZITADEL_AUDIENCE") // Optional

    // Initialize token validator
    validator, err := auth.NewTokenValidator(zitadelURL, audience)
    if err != nil {
        log.Fatalf("Failed to initialize token validator: %v", err)
    }

    // Refresh JWKS every hour
    go func() {
        ticker := time.NewTicker(1 * time.Hour)
        defer ticker.Stop()
        for range ticker.C {
            if err := validator.RefreshJWKS(context.Background()); err != nil {
                log.Printf("Failed to refresh JWKS: %v", err)
            }
        }
    }()

    // Create middleware
    authMiddleware := middleware.NewAuthMiddleware(validator)

    // Setup routes
    mux := http.NewServeMux()

    // Public endpoint
    mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
        json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
    })

    // Protected endpoints
    mux.HandleFunc("/api/user", authMiddleware.RequireAuth(getUser))
    mux.HandleFunc("/api/peers", authMiddleware.RequireAuth(getPeers))
    mux.HandleFunc("/api/peers", authMiddleware.RequireAuth(createPeer)).Methods("POST")
    mux.HandleFunc("/api/peers/{id}", authMiddleware.RequireAuth(deletePeer)).Methods("DELETE")
    mux.HandleFunc("/api/stats", authMiddleware.RequireAuth(getStats))

    log.Println("Server starting on :8090")
    log.Fatal(http.ListenAndServe(":8090", mux))
}

// Example protected endpoint handlers
func getUser(w http.ResponseWriter, r *http.Request) {
    userID := middleware.GetUserID(r)
    token := middleware.GetToken(r)

    userInfo := auth.ExtractUserInfo(token)

    response := map[string]interface{}{
        "user_id": userID,
        "email":   userInfo.Email,
        "name":    userInfo.Name,
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}

func getPeers(w http.ResponseWriter, r *http.Request) {
    userID := middleware.GetUserID(r)

    // Your logic to get peers for this user
    peers := []interface{}{} // Replace with actual data

    response := map[string]interface{}{
        "peers": peers,
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}

func createPeer(w http.ResponseWriter, r *http.Request) {
    userID := middleware.GetUserID(r)

    // Parse request body
    var payload struct {
        Name      string `json:"name"`
        PublicKey string `json:"public_key"`
        IPAddress string `json:"ip_address"`
    }

    if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
        http.Error(w, "Invalid request body", http.StatusBadRequest)
        return
    }

    // Your logic to create peer for this user
    // ...

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(map[string]string{"status": "created"})
}

func deletePeer(w http.ResponseWriter, r *http.Request) {
    userID := middleware.GetUserID(r)

    // Extract peer ID from URL
    // ...

    // Your logic to delete peer for this user
    // ...

    w.WriteHeader(http.StatusNoContent)
}

func getStats(w http.ResponseWriter, r *http.Request) {
    // Your logic to get stats
    stats := map[string]interface{}{
        "total_peers":     0,
        "uptime_seconds": 0,
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(stats)
}
```

---

## API Endpoint Protection

### Option 1: Using Middleware (Recommended)

```go
// All routes in /api/* require authentication
api := mux.PathPrefix("/api").Subrouter()
api.Use(authMiddleware.RequireAuth)
api.HandleFunc("/user", getUser)
api.HandleFunc("/peers", getPeers)
```

### Option 2: Per-Route Protection

```go
mux.HandleFunc("/api/user", authMiddleware.RequireAuth(getUser))
mux.HandleFunc("/api/public", publicHandler) // No auth required
```

### Option 3: Using Chi Router

```go
import "github.com/go-chi/chi/v5"

r := chi.NewRouter()
r.Use(authMiddleware.RequireAuth)
r.Route("/api", func(r chi.Router) {
    r.Get("/user", getUser)
    r.Get("/peers", getPeers)
})
```

---

## Error Handling

Create standardized error responses:

```go
package errors

import (
    "encoding/json"
    "net/http"
)

type APIError struct {
    Status  int    `json:"status"`
    Message string `json:"message"`
    Code    string `json:"code,omitempty"`
}

func WriteError(w http.ResponseWriter, status int, message string) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(APIError{
        Status:  status,
        Message: message,
    })
}

// Usage in middleware
func (m *AuthMiddleware) RequireAuth(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        tokenString, err := auth.ExtractToken(r)
        if err != nil {
            errors.WriteError(w, http.StatusUnauthorized, "Missing or invalid authorization header")
            return
        }

        token, err := m.validator.ValidateToken(r.Context(), tokenString)
        if err != nil {
            errors.WriteError(w, http.StatusUnauthorized, "Invalid or expired token")
            return
        }

        // ... rest of middleware
    }
}
```

---

## Security Best Practices

### 1. Always Validate Token Signature
Never trust tokens without validating the signature against Zitadel's public keys.

### 2. Check Token Expiration
```go
if exp, ok := token.Expiration(); ok {
    if exp.Before(time.Now()) {
        return fmt.Errorf("token expired")
    }
}
```

### 3. Validate Issuer
Ensure the token was issued by your Zitadel instance:
```go
if token.Issuer() != expectedIssuer {
    return fmt.Errorf("invalid issuer")
}
```

### 4. Validate Audience (if configured)
```go
if audience != "" {
    if !contains(token.Audience(), audience) {
        return fmt.Errorf("invalid audience")
    }
}
```

### 5. Cache JWKS Keys
Fetch JWKS keys once and cache them (with periodic refresh).

### 6. Use HTTPS in Production
Always use HTTPS to prevent token interception.

### 7. Set Security Headers
```go
w.Header().Set("X-Content-Type-Options", "nosniff")
w.Header().Set("X-Frame-Options", "DENY")
w.Header().Set("X-XSS-Protection", "1; mode=block")
```

### 8. Rate Limiting
Implement rate limiting to prevent brute force attacks.

---

## Testing

### Test Token Validation

```go
package auth_test

import (
    "context"
    "testing"
    "time"

    "your-project/auth"
)

func TestTokenValidation(t *testing.T) {
    validator, err := auth.NewTokenValidator("http://localhost:8080", "")
    if err != nil {
        t.Fatalf("Failed to create validator: %v", err)
    }

    // You'll need a real token from your frontend for testing
    tokenString := "eyJhbGciOiJSUzI1NiIs..." // Real token from frontend

    token, err := validator.ValidateToken(context.Background(), tokenString)
    if err != nil {
        t.Fatalf("Token validation failed: %v", err)
    }

    userInfo := auth.ExtractUserInfo(token)
    if userInfo.ID == "" {
        t.Error("User ID should not be empty")
    }
}
```

### Test Middleware

```go
func TestAuthMiddleware(t *testing.T) {
    validator, _ := auth.NewTokenValidator("http://localhost:8080", "")
    middleware := middleware.NewAuthMiddleware(validator)

    // Create a test request with token
    req := httptest.NewRequest("GET", "/api/user", nil)
    req.Header.Set("Authorization", "Bearer <valid-token>")

    // Test handler
    handler := middleware.RequireAuth(func(w http.ResponseWriter, r *http.Request) {
        userID := middleware.GetUserID(r)
        if userID == "" {
            t.Error("User ID should be set")
        }
    })

    w := httptest.NewRecorder()
    handler(w, req)

    if w.Code != http.StatusOK {
        t.Errorf("Expected status 200, got %d", w.Code)
    }
}
```

---

## Environment Variables Summary

```bash
# Zitadel Configuration
export ZITADEL_INSTANCE_URL=http://localhost:8080
export ZITADEL_JWKS_URL=http://localhost:8080/oauth/v2/keys  # Optional, auto-generated
export ZITADEL_AUDIENCE=344501045671493635  # Optional, your client ID

# Server Configuration
export PORT=8090
export API_BASE_URL=http://localhost:8090
```

---

## Quick Start Checklist

- [ ] Install required Go packages (`github.com/lestrrat-go/jwx/v2`)
- [ ] Set up Zitadel configuration (instance URL, audience)
- [ ] Create `TokenValidator` struct
- [ ] Implement JWKS fetching and caching
- [ ] Create `ExtractToken` function
- [ ] Create `ValidateToken` function
- [ ] Create authentication middleware
- [ ] Extract user info from token claims
- [ ] Protect API endpoints with middleware
- [ ] Test with real tokens from frontend
- [ ] Set up periodic JWKS refresh
- [ ] Configure environment variables
- [ ] Add error handling
- [ ] Set security headers
- [ ] Test token expiration handling

---

## Troubleshooting

### Token Validation Fails

1. **Check JWKS endpoint:** Ensure `{ZITADEL_INSTANCE_URL}/oauth/v2/keys` is accessible
2. **Check token format:** Ensure token is properly extracted from `Authorization: Bearer <token>`
3. **Check issuer:** Verify token issuer matches your Zitadel instance URL
4. **Check expiration:** Tokens expire - ensure you're not using expired tokens
5. **Check audience:** If configured, ensure token audience matches

### JWKS Fetch Fails

1. **Network connectivity:** Ensure backend can reach Zitadel instance
2. **URL format:** Ensure JWKS URL is correct
3. **HTTPS/HTTP:** Match the protocol (http vs https)

### User ID is Empty

1. **Check token subject:** Token `sub` claim should contain user ID
2. **Check token claims:** Verify token contains expected claims
3. **Debug token:** Decode token at jwt.io to inspect claims

---

## References

- **Zitadel Documentation:** https://zitadel.com/docs/apis/openidoauth
- **JWT Specification:** https://tools.ietf.org/html/rfc7519
- **JWKS Specification:** https://tools.ietf.org/html/rfc7517
- **jwx Library:** https://github.com/lestrrat-go/jwx
- **Go JWT Library:** https://github.com/golang-jwt/jwt

---

## Summary

To implement Zitadel token validation in Go:

1. **Fetch JWKS** from Zitadel's `/oauth/v2/keys` endpoint
2. **Validate JWT** signature using JWKS keys
3. **Check expiration, issuer, audience**
4. **Extract user info** from token claims
5. **Protect endpoints** with middleware
6. **Handle errors** gracefully

The token validation ensures only authenticated users with valid Zitadel-issued tokens can access your API endpoints.

