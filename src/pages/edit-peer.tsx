import AppSidebarLayout from '@/layouts/AppSidebarLayout';
import { type BreadcrumbItem } from '@/types';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPeer, updatePeer, type PeerResponse } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icon } from '@/components/icon';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

// Extended interface to handle additional fields
interface ExtendedPeerResponse extends PeerResponse {
    public_ip?: string;
    region?: string;
    operating_system?: string;
    serial_number?: string;
}

export default function EditPeer() {
    const { peerId } = useParams<{ peerId: string }>();
    const navigate = useNavigate();
    const [peer, setPeer] = useState<ExtendedPeerResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);
    
    // Form state
    const [name, setName] = useState('');
    const [ipAddress, setIpAddress] = useState('');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Peers',
            href: '/peers',
        },
        {
            title: peer?.name || 'Edit Peer',
            href: `/peers/${peerId}`,
        },
        {
            title: 'Edit',
            href: `/peers/${peerId}/edit`,
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
                const extendedPeer = peerData as ExtendedPeerResponse;
                setPeer(extendedPeer);
                setName(extendedPeer.name || '');
                setIpAddress(extendedPeer.ip_address || '');
            } catch (err) {
                console.error('Error fetching peer:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch peer details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPeer();
    }, [peerId]);

    const validateIpAddress = (ip: string): boolean => {
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (!ipRegex.test(ip)) return false;
        
        const parts = ip.split('.').map(Number);
        return parts.every(part => part >= 0 && part <= 255);
    };

    const handleSave = async () => {
        if (!peerId || !peer) return;

        setSaveError(null);

        // Validate inputs
        if (!name.trim()) {
            setSaveError('Name is required');
            return;
        }

        if (ipAddress.trim() && !validateIpAddress(ipAddress.trim())) {
            setSaveError('Invalid IP address format');
            return;
        }

        try {
            setIsSaving(true);
            
            if (!peerId || peerId.trim() === '') {
                throw new Error('Invalid peer ID');
            }

            const updates: { name?: string; ip_address?: string } = {};
            
            if (name.trim() !== peer.name) {
                updates.name = name.trim();
            }
            
            if (ipAddress.trim() !== peer.ip_address) {
                updates.ip_address = ipAddress.trim();
            }

            if (Object.keys(updates).length === 0) {
                // No changes made, just navigate back
                navigate(`/peers/${peerId}`);
                return;
            }

            await updatePeer(peerId, updates);
            
            // Navigate back to peer detail page
            navigate(`/peers/${peerId}`);
        } catch (err) {
            console.error('Error updating peer:', err);
            setSaveError(err instanceof Error ? err.message : 'Failed to update peer');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        navigate(`/peers/${peerId}`);
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <div className="mt-6 mb-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link 
                        to={`/peers/${peerId}`}
                        className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                    >
                        <Icon iconNode={ArrowLeft} className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Edit Peer</h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Update the peer's name and IP address.
                        </p>
                    </div>
                </div>

                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400">Loading peer details...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-red-800 dark:text-red-200 font-medium">Error</p>
                        <p className="text-red-600 dark:text-red-300 mt-1">{error}</p>
                    </div>
                )}

                {!isLoading && !error && peer && (
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                                Peer Information
                            </CardTitle>
                            <CardDescription>
                                Update the peer's name and IP address. Changes will be applied immediately.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {saveError && (
                                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                                        <Icon iconNode={AlertCircle} className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-red-800 dark:text-red-200 font-medium">Error</p>
                                            <p className="text-red-600 dark:text-red-300 mt-1">{saveError}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter peer name"
                                        className="w-full"
                                    />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        A friendly name to identify this peer.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ipAddress">IP Address</Label>
                                    <Input
                                        id="ipAddress"
                                        value={ipAddress}
                                        onChange={(e) => setIpAddress(e.target.value)}
                                        placeholder="e.g., 10.0.0.1"
                                        className="w-full font-mono"
                                    />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        The WireGuard assigned IP address for this peer.
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 pt-4">
                                    <Button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex items-center gap-2"
                                    >
                                        <Icon iconNode={Save} className="h-4 w-4" />
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                    <Button
                                        onClick={handleCancel}
                                        variant="outline"
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppSidebarLayout>
    );
}

