import zitadelAuth from './zitadel-auth';
import getEnv from './env';

const API_BASE_URL = getEnv('API_BASE_URL') || 'http://localhost:8090';

type HttpMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT';

// Helper to get valid access token, refreshing if needed
async function getValidAccessToken(): Promise<string | null> {
  // Check if token exists and is valid
  if (zitadelAuth.isAuthenticated() && !zitadelAuth.isTokenExpired()) {
    const token = zitadelAuth.getAccessToken();
    if (token) {
      return token;
    }
  }

  // Token expired or missing, try to refresh
  try {
    const refreshedUser = await zitadelAuth.refreshToken();
    return refreshedUser.access_token || null;
  } catch (error) {
    console.error('Token refresh failed:', error);
    // If refresh fails, return current token anyway (might work if close to expiration)
    return zitadelAuth.getAccessToken();
  }
}

async function request<T>(path: string, method: HttpMethod = 'GET', body?: unknown): Promise<T> {
  // Get valid token, refreshing if expired
  const token = await getValidAccessToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('No access token available for request:', path);
  }

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    });

    if (!res.ok) {
      let errorMessage = `Request failed with status ${res.status}`;
      try {
        const errorData = await res.json().catch(() => null);
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        } else {
          const text = await res.text().catch(() => '');
          if (text) {
            // Try to parse as JSON
            try {
              const parsed = JSON.parse(text);
              errorMessage = parsed.message || text;
            } catch {
              errorMessage = text;
            }
          }
        }
      } catch (e) {
        // Fallback to status text
        errorMessage = res.statusText || `Request failed with status ${res.status}`;
      }
      
      // Handle authentication errors with more context
      if (res.status === 401) {
        // Try to get detailed error from backend
        let backendError = '';
        try {
          const errorText = await res.text();
          try {
            const errorJson = JSON.parse(errorText);
            backendError = errorJson.message || errorText;
          } catch {
            backendError = errorText;
          }
        } catch {
          backendError = 'Unknown error';
        }
        
        console.error('401 Unauthorized - Token details:', {
          hasToken: !!token,
          tokenLength: token?.length || 0,
          isAuthenticated: zitadelAuth.isAuthenticated(),
          isExpired: zitadelAuth.isTokenExpired(),
          backendError: backendError,
          endpoint: path,
        });
        
        // Common issues and solutions
        if (backendError.includes('audience')) {
          console.error('⚠️ Audience mismatch detected!');
          console.error('💡 Check backend ZITADEL_AUDIENCE matches token audience');
          console.error('💡 Decode your token at https://jwt.io to see the "aud" claim');
          console.error('💡 Update backend .env: ZITADEL_AUDIENCE=<token_aud_value>');
        } else if (backendError.includes('issuer')) {
          console.error('⚠️ Issuer mismatch detected!');
          console.error('💡 Check backend ZITADEL_INSTANCE_URL matches token issuer');
          console.error('💡 Decode your token at https://jwt.io to see the "iss" claim');
        } else if (backendError.includes('expired')) {
          console.error('⚠️ Token expired!');
          console.error('💡 Attempting token refresh...');
        } else if (backendError.includes('JWKS')) {
          console.error('⚠️ JWKS not available!');
          console.error('💡 Backend cannot reach Zitadel JWKS endpoint');
          console.error('💡 Check backend can access:', 'http://localhost:8080/oauth/v2/keys');
        }
        
        // Try one more refresh attempt
        try {
          await zitadelAuth.refreshToken();
          // Retry the request once with refreshed token
          const newToken = await getValidAccessToken();
          if (newToken) {
            headers.Authorization = `Bearer ${newToken}`;
            const retryRes = await fetch(`${API_BASE_URL}${path}`, {
              method,
              headers,
              body: body ? JSON.stringify(body) : undefined,
              credentials: 'include',
            });
            
            if (retryRes.ok) {
              if (retryRes.status === 204) return undefined as unknown as T;
              return retryRes.json() as Promise<T>;
            }
          }
        } catch (retryError) {
          console.error('Retry after refresh also failed:', retryError);
        }
        
        // Provide helpful error message
        let userMessage = 'Unauthorized: Please login again.';
        if (backendError && backendError !== 'Unknown error') {
          userMessage += ` Backend error: ${backendError}`;
        }
        
        throw new Error(userMessage);
      }
      
      throw new Error(errorMessage);
    }

    // Some DELETE endpoints may return no content
    if (res.status === 204) return undefined as unknown as T;

    return res.json() as Promise<T>;
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Network error:', error);
      throw new Error(`Failed to connect to API: ${API_BASE_URL}. Please check if the backend is running.`);
    }
    throw error;
  }
}

// API surface
export interface PeerResponse {
  id: number; // Internal database ID (kept for backward compatibility)
  peer_id: string; // User-scoped peer ID (random string, NetBird-style) - use this for operations
  public_key: string;
  name: string;
  ip_address: string;
  endpoint?: string; // Public endpoint for peer (e.g., "203.0.113.10:51820") - may be STUN-discovered
  relay_endpoint?: string; // Relay fallback endpoint for hole punching
  public_ip?: string; // Device's public IP address
  region?: string; // Device region/location
  operating_system?: string; // Device operating system
  serial_number?: string; // Device serial number
  nat_type?: string; // Detected NAT type (full_cone, restricted_cone, port_restricted, symmetric)
  user_id: string;
  last_seen: string;
  created_at: string;
}

export async function getPeers(): Promise<{ peers: PeerResponse[] }> {
  return request<{ peers: PeerResponse[] }>('/api/peers');
}

export async function getPeer(peerId: string): Promise<PeerResponse> {
  // Use peer_id (user-scoped) instead of id (internal database ID)
  return request<PeerResponse>(`/api/peers/${peerId}`, 'GET');
}

export async function createPeer(payload: { name: string; public_key: string; ip_address: string }): Promise<PeerResponse> {
  return request<PeerResponse>('/api/peers', 'POST', payload);
}

export async function updatePeer(peerId: string, updates: { name?: string; ip_address?: string }): Promise<PeerResponse> {
  // Use peer_id (user-scoped) instead of id (internal database ID)
  return request<PeerResponse>(`/api/peers/${peerId}`, 'PATCH', updates);
}

export async function deletePeer(peerId: string): Promise<void> {
  // Use peer_id (user-scoped) instead of id (internal database ID)
  await request(`/api/peers/${peerId}`, 'DELETE');
}

// STUN/TURN configuration types and functions
export interface STUNTURNConfig {
  stun_servers: string[];
  turn_server?: string;
  turn_username?: string;
  turn_realm?: string;
}

export async function getSTUNConfig(): Promise<STUNTURNConfig> {
  return request<STUNTURNConfig>('/api/stun-config');
}

export async function getStats(): Promise<{ total_peers: number; uptime_seconds: number }> {
  return request<{ total_peers: number; uptime_seconds: number }>('/api/stats');
}

export async function getUser(): Promise<{ user_id: string; email?: string; name?: string }> {
  return request<{ user_id: string; email?: string; name?: string }>('/api/user');
}

// User profile management
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

export interface DeleteAccountResponse {
  message: string;
}

export async function deleteAccount(): Promise<DeleteAccountResponse> {
  return request<DeleteAccountResponse>('/api/user/delete', 'POST');
}


