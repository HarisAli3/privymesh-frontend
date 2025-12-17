import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLogoIcon from '@/components/app-logo-icon';

export default function AuthCallback() {
  const { handleCallback, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const hasProcessedCallback = useRef(false);
  
  // Check if we're coming from an account deletion scenario
  // If URL has 'deleted' parameter, we need to clear state before processing callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromDeletion = urlParams.get('deleted') === '1';
    
    if (fromDeletion) {
      console.log('[AuthCallback] Detected account deletion scenario - clearing state');
      // Clear state before processing callback
      (async () => {
        try {
          const zitadelAuth = (await import('@/lib/zitadel-auth')).default;
          zitadelAuth.clearAllAuthState();
          // Remove the deleted parameter from URL
          urlParams.delete('deleted');
          const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
          window.history.replaceState({}, '', newUrl);
        } catch (clearError) {
          console.warn('Failed to clear state:', clearError);
        }
      })();
    }
  }, []);

  useEffect(() => {
    if (hasProcessedCallback.current) return;
    
    const processCallback = async () => {
      try {
        hasProcessedCallback.current = true;
        
        // Check if URL has error parameters (from Zitadel)
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        
        if (error) {
          console.error('OAuth error from Zitadel:', error, errorDescription);
          // Clear state and redirect to login
          try {
            const zitadelAuth = (await import('@/lib/zitadel-auth')).default;
            zitadelAuth.clearAllAuthState();
          } catch (clearError) {
            console.warn('Failed to clear auth state:', clearError);
          }
          setError(`Authentication failed: ${errorDescription || error}`);
          setTimeout(() => {
            window.location.replace('/login');
          }, 2000);
          return;
        }
        
        // If we have code but no state, or state looks invalid, clear state first
        // This can happen after account deletion where stale state exists
        if (code && (!state || state.length < 10)) {
          console.warn('[AuthCallback] Suspicious OAuth state - clearing before processing');
          try {
            const zitadelAuth = (await import('@/lib/zitadel-auth')).default;
            zitadelAuth.clearAllAuthState();
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (clearError) {
            console.warn('Failed to clear state:', clearError);
          }
        }
        
        await handleCallback();
      } catch (err) {
        console.error('Authentication callback failed:', err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        
        // Check if it's a state mismatch error (stale OAuth state)
        const isStateError = errorMessage.includes('state') || 
                            errorMessage.includes('State') ||
                            errorMessage.includes('mismatch') ||
                            errorMessage.includes('Invalid state');
        
        if (isStateError) {
          console.log('[AuthCallback] Detected state mismatch - clearing all OAuth state');
        }
        
        setError('Authentication failed. Please try again.');
        hasProcessedCallback.current = false;
        
        // Clear any remaining auth state before redirecting
        try {
          const zitadelAuth = (await import('@/lib/zitadel-auth')).default;
          zitadelAuth.clearAllAuthState();
          
          // If it's a state error, wait a bit longer to ensure storage is cleared
          if (isStateError) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } catch (clearError) {
          console.warn('Failed to clear auth state on callback error:', clearError);
        }
        
        // For state errors, redirect to landing page instead of login to break the loop
        // This gives the user a fresh start
        const redirectUrl = isStateError ? '/?cleared=1' : '/login';
        
        setTimeout(() => {
          // Use window.location.replace to force full page reload and prevent back navigation
          // This ensures all state is cleared and user starts fresh
          window.location.replace(redirectUrl);
        }, isStateError ? 1500 : 2000);
      }
    };

    processCallback();
  }, [handleCallback, navigate]);

  // Separate effect to handle navigation after state is ready
  useEffect(() => {
    if (hasProcessedCallback.current && !isLoading && isAuthenticated && !error) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate, error]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <AppLogoIcon className="h-10 w-10 rounded-lg" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">PrivyMesh</span>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>
              {error ? 'Authentication Failed' : 'Completing Sign In...'}
            </CardTitle>
            <CardDescription>
              {error ? error : 'Please wait while we complete your authentication.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {!error && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
            {error && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Redirecting to login page...
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
