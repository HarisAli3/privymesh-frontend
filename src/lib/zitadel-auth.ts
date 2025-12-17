import { createZitadelAuth, type ZitadelConfig } from '@zitadel/react';
import type { User } from 'oidc-client-ts';
import Cookies from 'js-cookie';
import getEnv from './env';

// Normalize possible AUTH_* or ZITADEL_* env styles
function normalizeUrlOrPath(value: string | undefined, fallbackPath: string): string {
  if (!value) return `${window.location.origin}${fallbackPath}`;
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  // treat as path
  return `${window.location.origin}${value.startsWith('/') ? value : `/${value}`}`;
}

// Consolidated auth configuration (prefers AUTH_* like NetBird, falls back to ZITADEL_*)
const ZITADEL_CONFIG = {
  instanceUrl:
    getEnv('AUTH_AUTHORITY') ||
    getEnv('ZITADEL_INSTANCE_URL') ||
    'http://localhost:8080',
  clientId:
    getEnv('AUTH_CLIENT_ID') ||
    getEnv('ZITADEL_CLIENT_ID') ||
    '',
  redirectUri: normalizeUrlOrPath(
    getEnv('AUTH_REDIRECT_URI') ||
      getEnv('ZITADEL_REDIRECT_URI'),
    '/pm-auth',
  ),
  silentRedirectUri: normalizeUrlOrPath(
    getEnv('AUTH_SILENT_REDIRECT_URI') ||
      getEnv('ZITADEL_SILENT_REDIRECT_URI'),
    '/pm-silent-auth',
  ),
  postLogoutRedirectUri:
    getEnv('ZITADEL_POST_LOGOUT_REDIRECT_URI') ||
    `${window.location.origin}/`,
  scopes:
    getEnv('AUTH_SUPPORTED_SCOPES') ||
    'openid email profile offline_access',
  auth_audience:
    getEnv('AUTH_AUDIENCE') ||
    getEnv('ZITADEL_AUTH_AUDIENCE') ||
    '',
};

// Validate configuration before creating Zitadel auth
if (!ZITADEL_CONFIG.clientId) {
  console.error('❌ ZITADEL_CLIENT_ID is not set!');
  console.error('Current environment variables:');
  console.error('- ZITADEL_CLIENT_ID:', getEnv('ZITADEL_CLIENT_ID') || 'NOT SET');
  console.error('- AUTH_CLIENT_ID:', getEnv('AUTH_CLIENT_ID') || 'NOT SET');
  console.error('- ZITADEL_INSTANCE_URL:', ZITADEL_CONFIG.instanceUrl);
  console.error('Please set ZITADEL_CLIENT_ID or AUTH_CLIENT_ID environment variable.');
  throw new Error('ZITADEL_CLIENT_ID is required. Please set ZITADEL_CLIENT_ID or AUTH_CLIENT_ID environment variable.');
}

const zitadelConfig: ZitadelConfig = {
  authority: ZITADEL_CONFIG.instanceUrl,
  client_id: ZITADEL_CONFIG.clientId,
  redirect_uri: ZITADEL_CONFIG.redirectUri,
  post_logout_redirect_uri: ZITADEL_CONFIG.postLogoutRedirectUri,
  response_type: 'code',
  scope: ZITADEL_CONFIG.scopes,
  silent_redirect_uri: ZITADEL_CONFIG.silentRedirectUri,
  ...(ZITADEL_CONFIG.auth_audience ? { extraQueryParams: { audience: ZITADEL_CONFIG.auth_audience } } : {}),
};

const zitadel = createZitadelAuth(zitadelConfig);

class ZitadelAuthService {
  private user: User | null = null;
  // Track manually updated profile data to preserve it across token refreshes
  // Stored in localStorage to persist across page refreshes
  private readonly MANUAL_UPDATES_STORAGE_KEY = 'zitadel_manual_profile_updates';
  
  private getManualProfileUpdates(): { name?: string; email?: string } | null {
    try {
      const stored = localStorage.getItem(this.MANUAL_UPDATES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.name || parsed.email ? parsed : null;
      }
    } catch (error) {
      console.warn('[ZitadelAuth] Failed to load manual profile updates from localStorage:', error);
    }
    return null;
  }

  private setManualProfileUpdates(updates: { name?: string; email?: string } | null) {
    try {
      if (updates && (updates.name || updates.email)) {
        localStorage.setItem(this.MANUAL_UPDATES_STORAGE_KEY, JSON.stringify(updates));
      } else {
        localStorage.removeItem(this.MANUAL_UPDATES_STORAGE_KEY);
      }
    } catch (error) {
      console.warn('[ZitadelAuth] Failed to save manual profile updates to localStorage:', error);
    }
  }

  private clearManualProfileUpdates() {
    try {
      localStorage.removeItem(this.MANUAL_UPDATES_STORAGE_KEY);
    } catch (error) {
      console.warn('[ZitadelAuth] Failed to clear manual profile updates from localStorage:', error);
    }
  }

  constructor() {
    this.initializeUser();
  }

  private async initializeUser() {
    try {
      this.user = await zitadel.userManager.getUser();
      if (this.user && !this.user.expired) {
        // Apply manual profile updates if any (loaded from localStorage)
        this.applyManualProfileUpdates(this.user);
        // Update cookie with the updated profile data
        this.setUserCookie(this.user);
      } else {
        // User expired or doesn't exist, clear state
        this.user = null;
        this._clearUserCookie();
        // Clear manual updates if user is logged out
        this.clearManualProfileUpdates();
      }
    } catch (error) {
      console.log('No user found or error getting user:', error);
      this.user = null;
      this._clearUserCookie();
      this.clearManualProfileUpdates();
    }
  }

  // Expose userManager for direct access
  get userManager() {
    return zitadel.userManager;
  }

  // Start the login process
  async login(): Promise<void> {
    try {
      // Before starting a new login, clear any stale OAuth state
      // This prevents state mismatch errors when logging in after account deletion
      // or other scenarios where stale state might exist
      try {
        // Check if there's any existing user state that might be stale
        const existingUser = await zitadel.userManager.getUser().catch(() => null);
        if (existingUser) {
          console.log('[ZitadelAuth] Found existing user state before login - clearing to prevent state mismatch');
          // Clear user but keep the state store intact for the new login flow
          await zitadel.userManager.removeUser();
        }
        
        // Also clear any stale state from the state store that might be from a previous failed attempt
        // This is especially important after account deletion
        try {
          const stateStore = (zitadel.userManager as any).stateStore;
          if (stateStore) {
            // Get all keys from the state store
            const allKeys = Object.keys(localStorage).concat(Object.keys(sessionStorage));
            const staleStateKeys = allKeys.filter(key => {
              const keyLower = key.toLowerCase();
              return (
                keyLower.includes('oidc') && 
                (keyLower.includes('state') || keyLower.includes('authorize'))
              );
            });
            
            if (staleStateKeys.length > 0) {
              console.log('[ZitadelAuth] Clearing stale OAuth state keys before login:', staleStateKeys);
              staleStateKeys.forEach(key => {
                localStorage.removeItem(key);
                sessionStorage.removeItem(key);
              });
            }
          }
        } catch (stateStoreError) {
          console.warn('[ZitadelAuth] Failed to clear stale state store:', stateStoreError);
          // Continue anyway - the new login will create fresh state
        }
      } catch (clearError) {
        console.warn('[ZitadelAuth] Error clearing state before login:', clearError);
        // Continue anyway - try to start fresh login
      }
      
      await zitadel.authorize();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // Handle the callback after login
  async handleCallback(): Promise<User> {
    try {
      // Before processing callback, check if there's stale state that might cause issues
      // This is especially important after account deletion
      try {
        const currentUser = await zitadel.userManager.getUser();
        if (currentUser && currentUser.expired) {
          console.log('[ZitadelAuth] Found expired user - clearing before callback');
          await zitadel.userManager.removeUser();
        }
      } catch (getUserError) {
        // Ignore - user might not exist
      }
      
      const user = await zitadel.userManager.signinRedirectCallback() as User;
      if (user && !user.expired) {
        this.user = user;
        this.setUserCookie(user);
        return user;
      } else {
        throw new Error('Invalid user returned from callback');
      }
    } catch (error) {
      console.error('Callback handling failed:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorString = String(error);
      console.error('Error details:', errorMessage);
      console.error('Full error:', errorString);
      
      // Check for specific error types that indicate stale state
      const isStateMismatch = errorString.includes('state') || 
                              errorString.includes('State') ||
                              errorString.includes('mismatch') ||
                              errorString.includes('Invalid state') ||
                              errorMessage.includes('state');
      
      if (isStateMismatch) {
        console.log('[ZitadelAuth] State mismatch detected - clearing ALL OAuth state');
      }
      
      // On callback failure, clear ALL state to allow fresh login
      // This prevents stale oidc-client state from blocking new login attempts
      console.log('[ZitadelAuth] Clearing all auth state due to callback failure');
      this.clearAllAuthState();
      
      throw error;
    }
  }

  // Handle silent callback for token renewal
  async handleSilentCallback(): Promise<User> {
    try {
      const user = await zitadel.userManager.signinSilentCallback() as unknown as User;
      this.user = user;
      this.setUserCookie(user);
      return user;
    } catch (error) {
      console.error('Silent callback failed:', error);
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      // Clear user state and cookies BEFORE redirecting
      this.user = null;
      this._clearUserCookie();
      // Clear manual profile updates on logout
      this.clearManualProfileUpdates();
      // Also clear from UserManager's storage
      await zitadel.userManager.removeUser();
      // Now redirect to logout
      await zitadel.signout();
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if signout fails, ensure local state is cleared
      this.user = null;
      this._clearUserCookie();
      this.clearManualProfileUpdates();
      await zitadel.userManager.removeUser().catch(() => {}); // Ignore errors
      throw error;
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.user;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.user !== null && !(this.user.expired ?? true);
  }

  // Get access token
  getAccessToken(): string | null {
    return this.user?.access_token || null;
  }

  // Get user info
  getUserInfo() {
    if (!this.user) return null;
    
    // Ensure manual profile updates are applied
    this.applyManualProfileUpdates(this.user);
    
    return {
      id: this.user.profile.sub,
      name: this.user.profile.name || this.user.profile.preferred_username || 'Unknown User',
      email: this.user.profile.email || '',
      avatar: this.user.profile.picture,
      email_verified_at: this.user.profile.email_verified ? new Date().toISOString() : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  // Set user cookie for persistence
  private setUserCookie(user: User) {
    const userInfo = this.getUserInfo();
    if (userInfo) {
      Cookies.set('zitadel_user', JSON.stringify(userInfo), { expires: 7 });
      Cookies.set('zitadel_token', user.access_token, { expires: 7 });
    }
  }

  // Public method to update user profile data (for profile updates)
  // This overrides the token's profile data so getUserInfo() returns updated values
  public updateUserProfile(updatedData: { name?: string; email?: string }) {
    if (!this.user) {
      console.warn('[ZitadelAuth] Cannot update profile: user not loaded');
      return;
    }
    
    console.log('[ZitadelAuth] Updating user profile:', updatedData);
    console.log('[ZitadelAuth] Current profile before update:', {
      name: this.user.profile?.name,
      email: this.user.profile?.email,
    });
    
    // Store manual updates in localStorage so they persist across page refreshes
    const manualUpdates = {
      ...(updatedData.name && { name: updatedData.name }),
      ...(updatedData.email && { email: updatedData.email }),
    };
    this.setManualProfileUpdates(manualUpdates);
    
    // Override the profile data in the user object so getUserInfo() returns updated values
    if (updatedData.name && this.user.profile) {
      this.user.profile.name = updatedData.name;
      // Also update displayName if it exists
      if ((this.user.profile as any).display_name) {
        (this.user.profile as any).display_name = updatedData.name;
      }
    }
    if (updatedData.email && this.user.profile) {
      this.user.profile.email = updatedData.email;
    }
    
    console.log('[ZitadelAuth] Profile after update:', {
      name: this.user.profile?.name,
      email: this.user.profile?.email,
    });
    console.log('[ZitadelAuth] Stored manual profile updates in localStorage:', manualUpdates);
    
    // Update cookie with new data
    const currentUserInfo = this.getUserInfo();
    if (currentUserInfo) {
      const updatedUserInfo = {
        ...currentUserInfo,
        ...(updatedData.name && { name: updatedData.name }),
        ...(updatedData.email && { email: updatedData.email }),
      };
      Cookies.set('zitadel_user', JSON.stringify(updatedUserInfo), { expires: 7 });
    }
  }

  // Apply manual profile updates to a user object (used when refreshing from token)
  // Made public so AuthContext can call it
  // Loads updates from localStorage if not already loaded
  public applyManualProfileUpdates(user: User | null) {
    if (!user) return;
    
    // Load manual updates from localStorage (persists across page refreshes)
    const manualUpdates = this.getManualProfileUpdates();
    if (!manualUpdates) return;
    
    if (user.profile) {
      if (manualUpdates.name) {
        user.profile.name = manualUpdates.name;
        if ((user.profile as any).display_name) {
          (user.profile as any).display_name = manualUpdates.name;
        }
      }
      if (manualUpdates.email) {
        user.profile.email = manualUpdates.email;
      }
      
      console.log('[ZitadelAuth] Applied manual profile updates from localStorage:', manualUpdates);
    }
  }

  // Clear user cookie (private implementation)
  private _clearUserCookie() {
    Cookies.remove('zitadel_user');
    Cookies.remove('zitadel_token');
  }

  // Public method to clear cookies (for AuthContext)
  clearUserCookie() {
    this._clearUserCookie();
  }

  // Clear all authentication state without calling Zitadel logout
  // Used when account is deleted (account no longer exists in Zitadel)
  public clearAllAuthState(): void {
    console.log('[ZitadelAuth] Clearing all authentication state (account deleted)');
    
    // Step 1: Clear in-memory state
    this.user = null;
    this._clearUserCookie();
    this.clearManualProfileUpdates();
    
    // Step 2: Clear UserManager storage - this clears oidc-client user state
    zitadel.userManager.removeUser().catch(() => {
      // Ignore errors - user might not exist
    });
    
    // Step 3: Clear UserManager's state store (OAuth state parameters)
    try {
      // The UserManager uses WebStorageStateStore which stores OAuth state
      // We need to clear the state store directly
      const stateStore = (zitadel.userManager as any).stateStore;
      if (stateStore && stateStore.clear) {
        stateStore.clear();
        console.log('[ZitadelAuth] Cleared UserManager state store');
      }
    } catch (error) {
      console.warn('[ZitadelAuth] Failed to clear UserManager state store:', error);
    }
    
    // Step 4: Clear all localStorage/sessionStorage - be VERY aggressive
    try {
      const authority = ZITADEL_CONFIG.instanceUrl;
      const clientId = ZITADEL_CONFIG.clientId;
      
      // Clear localStorage - remove ALL keys that could be related
      const localStorageKeys = Object.keys(localStorage);
      let clearedCount = 0;
      localStorageKeys.forEach(key => {
        const keyLower = key.toLowerCase();
        // Remove any key that contains oidc, zitadel, auth, user, or matches our config
        if (
          keyLower.includes('oidc') || 
          keyLower.includes('zitadel') || 
          keyLower.includes('auth') || 
          keyLower.includes('user') ||
          key.includes(authority) ||
          key.includes(clientId) ||
          key.startsWith('oidc.')
        ) {
          console.log('[ZitadelAuth] Removing localStorage key:', key);
          localStorage.removeItem(key);
          clearedCount++;
        }
      });
      
      // Clear sessionStorage - same aggressive approach
      const sessionStorageKeys = Object.keys(sessionStorage);
      sessionStorageKeys.forEach(key => {
        const keyLower = key.toLowerCase();
        if (
          keyLower.includes('oidc') || 
          keyLower.includes('zitadel') || 
          keyLower.includes('auth') || 
          keyLower.includes('user') ||
          key.includes(authority) ||
          key.includes(clientId) ||
          key.startsWith('oidc.')
        ) {
          console.log('[ZitadelAuth] Removing sessionStorage key:', key);
          sessionStorage.removeItem(key);
          clearedCount++;
        }
      });
      
      console.log(`[ZitadelAuth] Cleared ${clearedCount} storage keys`);
      
      // Step 5: Also clear any URL parameters that might be cached
      // Clear any oidc-client state from URL if present
      if (window.location.search) {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('code') || urlParams.has('state') || urlParams.has('error')) {
          // Remove auth-related URL params
          urlParams.delete('code');
          urlParams.delete('state');
          urlParams.delete('error');
          urlParams.delete('error_description');
          const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
          window.history.replaceState({}, '', newUrl);
          console.log('[ZitadelAuth] Cleared auth-related URL parameters');
        }
      }
    } catch (error) {
      console.warn('[ZitadelAuth] Failed to clear storage:', error);
    }
  }

  // Get user from cookie (for SSR or page refresh)
  getUserFromCookie() {
    const userCookie = Cookies.get('zitadel_user');
    const tokenCookie = Cookies.get('zitadel_token');
    
    if (userCookie && tokenCookie) {
      try {
        const userInfo = JSON.parse(userCookie);
        return {
          ...userInfo,
          access_token: tokenCookie,
        };
      } catch (error) {
        console.error('Error parsing user cookie:', error);
        this.clearUserCookie();
      }
    }
    
    return null;
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    if (!this.user) return true;
    return this.user.expired ?? true;
  }

  // Refresh token
  async refreshToken(): Promise<User> {
    try {
      const user = await zitadel.userManager.signinSilent() as User;
      this.user = user;
      this.setUserCookie(user);
      return user;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const zitadelAuth = new ZitadelAuthService();
export default zitadelAuth;

