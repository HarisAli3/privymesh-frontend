import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import zitadelAuth from '@/lib/zitadel-auth';

interface AuthUser {
  id: string | number;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  handleCallback: () => Promise<void>;
  handleSilentCallback: () => Promise<void>;
  refreshUser: (backendUserData?: { user_id: string; email?: string; name?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingCallback, setIsProcessingCallback] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const init = async () => {
      // Don't initialize if we're processing a callback
      if (isProcessingCallback) {
        return;
      }
      await initializeAuth();
      if (!mounted) return;
    };
    
    init();
    
    return () => {
      mounted = false;
    };
  }, [isProcessingCallback]);

  const initializeAuth = async () => {
    // Skip initialization if we're processing a callback
    if (isProcessingCallback) {
      return;
    }

    try {
      // Don't show loading if we already have a user (e.g., after callback)
      if (!user) {
        setIsLoading(true);
      }
      
      // Always check UserManager first to get the actual auth state
      // This ensures we're in sync with Zitadel's auth state
      const currentUser = await zitadelAuth.userManager.getUser();
      
      if (currentUser && !currentUser.expired) {
        // User is authenticated, sync the user state
        // Update the internal user in zitadel-auth service
        (zitadelAuth as any).user = currentUser;
        // Apply manual profile updates if any
        if ((zitadelAuth as any).applyManualProfileUpdates) {
          (zitadelAuth as any).applyManualProfileUpdates(currentUser);
        }
        const userInfo = zitadelAuth.getUserInfo();
        if (userInfo) {
          setUser(userInfo);
        }
      } else {
        // Only clear if we don't already have a user (don't override callback)
        // This prevents clearing user state right after successful callback
        if (!user && !isProcessingCallback) {
          setUser(null);
          zitadelAuth.clearUserCookie();
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      // On error, don't clear state if we already have a user or are processing callback
      if (!user && !isProcessingCallback) {
        const currentUser = await zitadelAuth.userManager.getUser().catch(() => null);
        if (!currentUser || currentUser.expired) {
          setUser(null);
          zitadelAuth.clearUserCookie();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      await zitadelAuth.login();
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await zitadelAuth.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallback = async () => {
    try {
      setIsProcessingCallback(true);
      setIsLoading(true);
      const user = await zitadelAuth.handleCallback();
      // Ensure user is set in the service
      (zitadelAuth as any).user = user;
      // Apply manual profile updates if any
      if ((zitadelAuth as any).applyManualProfileUpdates) {
        (zitadelAuth as any).applyManualProfileUpdates(user);
      }
      const userInfo = zitadelAuth.getUserInfo();
      if (userInfo) {
        setUser(userInfo);
        // Wait a bit to ensure state is set before allowing navigation
        await new Promise(resolve => setTimeout(resolve, 100));
      } else {
        throw new Error('Failed to get user info after callback');
      }
    } catch (error) {
      console.error('Callback error:', error);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
      // Keep the flag for a moment to prevent initializeAuth from running
      setTimeout(() => {
        setIsProcessingCallback(false);
      }, 500);
    }
  };

  const handleSilentCallback = async () => {
    try {
      setIsLoading(true);
      await zitadelAuth.handleSilentCallback();
      const userInfo = zitadelAuth.getUserInfo();
      if (userInfo) {
        setUser(userInfo);
      }
    } catch (error) {
      console.error('Silent callback error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh user data from backend and update token claims
  // This fetches the latest user data from the backend API (which gets it from Zitadel)
  // and updates the AuthContext, so UI reflects changes immediately
  const refreshUser = async (backendUserData?: { user_id: string; email?: string; name?: string }) => {
    try {
      let updatedUserInfo: AuthUser | null = null;

      // If backend user data is provided, use it (from profile update response)
      if (backendUserData) {
        // Ensure user is loaded first
        const currentUser = await zitadelAuth.userManager.getUser().catch(() => null);
        if (currentUser && !currentUser.expired) {
          // Update the internal user reference
          (zitadelAuth as any).user = currentUser;
        }
        
        // Update the user profile in zitadel-auth service
        // This ensures getUserInfo() returns updated values immediately
        zitadelAuth.updateUserProfile({
          name: backendUserData.name,
          email: backendUserData.email,
        });
        
        // Re-apply manual updates after updating profile (ensures they persist)
        if (currentUser && (zitadelAuth as any).applyManualProfileUpdates) {
          (zitadelAuth as any).applyManualProfileUpdates(currentUser);
        }
        
        // Get the updated user info (which now includes the overridden profile data)
        const tokenUserInfo = zitadelAuth.getUserInfo();
        if (tokenUserInfo) {
          // Use backend data, falling back to token data for other fields
          updatedUserInfo = {
            ...tokenUserInfo,
            name: backendUserData.name || tokenUserInfo.name,
            email: backendUserData.email || tokenUserInfo.email,
          };
        } else {
          // Fallback: create user info from backend data
          updatedUserInfo = {
            id: backendUserData.user_id,
            name: backendUserData.name || 'Unknown User',
            email: backendUserData.email || '',
            email_verified_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
        }
      } else {
        // No backend data provided, fetch from backend API
        try {
          const { getUser } = await import('@/lib/api');
          const backendData = await getUser();
          
          // Get fresh user from Zitadel UserManager (updates token if needed)
          const currentUser = await zitadelAuth.userManager.getUser();
          if (currentUser && !currentUser.expired) {
            // Update the internal user in zitadel-auth service
            (zitadelAuth as any).user = currentUser;
            // Apply manual profile updates if any
            if ((zitadelAuth as any).applyManualProfileUpdates) {
              (zitadelAuth as any).applyManualProfileUpdates(currentUser);
            }
            const tokenUserInfo = zitadelAuth.getUserInfo();
            if (tokenUserInfo) {
              // Merge backend data with token data
              updatedUserInfo = {
                ...tokenUserInfo,
                name: backendData.name || tokenUserInfo.name,
                email: backendData.email || tokenUserInfo.email,
              };
            }
          } else {
            // Try to refresh token if expired
              try {
                const refreshedUser = await zitadelAuth.refreshToken();
                (zitadelAuth as any).user = refreshedUser;
                // Apply manual profile updates if any
                if ((zitadelAuth as any).applyManualProfileUpdates) {
                  (zitadelAuth as any).applyManualProfileUpdates(refreshedUser);
                }
                const tokenUserInfo = zitadelAuth.getUserInfo();
              if (tokenUserInfo) {
                updatedUserInfo = {
                  ...tokenUserInfo,
                  name: backendData.name || tokenUserInfo.name,
                  email: backendData.email || tokenUserInfo.email,
                };
              }
            } catch (refreshError) {
              console.error('Token refresh failed during user refresh:', refreshError);
              // Use backend data as fallback
              if (backendData) {
                updatedUserInfo = {
                  id: backendData.user_id,
                  name: backendData.name || 'Unknown User',
                  email: backendData.email || '',
                  email_verified_at: null,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                };
              }
            }
          }
        } catch (apiError) {
          console.warn('Failed to fetch user from backend, using token data:', apiError);
          // Fallback to token data only
          const currentUser = await zitadelAuth.userManager.getUser().catch(() => null);
          if (currentUser && !currentUser.expired) {
            (zitadelAuth as any).user = currentUser;
            // Apply manual profile updates if any
            if ((zitadelAuth as any).applyManualProfileUpdates) {
              (zitadelAuth as any).applyManualProfileUpdates(currentUser);
            }
            updatedUserInfo = zitadelAuth.getUserInfo();
          }
        }
      }

      // Update user state if we have new info
      // Create a new object with timestamp to force React to detect the state change
      if (updatedUserInfo) {
        console.log('[AuthContext] Updating user state with:', {
          id: updatedUserInfo.id,
          name: updatedUserInfo.name,
          email: updatedUserInfo.email,
        });
        // Force state update by creating a completely new object with current timestamp
        setUser({ 
          ...updatedUserInfo,
          updated_at: new Date().toISOString(), // Always update timestamp to force re-render
        });
        
        // Also force a second update with a small delay to ensure React picks it up
        // This is a workaround for cases where React might batch the update
        setTimeout(() => {
          setUser(prevUser => {
            if (prevUser && prevUser.id === updatedUserInfo.id) {
              // Only update if it's the same user to avoid race conditions
              return { 
                ...updatedUserInfo,
                updated_at: new Date().toISOString(),
              };
            }
            return prevUser;
          });
        }, 50);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      // Don't throw - allow UI to continue with current user data
    }
  };

  // Use useMemo to ensure value object changes when user or loading state changes
  // This helps React detect context updates - functions are stable so don't need to be in deps
  const value: AuthContextType = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    handleCallback,
    handleSilentCallback,
    refreshUser,
  }), [user, isLoading]); // Only depend on user and isLoading - functions are stable

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
