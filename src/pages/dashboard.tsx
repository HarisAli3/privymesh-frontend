import { Globe, MapPin, Monitor, Hash } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AppSidebarLayout from '@/layouts/AppSidebarLayout';
import { useEffect, useState } from 'react';
import { getPeers, type PeerResponse } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const { user } = useAuth();
  const [peers, setPeers] = useState<PeerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPeers = async () => {
      try {
        setIsLoading(true);
        const response = await getPeers();
        setPeers(response.peers || []);
      } catch (error) {
        console.error('Error fetching peers:', error);
        setPeers([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchPeers();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AppSidebarLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Device Information */}
        <div className="mt-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Device Information</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="ml-3 text-gray-600 dark:text-gray-400">Loading devices...</p>
            </div>
          ) : peers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {peers.map((peer) => (
                <Card key={peer.peer_id ?? peer.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                      {peer.name || 'Unnamed Device'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {peer.public_ip && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Public IP</p>
                            <p className="text-sm font-mono text-gray-900 dark:text-white truncate">{peer.public_ip}</p>
                          </div>
                        </div>
                      )}
                      
                      {peer.region && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Region</p>
                            <p className="text-sm text-gray-900 dark:text-white truncate">{peer.region}</p>
                          </div>
                        </div>
                      )}
                      
                      {peer.operating_system && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Monitor className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Operating System</p>
                            <p className="text-sm text-gray-900 dark:text-white truncate">{peer.operating_system}</p>
                          </div>
                        </div>
                      )}
                      
                      {peer.serial_number && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Hash className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Serial Number</p>
                            <p className="text-sm font-mono text-gray-900 dark:text-white truncate">{peer.serial_number}</p>
                          </div>
                        </div>
                      )}
                      
                      {!peer.public_ip && !peer.region && !peer.operating_system && !peer.serial_number && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No device information available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No devices found.</p>
            </div>
          )}
        </div>
      </div>
    </AppSidebarLayout>
  );
}