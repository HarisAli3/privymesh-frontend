# User Profile Management - Frontend to Backend to Zitadel

This document explains how to implement user profile management features where the frontend sends requests to the backend, and the backend communicates with Zitadel to update user information.

---

## Overview

**Flow:**
```
Frontend (POST) → Backend API → Zitadel Management API → Backend → Frontend (Response)
```

Users can:
1. **Update Email** - Change their email address
2. **Update Name** - Change their display name
3. **Delete Account** - Permanently delete their account

---

## Frontend Implementation

### 1. API Functions (src/lib/api.ts)

Add these functions to your API client:

```typescript
// Update user profile (email and/or name)
export interface UpdateProfileRequest {
  email?: string;
  name?: string;
}

export interface UpdateProfileResponse {
  user_id: string;
  email: string;
  name: string;
  message?: string;
}

export async function updateProfile(payload: UpdateProfileRequest): Promise<UpdateProfileResponse> {
  return request<UpdateProfileResponse>('/api/user/profile', 'POST', payload);
}

// Delete user account
export interface DeleteAccountResponse {
  message: string;
}

export async function deleteAccount(): Promise<DeleteAccountResponse> {
  return request<DeleteAccountResponse>('/api/user/delete', 'POST');
}
```

### 2. Frontend Request Format

**Update Profile:**
```http
POST /api/user/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "email": "newemail@example.com",  // Optional
  "name": "New Name"                  // Optional
}
```

**Response:**
```json
{
  "user_id": "user-id-from-zitadel",
  "email": "newemail@example.com",
  "name": "New Name",
  "message": "Profile updated successfully"
}
```

**Delete Account:**
```http
POST /api/user/delete
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Response:**
```json
{
  "message": "Account deleted successfully"
}
```

---

## Backend Implementation (Go)

### 1. Zitadel Management API Setup

The backend needs to use Zitadel's Management API to update/delete users. This requires:

#### A. Service Account (Machine User)

Create a **Service Account** in Zitadel with:
- **Management API Permissions** (user.read, user.write, user.delete)
- **Personal Access Token** or **Client Credentials**

#### B. Required Go Packages

```bash
go get github.com/zitadel/zitadel-go/v2
```

Or use HTTP client to call Zitadel Management API directly:

```bash
go get github.com/go-resty/resty/v2
```

### 2. Backend Configuration

```go
package config

type ZitadelConfig struct {
    InstanceURL      string // e.g., "http://localhost:8080"
    ManagementToken  string // Service account PAT
    ManagementAPIURL string // e.g., "http://localhost:8080/management/v1"
}
```

**Environment Variables:**
```bash
export ZITADEL_INSTANCE_URL=http://localhost:8080
export ZITADEL_MANAGEMENT_TOKEN=your-service-account-pat
export ZITADEL_MANAGEMENT_API_URL=http://localhost:8080/management/v1
```

### 3. Backend API Endpoints

#### A. Update User Profile Endpoint

```go
package handlers

import (
    "encoding/json"
    "net/http"
    
    "your-project/auth"
    "your-project/middleware"
)

type UpdateProfileRequest struct {
    Email *string `json:"email"`
    Name  *string `json:"name"`
}

type UpdateProfileResponse struct {
    UserID  string `json:"user_id"`
    Email   string `json:"email"`
    Name    string `json:"name"`
    Message string `json:"message,omitempty"`
}

// UpdateProfile handles POST /api/user/profile
func UpdateProfile(zitadelClient *ZitadelClient) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        // Get authenticated user ID from token
        userID := middleware.GetUserID(r)
        if userID == "" {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }

        // Parse request body
        var req UpdateProfileRequest
        if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
            http.Error(w, "Invalid request body", http.StatusBadRequest)
            return
        }

        // Update user in Zitadel
        updatedUser, err := zitadelClient.UpdateUser(r.Context(), userID, req)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        // Return updated user info
        response := UpdateProfileResponse{
            UserID:  updatedUser.ID,
            Email:   updatedUser.Email,
            Name:    updatedUser.Name,
            Message: "Profile updated successfully",
        }

        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(response)
    }
}
```

#### B. Delete User Account Endpoint

```go
type DeleteAccountResponse struct {
    Message string `json:"message"`
}

// DeleteAccount handles POST /api/user/delete
func DeleteAccount(zitadelClient *ZitadelClient) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        // Get authenticated user ID from token
        userID := middleware.GetUserID(r)
        if userID == "" {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }

        // Delete user from Zitadel
        err := zitadelClient.DeleteUser(r.Context(), userID)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        // Clean up local data (if any)
        // ... delete user's peers, data, etc.

        response := DeleteAccountResponse{
            Message: "Account deleted successfully",
        }

        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusOK)
        json.NewEncoder(w).Encode(response)
    }
}
```

### 4. Zitadel Management API Client

```go
package zitadel

import (
    "bytes"
    "context"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
)

type ZitadelClient struct {
    baseURL string
    token   string
    client  *http.Client
}

func NewZitadelClient(instanceURL, managementToken string) *ZitadelClient {
    return &ZitadelClient{
        baseURL: instanceURL + "/management/v1",
        token:   managementToken,
        client:  &http.Client{},
    }
}

type UserUpdateRequest struct {
    Email *string `json:"email,omitempty"`
    Name  *string `json:"displayName,omitempty"`
}

type ZitadelUser struct {
    ID          string `json:"id"`
    Email       string `json:"email"`
    DisplayName string `json:"displayName"`
}

// UpdateUser updates a user in Zitadel
func (c *ZitadelClient) UpdateUser(ctx context.Context, userID string, req UpdateProfileRequest) (*ZitadelUser, error) {
    // Build update payload
    updateReq := UserUpdateRequest{}
    if req.Email != nil {
        updateReq.Email = req.Email
    }
    if req.Name != nil {
        updateReq.Name = req.Name
    }

    // Marshal to JSON
    body, err := json.Marshal(updateReq)
    if err != nil {
        return nil, fmt.Errorf("failed to marshal request: %w", err)
    }

    // Create HTTP request
    url := fmt.Sprintf("%s/users/me", c.baseURL)
    httpReq, err := http.NewRequestWithContext(ctx, "PUT", url, bytes.NewBuffer(body))
    if err != nil {
        return nil, fmt.Errorf("failed to create request: %w", err)
    }

    // Set headers
    httpReq.Header.Set("Authorization", "Bearer "+c.token)
    httpReq.Header.Set("Content-Type", "application/json")

    // Execute request
    resp, err := c.client.Do(httpReq)
    if err != nil {
        return nil, fmt.Errorf("failed to execute request: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        bodyBytes, _ := io.ReadAll(resp.Body)
        return nil, fmt.Errorf("zitadel API error: %s - %s", resp.Status, string(bodyBytes))
    }

    // Parse response
    var user ZitadelUser
    if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
        return nil, fmt.Errorf("failed to decode response: %w", err)
    }

    return &user, nil
}

// DeleteUser deletes a user from Zitadel
func (c *ZitadelClient) DeleteUser(ctx context.Context, userID string) error {
    // Create HTTP request
    url := fmt.Sprintf("%s/users/%s", c.baseURL, userID)
    httpReq, err := http.NewRequestWithContext(ctx, "DELETE", url, nil)
    if err != nil {
        return fmt.Errorf("failed to create request: %w", err)
    }

    // Set headers
    httpReq.Header.Set("Authorization", "Bearer "+c.token)

    // Execute request
    resp, err := c.client.Do(httpReq)
    if err != nil {
        return fmt.Errorf("failed to execute request: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusNoContent {
        bodyBytes, _ := io.ReadAll(resp.Body)
        return fmt.Errorf("zitadel API error: %s - %s", resp.Status, string(bodyBytes))
    }

    return nil
}
```

### 5. Alternative: Using Zitadel Go SDK

If using the official Zitadel Go SDK:

```go
import (
    "context"
    "github.com/zitadel/zitadel-go/v2/pkg/client/management"
    "google.golang.org/grpc"
)

type ZitadelSDKClient struct {
    client *management.Client
}

func NewZitadelSDKClient(ctx context.Context, instanceURL, pat string) (*ZitadelSDKClient, error) {
    client, err := management.NewClient(
        ctx,
        instanceURL,
        pat,
        grpc.WithInsecure(), // Use grpc.WithTransportCredentials for production
    )
    if err != nil {
        return nil, err
    }

    return &ZitadelSDKClient{client: client}, nil
}

func (c *ZitadelSDKClient) UpdateUser(ctx context.Context, userID string, email, name *string) error {
    req := &management.UpdateUserRequest{
        UserId: userID,
    }

    if email != nil {
        req.Email = &management.Email{
            Email: *email,
        }
    }

    if name != nil {
        req.DisplayName = *name
    }

    _, err := c.client.UpdateUser(ctx, req)
    return err
}

func (c *ZitadelSDKClient) DeleteUser(ctx context.Context, userID string) error {
    _, err := c.client.RemoveUser(ctx, &management.RemoveUserRequest{
        UserId: userID,
    })
    return err
}
```

### 6. Route Registration

```go
func setupRoutes(mux *http.ServeMux, zitadelClient *zitadel.ZitadelClient, authMiddleware *middleware.AuthMiddleware) {
    // User profile endpoints
    mux.HandleFunc("/api/user/profile", authMiddleware.RequireAuth(handlers.UpdateProfile(zitadelClient)))
    mux.HandleFunc("/api/user/delete", authMiddleware.RequireAuth(handlers.DeleteAccount(zitadelClient)))
}
```

---

## Zitadel Management API Details

### Update User Endpoint

**Endpoint:** `PUT /management/v1/users/{userId}` or `PUT /management/v1/users/me`

**Headers:**
```
Authorization: Bearer <management-api-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "newemail@example.com",        // Optional
  "displayName": "New Name"                // Optional
}
```

**Response:**
```json
{
  "id": "user-id",
  "email": "newemail@example.com",
  "displayName": "New Name",
  ...
}
```

### Delete User Endpoint

**Endpoint:** `DELETE /management/v1/users/{userId}`

**Headers:**
```
Authorization: Bearer <management-api-token>
```

**Response:**
```
204 No Content
```

---

## Security Considerations

### 1. Service Account Permissions

The service account must have:
- `user.read` - To read user information
- `user.write` - To update user information
- `user.delete` - To delete users

**OR** use a Personal Access Token (PAT) with appropriate scopes.

### 2. User ID Validation

Always validate that the authenticated user (from JWT token) matches the user being updated/deleted:

```go
// ✅ GOOD - User can only update themselves
userID := middleware.GetUserID(r)  // From JWT token

// ❌ BAD - Don't allow user ID in request body
var req struct {
    UserID string `json:"user_id"`  // Don't trust this!
}
```

### 3. Email Verification

If updating email, consider:
- Sending verification email through Zitadel
- Requiring current password confirmation
- Temporary email change until verified

### 4. Account Deletion

- Require explicit confirmation (e.g., type "DELETE" in a field)
- Delete all associated data (peers, tokens, etc.)
- Log the deletion action
- Consider soft-delete (mark as deleted, don't remove immediately)

---

## Error Handling

### Common Errors

**1. Invalid Token (401)**
```json
{
  "status": 401,
  "message": "Unauthorized: Invalid or expired token"
}
```

**2. Insufficient Permissions (403)**
```json
{
  "status": 403,
  "message": "You don't have permission to perform this action"
}
```

**3. Email Already Exists (409)**
```json
{
  "status": 409,
  "message": "Email address is already in use"
}
```

**4. Validation Error (400)**
```json
{
  "status": 400,
  "message": "Invalid email format"
}
```

**5. Zitadel API Error (502)**
```json
{
  "status": 502,
  "message": "Failed to communicate with identity provider"
}
```

---

## Testing

### Frontend Testing

```typescript
// Update profile
const updated = await updateProfile({
  email: 'newemail@example.com',
  name: 'New Name'
});

// Delete account
const result = await deleteAccount();
```

### Backend Testing

```go
func TestUpdateProfile(t *testing.T) {
    // Setup test client
    client := zitadel.NewZitadelClient("http://localhost:8080", testToken)
    
    // Test update
    user, err := client.UpdateUser(ctx, testUserID, &UpdateProfileRequest{
        Email: stringPtr("new@example.com"),
    })
    
    assert.NoError(t, err)
    assert.Equal(t, "new@example.com", user.Email)
}
```

---

## Implementation Checklist

### Frontend
- [ ] Add `updateProfile` function to `api.ts`
- [ ] Add `deleteAccount` function to `api.ts`
- [ ] Update `settings.tsx` to use real API calls
- [ ] Add error handling and loading states
- [ ] Add confirmation dialog for account deletion
- [ ] Update AuthContext after profile update

### Backend
- [ ] Create Zitadel Management API client
- [ ] Add `PUT /api/user/profile` endpoint
- [ ] Add `POST /api/user/delete` endpoint
- [ ] Configure service account/PAT
- [ ] Add validation and error handling
- [ ] Clean up user data on deletion
- [ ] Add logging for audit trail

### Security
- [ ] Verify service account permissions
- [ ] Validate user ID from token (not request)
- [ ] Add rate limiting
- [ ] Require confirmation for account deletion
- [ ] Log all profile changes

---

## References

- **Zitadel Management API:** https://zitadel.com/docs/apis/resources/mgmt
- **Zitadel Go SDK:** https://github.com/zitadel/zitadel-go
- **OAuth 2.0 Service Accounts:** https://zitadel.com/docs/guides/integrate/service-users

---

## Summary

**Flow:**
1. Frontend sends POST request with Bearer token
2. Backend validates token and extracts user ID
3. Backend calls Zitadel Management API with service account token
4. Zitadel updates/deletes user
5. Backend returns response to frontend
6. Frontend updates UI and/or redirects

**Key Points:**
- Frontend uses user's access token for authentication
- Backend uses service account token to call Management API
- User can only update/delete their own account
- Always validate user ID from JWT token, not request body
