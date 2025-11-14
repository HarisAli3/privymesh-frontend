import AppSidebarLayout from '@/layouts/AppSidebarLayout';
import { type BreadcrumbItem } from '@/types';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPeer, type PeerResponse } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icon';
import { 
    Edit, 
    Network, 
    Globe, 
    MapPin, 
    Router, 
    Server, 
    Monitor, 
    Hash, 
    Calendar,
    Clock,
    Copy,
    Check
} from 'lucide-react';

// Extended interface to handle additional fields that might be in the API response
interface ExtendedPeerResponse extends PeerResponse {
    endpoint?: string; // Public endpoint (may be STUN-discovered)
    public_ip?: string;
    region?: string;
    operating_system?: string;
    serial_number?: string;
}

export default function PeerDetail() {
    const { peerId } = useParams<{ peerId: string }>();
    const navigate = useNavigate();
    const [peer, setPeer] = useState<ExtendedPeerResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState<Record<string, boolean>>({});

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Peers',
            href: '/peers',
        },
        {
            title: peer?.name || 'Peer Details',
            href: `/peers/${peerId}`,
        },
    ];

    useEffect(() => {
        const fetchPeer = async () => {
            if (!peerId) {
                setError('Peer ID is required');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                
                if (!peerId || peerId.trim() === '') {
                    throw new Error('Invalid peer ID');
                }

                const peerData = await getPeer(peerId);
                setPeer(peerData as ExtendedPeerResponse);
            } catch (err) {
                console.error('Error fetching peer:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch peer details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPeer();
    }, [peerId]);

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return dateString;
        }
    };

    const formatRelativeTime = (dateString: string | undefined) => {
        if (!dateString) return 'Never';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid date';
            
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffSeconds = Math.floor(diffMs / 1000);
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            
            if (diffSeconds < 60) {
                return `${diffSeconds} second${diffSeconds !== 1 ? 's' : ''} ago`;
            } else if (diffMinutes < 60) {
                return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
            } else if (diffHours < 24) {
                return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
            } else {
                return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
            }
        } catch {
            return dateString;
        }
    };

    const handleCopy = async (id: string, text: string) => {
        if (!text || text === 'N/A') return;
        
        try {
            await navigator.clipboard.writeText(text);
            setCopied({ ...copied, [id]: true });
            setTimeout(() => {
                setCopied((prev: Record<string, boolean>) => ({ ...prev, [id]: false }));
            }, 2000);
        } catch (e) {
            console.error('Copy failed', e);
        }
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mt-6 mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Peer Details
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300">
                                View and manage peer information and settings.
                            </p>
                        </div>
                        {!isLoading && !error && peer && (
                            <Button
                                onClick={() => navigate(`/peers/${peerId}/edit`)}
                                className="flex items-center gap-2 w-full sm:w-auto"
                            >
                                <Icon iconNode={Edit} className="h-4 w-4" />
                                Edit
                            </Button>
                        )}
                    </div>
                    
                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600 dark:text-gray-400">Loading peer details...</p>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-red-800 dark:text-red-200 font-medium">Error</p>
                            <p className="text-red-600 dark:text-red-300 mt-1">{error}</p>
                        </div>
                    )}

                    {/* Peer Details Card */}
                    {!isLoading && !error && peer && (
                        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {peer.name || 'Unnamed Peer'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Detail Row - Responsive */}
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                        <span className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                            <Icon iconNode={Network} className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            PrivyMesh IP Address (WireGuard assigned IP)
                                        </span>
                                        <div className="flex items-center gap-2 text-left sm:text-right">
                                            <span className="text-sm text-gray-900 dark:text-white font-mono break-all">
                                                {peer.ip_address || 'N/A'}
                                            </span>
                                            {peer.ip_address && (
                                                <button
                                                    onClick={() => handleCopy('ip_address', peer.ip_address || '')}
                                                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                                    title="Copy IP address"
                                                >
                                                    <Icon 
                                                        iconNode={copied['ip_address'] ? Check : Copy} 
                                                        className={`h-3.5 w-3.5 ${copied['ip_address'] ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`} 
                                                    />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                        <span className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                            <Icon iconNode={Server} className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                            Public Endpoint
                                        </span>
                                        <div className="flex items-center gap-2 text-left sm:text-right">
                                            <span className="text-sm text-gray-900 dark:text-white font-mono break-all">
                                                {peer.endpoint || 'N/A'}
                                            </span>
                                            {peer.endpoint && (
                                                <button
                                                    onClick={() => handleCopy('endpoint', peer.endpoint || '')}
                                                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                                    title="Copy endpoint"
                                                >
                                                    <Icon 
                                                        iconNode={copied['endpoint'] ? Check : Copy} 
                                                        className={`h-3.5 w-3.5 ${copied['endpoint'] ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`} 
                                                    />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                        <span className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                            <Icon iconNode={Globe} className="h-4 w-4 text-green-600 dark:text-green-400" />
                                            Public IP
                                        </span>
                                        <div className="flex items-center gap-2 text-left sm:text-right">
                                            <span className="text-sm text-gray-900 dark:text-white font-mono break-all">
                                                {peer.public_ip || 'N/A'}
                                            </span>
                                            {peer.public_ip && (
                                                <button
                                                    onClick={() => handleCopy('public_ip', peer.public_ip || '')}
                                                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                                    title="Copy public IP"
                                                >
                                                    <Icon 
                                                        iconNode={copied['public_ip'] ? Check : Copy} 
                                                        className={`h-3.5 w-3.5 ${copied['public_ip'] ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`} 
                                                    />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                        <span className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                            <Icon iconNode={Router} className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                            NAT Type
                                        </span>
                                        <span className="text-sm text-gray-900 dark:text-white text-left sm:text-right break-words">
                                            {peer.nat_type ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                    {peer.nat_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </span>
                                            ) : (
                                                'N/A'
                                            )}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                        <span className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                            <Icon iconNode={Monitor} className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                            Hostname
                                        </span>
                                        <div className="flex items-center gap-2 text-left sm:text-right">
                                            <span className="text-sm text-gray-900 dark:text-white break-words">
                                                {peer.name || 'N/A'}
                                            </span>
                                            {peer.name && (
                                                <button
                                                    onClick={() => handleCopy('hostname', peer.name || '')}
                                                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                                    title="Copy hostname"
                                                >
                                                    <Icon 
                                                        iconNode={copied['hostname'] ? Check : Copy} 
                                                        className={`h-3.5 w-3.5 ${copied['hostname'] ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`} 
                                                    />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                        <span className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                            <Icon iconNode={MapPin} className="h-4 w-4 text-red-600 dark:text-red-400" />
                                            Region
                                        </span>
                                        <span className="text-sm text-gray-900 dark:text-white text-left sm:text-right break-words">
                                            {peer.region || 'N/A'}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                        <span className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                            <Icon iconNode={Monitor} className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                                            Operating System
                                        </span>
                                        <span className="text-sm text-gray-900 dark:text-white text-left sm:text-right break-words">
                                            {peer.operating_system || 'N/A'}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                        <span className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                            <Icon iconNode={Hash} className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                                            Serial Number
                                        </span>
                                        <div className="flex items-center gap-2 text-left sm:text-right">
                                            <span className="text-sm text-gray-900 dark:text-white font-mono break-all">
                                                {peer.serial_number || 'N/A'}
                                            </span>
                                            {peer.serial_number && (
                                                <button
                                                    onClick={() => handleCopy('serial_number', peer.serial_number || '')}
                                                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                                    title="Copy serial number"
                                                >
                                                    <Icon 
                                                        iconNode={copied['serial_number'] ? Check : Copy} 
                                                        className={`h-3.5 w-3.5 ${copied['serial_number'] ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`} 
                                                    />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                        <span className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                            <Icon iconNode={Calendar} className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                                            Device Registered On
                                        </span>
                                        <span className="text-sm text-gray-900 dark:text-white text-left sm:text-right break-words">
                                            {formatDate(peer.created_at)}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 py-3">
                                        <span className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                            <Icon iconNode={Clock} className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                            Last Seen
                                        </span>
                                        <span className="text-sm text-gray-900 dark:text-white text-left sm:text-right break-words">
                                            {formatRelativeTime(peer.last_seen)}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppSidebarLayout>
    );
}

