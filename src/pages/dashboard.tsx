import { Globe, MapPin, Monitor, Hash, Activity, Plus, Settings, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AppSidebarLayout from '@/layouts/AppSidebarLayout';
import { useEffect, useState } from 'react';
import { getPeers, type PeerResponse } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  // Calculate statistics
  const totalDevices = peers.length;
  const onlineDevices = peers.filter(p => {
    if (!p.last_seen) return false;
    const lastSeen = new Date(p.last_seen);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60);
    return diffMinutes <= 2;
  }).length;
  const uniqueRegions = new Set(peers.filter(p => p.region).map(p => p.region)).size;
  const uniqueOS = new Set(peers.filter(p => p.operating_system).map(p => p.operating_system)).size;

  return (
    <AppSidebarLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mt-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Network Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Overview of your network devices and their status
              </p>
            </div>
            <button
              onClick={() => navigate('/peers/add')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Device
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Devices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {isLoading ? '...' : totalDevices}
                </p>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Online Devices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {isLoading ? '...' : onlineDevices}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {totalDevices > 0 ? `${Math.round((onlineDevices / totalDevices) * 100)}% active` : 'No devices'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Regions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {isLoading ? '...' : uniqueRegions}
                </p>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Operating Systems
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {isLoading ? '...' : uniqueOS}
                </p>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/peers/add')}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Add New Device</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Register a new peer</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => navigate('/peers')}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">View All Peers</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage your devices</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => navigate('/settings')}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Settings</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Configure preferences</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Device Information */}
        <div className="mb-8">
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