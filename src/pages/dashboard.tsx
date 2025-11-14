import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Shield, Users, Globe, Activity, TrendingUp, Zap, MapPin, Monitor, Hash } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AppSidebarLayout from '@/layouts/AppSidebarLayout';
import TokenDisplay from '@/components/TokenDisplay';
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
        {/* Welcome Section */}
        <div className="mt-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🌐</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                Welcome to PrivyMesh
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Your secure network management dashboard
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Here's what's happening with your network today.
          </p>
        </div>

        {/* Token Display (Temporary) */}
        <div className="mb-8">
          <TokenDisplay />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Devices */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Devices</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isLoading ? '...' : peers.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
              <Activity className="w-4 h-4 mr-1" />
              {isLoading ? 'Loading...' : `${peers.filter(p => {
                if (!p.last_seen) return false;
                const lastSeen = new Date(p.last_seen);
                const now = new Date();
                const diffMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60);
                return diffMinutes <= 2;
              }).length} online`}
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">892</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              +8% from last month
            </div>
          </div>

          {/* Security Score */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Security Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">98.5%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              +2.3% from last month
            </div>
          </div>

          {/* Network Uptime */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Network Uptime</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">99.9%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              +0.1% from last month
            </div>
          </div>
        </div>

        {/* Device Information */}
        {peers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Device Information</h2>
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
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Network Activity */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Network Activity</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Activity className="w-4 h-4" />
                <span>Live</span>
              </div>
            </div>
            <div className="relative h-64 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              <PlaceholderPattern className="absolute inset-0 w-full h-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Network activity chart will be displayed here</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">New device connected</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Security update applied</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">User access granted</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Backup completed</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
              <p className="text-blue-100">Manage your network with these common tasks</p>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
                Add Device
              </button>
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
                View Reports
              </button>
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppSidebarLayout>
  );
}