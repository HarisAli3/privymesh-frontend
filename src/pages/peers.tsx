import AppSidebarLayout from '@/layouts/AppSidebarLayout';
import { type BreadcrumbItem } from '@/types';
import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Icon } from '@/components/icon';
import { PeerList } from '@/components/peer-list';
import { getPeers, type PeerResponse } from '@/lib/api';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Peers',
        href: '/peers',
    },
];

type UiPeer = {
    id: string;
    name: string;
    ip: string;
    status: 'online' | 'offline' | 'connecting';
    lastSeen: string;
    location?: string;
    os?: string;
    version?: string;
    groups?: string[];
    isAdmin?: boolean;
    connectionTime?: string;
};

export default function Peers() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline'>('all');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [peers, setPeers] = useState<UiPeer[]>([]);

    const fetchPeers = async () => {
        try {
            setIsLoading(true);
            const resp = await getPeers();
            console.log('Fetched peers response:', resp);
            console.log('Number of peers:', resp.peers?.length || 0);
            const mapped: UiPeer[] = (resp.peers || []).map((p: PeerResponse) => {
                const lastSeenDate = p.last_seen ? new Date(p.last_seen) : null;
                
                // Debug logging
                console.log(`Peer ${p.name} (ID: ${p.id}):`, {
                    last_seen_raw: p.last_seen,
                    last_seen_parsed: lastSeenDate?.toISOString(),
                    current_time: new Date().toISOString(),
                });
                
                // Format lastSeen as relative time (e.g., "2 minutes ago")
                let lastSeen = 'Unknown';
                if (lastSeenDate && !isNaN(lastSeenDate.getTime())) {
                    const now = new Date();
                    const diffMs = now.getTime() - lastSeenDate.getTime();
                    const diffSeconds = Math.floor(diffMs / 1000);
                    const diffMinutes = Math.floor(diffMs / (1000 * 60));
                    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                    
                    // Debug the calculation
                    console.log(`Peer ${p.name} time diff:`, {
                        diffMs,
                        diffSeconds,
                        diffMinutes: diffMinutes.toFixed(2),
                        diffHours: diffHours.toFixed(2),
                    });
                    
                    if (diffSeconds < 60) {
                        lastSeen = `${diffSeconds} second${diffSeconds !== 1 ? 's' : ''} ago`;
                    } else if (diffMinutes < 60) {
                        lastSeen = `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
                    } else if (diffHours < 24) {
                        lastSeen = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
                    } else {
                        lastSeen = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
                    }
                } else {
                    console.warn(`Invalid last_seen for peer ${p.name}:`, p.last_seen);
                }
                
                // Determine status based on last_seen timestamp
                // Consider offline if last seen more than 2 minutes ago (heartbeats are sent every 30 seconds)
                let status: 'online' | 'offline' | 'connecting' = 'offline';
                if (lastSeenDate && !isNaN(lastSeenDate.getTime())) {
                    const now = new Date();
                    const diffMs = now.getTime() - lastSeenDate.getTime();
                    const diffMinutes = diffMs / (1000 * 60);
                    // Consider online if seen within last 2 minutes (heartbeats are sent every 30 seconds)
                    // Also allow small negative values for timezone/clock skew
                    // If no heartbeat for 2+ minutes, the app is likely closed
                    status = diffMinutes <= 2 && diffMinutes >= -1 ? 'online' : 'offline';
                    console.log(`Peer ${p.name} status: ${status} (${diffMinutes.toFixed(2)} minutes ago)`);
                } else {
                    status = 'offline';
                }
                
                return {
                    id: String(p.id),
                    name: p.name || p.public_key,
                    ip: p.ip_address,
                    status,
                    lastSeen,
                };
            });
            setPeers(mapped);
            if (mapped.length === 0) {
                console.warn('No peers found in response');
            }
        } catch (e) {
            console.error('Error fetching peers:', e);
            setPeers([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = () => {
        fetchPeers();
    };

    useEffect(() => {
        fetchPeers();
        
        // Auto-refresh peers every 30 seconds to show updated last_seen and status
        const interval = setInterval(() => {
            fetchPeers();
        }, 30000); // 30 seconds
        
        return () => clearInterval(interval);
    }, []);

    const handlePeerAction = (peerId: string, action: string) => {
        console.log(`Peer action: ${action} for peer ${peerId}`);
        // TODO: Implement actual peer actions
        switch (action) {
            case 'view':
                console.log('Viewing peer details...');
                break;
            case 'settings':
                console.log('Opening peer settings...');
                break;
            case 'connect':
                console.log('Connecting peer...');
                break;
            case 'disconnect':
                console.log('Disconnecting peer...');
                break;
            case 'delete':
                console.log('Removing peer...');
                break;
            default:
                console.log('Unknown action:', action);
        }
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <div className="mt-6 mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Peers</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    A list of all machines and devices connected to your private network. Use this view to manage peers.
                    Learn more about Peers in our documentation.
                </p>

                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-1 items-start sm:items-center justify-start mb-6">
                    {/* Search Input */}
                    <div className="flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search by Name or IP..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                                     placeholder-gray-500 dark:placeholder-gray-400
                                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                     transition-colors duration-200"
                        />
                    </div>

                    {/* Filter Buttons, Rows Per Page, and Refresh */}
                    <div className="flex items-center gap-3">
                        {/* Filter Buttons */}
                        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 gap-[3px] w-48">
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                                    filterStatus === 'all'
                                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilterStatus('online')}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                                    filterStatus === 'online'
                                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                Online
                            </button>
                            <button
                                onClick={() => setFilterStatus('offline')}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                                    filterStatus === 'offline'
                                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                Offline
                            </button>
                        </div>

                        {/* Rows Per Page Dropdown */}
                        <div className="flex items-center gap-2">
                            <label htmlFor="rowsPerPage" className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                                Rows per page:
                            </label>
                            <select
                                id="rowsPerPage"
                                value={rowsPerPage}
                                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md 
                                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                         transition-colors duration-200"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>

                        {/* Refresh Button */}
                        <button
                            onClick={handleRefresh}
                            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white 
                                     hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                            title="Refresh"
                        >
                            <Icon iconNode={RefreshCw} className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Peer List Component */}
                <div className="mt-8">
                    <PeerList 
                        peers={peers
                            .filter(p => (filterStatus === 'all' ? true : p.status === filterStatus))
                            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.ip.includes(searchTerm))
                            .slice(0, rowsPerPage)
                        }
                        onPeerAction={handlePeerAction}
                        onRefresh={handleRefresh}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </AppSidebarLayout>
    );
}
