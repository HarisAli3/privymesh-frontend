import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function SilentCallback() {
  const { handleSilentCallback } = useAuth();

  useEffect(() => {
    const processSilentCallback = async () => {
      try {
        await handleSilentCallback();
      } catch (err) {
        console.error('Silent callback failed:', err);
      }
    };

    processSilentCallback();
  }, [handleSilentCallback]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}
