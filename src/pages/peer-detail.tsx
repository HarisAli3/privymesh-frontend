import AppSidebarLayout from '@/layouts/AppSidebarLayout';
import { type BreadcrumbItem } from '@/types';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPeer, type PeerResponse } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icon';
import { Edit } from 'lucide-react';

// Extended interface to handle additional fields that might be in the API response
interface ExtendedPeerResponse extends PeerResponse {
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
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            PrivyMesh IP Address (WireGuard assigned IP)
                                        </span>
                                        <span className="text-sm text-gray-900 dark:text-white font-mono text-left sm:text-right break-all">
                                            {peer.ip_address || 'N/A'}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Public IP
                                        </span>
                                        <span className="text-sm text-gray-900 dark:text-white font-mono text-left sm:text-right break-all">
                                            {peer.public_ip || 'N/A'}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Hostname
                                        </span>
                                        <span className="text-sm text-gray-900 dark:text-white text-left sm:text-right break-words">
                                            {peer.name || 'N/A'}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Region
                                        </span>
                                        <span className="text-sm text-gray-900 dark:text-white text-left sm:text-right break-words">
                                            {peer.region || 'N/A'}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Operating System
                                        </span>
                                        <span className="text-sm text-gray-900 dark:text-white text-left sm:text-right break-words">
                                            {peer.operating_system || 'N/A'}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Serial Number
                                        </span>
                                        <span className="text-sm text-gray-900 dark:text-white font-mono text-left sm:text-right break-all">
                                            {peer.serial_number || 'N/A'}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Device Registered On
                                        </span>
                                        <span className="text-sm text-gray-900 dark:text-white text-left sm:text-right break-words">
                                            {formatDate(peer.created_at)}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 py-3">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
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

