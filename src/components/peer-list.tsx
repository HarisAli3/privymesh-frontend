import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
    MoreHorizontal, 
    Wifi, 
    WifiOff, 
    Clock, 
    MapPin, 
    User, 
    Shield,
    Activity,
    Eye,
    Settings,
    Trash2,
    Edit,
    Check,
    X
} from 'lucide-react';
import { Icon } from '@/components/icon';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Peer {
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
}

interface PeerListProps {
    peers?: Peer[];
    onPeerAction?: (peerId: string, action: string, data?: any) => void;
    onRefresh?: () => void;
    isLoading?: boolean;
}

const mockPeers: Peer[] = [
    {
        id: '1',
        name: 'John\'s MacBook Pro',
        ip: '10.0.0.15',
        status: 'online',
        lastSeen: '2 minutes ago',
        location: 'New York, NY',
        os: 'macOS 14.0',
        version: '0.25.1',
        groups: ['developers', 'admins'],
        isAdmin: true,
        connectionTime: '2h 15m'
    },
    {
        id: '2',
        name: 'Sarah\'s Windows PC',
        ip: '10.0.0.23',
        status: 'online',
        lastSeen: '1 minute ago',
        location: 'San Francisco, CA',
        os: 'Windows 11',
        version: '0.25.1',
        groups: ['developers'],
        isAdmin: false,
        connectionTime: '45m'
    },
    {
        id: '3',
        name: 'Mike\'s iPhone',
        ip: '10.0.0.31',
        status: 'offline',
        lastSeen: '1 hour ago',
        location: 'Boston, MA',
        os: 'iOS 17.1',
        version: '0.24.8',
        groups: ['mobile'],
        isAdmin: false
    },
    {
        id: '4',
        name: 'Server-01',
        ip: '10.0.0.5',
        status: 'online',
        lastSeen: '30 seconds ago',
        location: 'Data Center',
        os: 'Ubuntu 22.04',
        version: '0.25.1',
        groups: ['servers', 'admins'],
        isAdmin: true,
        connectionTime: '5d 12h'
    },
    {
        id: '5',
        name: 'Alex\'s Laptop',
        ip: '10.0.0.42',
        status: 'connecting',
        lastSeen: 'Connecting...',
        location: 'London, UK',
        os: 'Linux Mint',
        version: '0.25.0',
        groups: ['developers'],
        isAdmin: false
    }
];

export function PeerList({ peers = mockPeers, onPeerAction, onRefresh, isLoading = false }: PeerListProps) {
    const [editingPeerId, setEditingPeerId] = useState<string | null>(null);
    const [editingField, setEditingField] = useState<'name' | 'ip' | null>(null);
    const [editName, setEditName] = useState<string>('');
    const [editIP, setEditIP] = useState<string>('');
    const [selectedPeers, setSelectedPeers] = useState<string[]>([]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'online':
                return <Wifi className="h-4 w-4 text-green-500" />;
            case 'offline':
                return <WifiOff className="h-4 w-4 text-gray-400" />;
            case 'connecting':
                return <Activity className="h-4 w-4 text-yellow-500 animate-pulse" />;
            default:
                return <WifiOff className="h-4 w-4 text-gray-400" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'online':
                return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Online</Badge>;
            case 'offline':
                return <Badge variant="secondary" className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">Offline</Badge>;
            case 'connecting':
                return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-300">Connecting</Badge>;
            default:
                return <Badge variant="secondary">Unknown</Badge>;
        }
    };

    const handlePeerAction = (peerId: string, action: string, data?: any) => {
        if (onPeerAction) {
            onPeerAction(peerId, action, data);
        }
    };

    const handleStartEdit = (peer: Peer, field: 'name' | 'ip') => {
        setEditingPeerId(peer.id);
        setEditingField(field);
        if (field === 'name') {
            setEditName(peer.name);
        } else if (field === 'ip') {
            setEditIP(peer.ip);
        }
    };

    const handleCancelEdit = () => {
        setEditingPeerId(null);
        setEditingField(null);
        setEditName('');
        setEditIP('');
    };

    const handleSaveEdit = (peerId: string, field: 'name' | 'ip') => {
        if (field === 'name' && editName.trim() && editName.trim() !== '') {
            handlePeerAction(peerId, 'updateName', { name: editName.trim() });
            setEditingPeerId(null);
            setEditingField(null);
            setEditName('');
        } else if (field === 'ip' && editIP.trim() && editIP.trim() !== '') {
            // Basic IP validation
            const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
            if (ipRegex.test(editIP.trim())) {
                handlePeerAction(peerId, 'updateIP', { ip_address: editIP.trim() });
                setEditingPeerId(null);
                setEditingField(null);
                setEditIP('');
            } else {
                alert('Please enter a valid IP address (e.g., 10.0.0.1)');
            }
        }
    };

    const handleSelectPeer = (peerId: string) => {
        setSelectedPeers(prev => 
            prev.includes(peerId) 
                ? prev.filter(id => id !== peerId)
                : [...prev, peerId]
        );
    };

    const handleSelectAll = () => {
        if (selectedPeers.length === peers.length) {
            setSelectedPeers([]);
        } else {
            setSelectedPeers(peers.map(peer => peer.id));
        }
    };

    return (
        <div className="space-y-4">
            {/* Header with bulk actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Peers ({peers.length})
                    </h2>
                    {selectedPeers.length > 0 && (
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                {selectedPeers.length} selected
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePeerAction('bulk', 'disconnect')}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <Icon iconNode={WifiOff} className="h-4 w-4 mr-1" />
                                Disconnect
                            </Button>
                        </div>
                    )}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onRefresh}
                    disabled={isLoading}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                    <Icon iconNode={Activity} className="h-4 w-4 mr-1" />
                    Refresh
                </Button>
            </div>

            {/* Peer List Table */}
            <Card className="overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                            <tr>
                                <th className="px-6 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedPeers.length === peers.length && peers.length > 0}
                                        onChange={handleSelectAll}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Peer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    IP Address
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Last Seen
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {peers.map((peer) => (
                                <tr 
                                    key={peer.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                                >
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedPeers.includes(peer.id)}
                                            onChange={() => handleSelectPeer(peer.id)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0">
                                                {getStatusIcon(peer.status)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2">
                                                    {editingPeerId === peer.id && editingField === 'name' ? (
                                                        <div className="flex items-center space-x-2 flex-1">
                                                            <input
                                                                type="text"
                                                                value={editName}
                                                                onChange={(e) => setEditName(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        handleSaveEdit(peer.id, 'name');
                                                                    } else if (e.key === 'Escape') {
                                                                        handleCancelEdit();
                                                                    }
                                                                }}
                                                                className="text-sm font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 flex-1 min-w-0"
                                                                autoFocus
                                                            />
                                                            <button
                                                                onClick={() => handleSaveEdit(peer.id, 'name')}
                                                                className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                                                                title="Save"
                                                            >
                                                                <Icon iconNode={Check} className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={handleCancelEdit}
                                                                className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                                title="Cancel"
                                                            >
                                                                <Icon iconNode={X} className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <p 
                                                                className="text-sm font-medium text-gray-900 dark:text-white truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                                                                onDoubleClick={() => handleStartEdit(peer, 'name')}
                                                                title="Double-click to edit name"
                                                            >
                                                                {peer.name}
                                                            </p>
                                                            {peer.isAdmin && (
                                                                <Icon iconNode={Shield} className="h-4 w-4 text-blue-500" />
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                                    {peer.os && (
                                                        <span className="flex items-center">
                                                            <Icon iconNode={User} className="h-3 w-3 mr-1" />
                                                            {peer.os}
                                                        </span>
                                                    )}
                                                    {peer.location && (
                                                        <span className="flex items-center">
                                                            <Icon iconNode={MapPin} className="h-3 w-3 mr-1" />
                                                            {peer.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            {getStatusBadge(peer.status)}
                                            {peer.connectionTime && peer.status === 'online' && (
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {peer.connectionTime}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            {editingPeerId === peer.id && editingField === 'ip' ? (
                                                <div className="flex items-center space-x-2 flex-1">
                                                    <input
                                                        type="text"
                                                        value={editIP}
                                                        onChange={(e) => setEditIP(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handleSaveEdit(peer.id, 'ip');
                                                            } else if (e.key === 'Escape') {
                                                                handleCancelEdit();
                                                            }
                                                        }}
                                                        className="text-sm font-mono text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 flex-1 min-w-0"
                                                        placeholder="10.0.0.1"
                                                        autoFocus
                                                    />
                                                    <button
                                                        onClick={() => handleSaveEdit(peer.id, 'ip')}
                                                        className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                                                        title="Save"
                                                    >
                                                        <Icon iconNode={Check} className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                        title="Cancel"
                                                    >
                                                        <Icon iconNode={X} className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span 
                                                    className="text-sm text-gray-900 dark:text-white font-mono cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                                                    onDoubleClick={() => handleStartEdit(peer, 'ip')}
                                                    title="Double-click to edit IP address"
                                                >
                                                    {peer.ip}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                                            <Icon iconNode={Clock} className="h-3 w-3" />
                                            <span>{peer.lastSeen}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <Icon iconNode={MoreHorizontal} className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuItem onClick={() => handlePeerAction(peer.id, 'view')}>
                                                    <Icon iconNode={Eye} className="h-4 w-4 mr-2" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handlePeerAction(peer.id, 'settings')}>
                                                    <Icon iconNode={Settings} className="h-4 w-4 mr-2" />
                                                    Settings
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStartEdit(peer, 'name')}>
                                                    <Icon iconNode={Edit} className="h-4 w-4 mr-2" />
                                                    Edit Name
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStartEdit(peer, 'ip')}>
                                                    <Icon iconNode={Edit} className="h-4 w-4 mr-2" />
                                                    Edit IP Address
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {peer.status === 'online' ? (
                                                    <DropdownMenuItem 
                                                        onClick={() => handlePeerAction(peer.id, 'disconnect')}
                                                        className="text-red-600 focus:text-red-600"
                                                    >
                                                        <Icon iconNode={WifiOff} className="h-4 w-4 mr-2" />
                                                        Disconnect
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem onClick={() => handlePeerAction(peer.id, 'connect')}>
                                                        <Icon iconNode={Wifi} className="h-4 w-4 mr-2" />
                                                        Connect
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem 
                                                    onClick={() => handlePeerAction(peer.id, 'delete')}
                                                    className="text-red-600 focus:text-red-600"
                                                >
                                                    <Icon iconNode={Trash2} className="h-4 w-4 mr-2" />
                                                    Remove Peer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Empty State */}
            {peers.length === 0 && (
                <Card className="p-12 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <Icon iconNode={WifiOff} className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No peers found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        No peers are currently connected to your network.
                    </p>
                    <Button onClick={onRefresh} variant="outline">
                        <Icon iconNode={Activity} className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </Card>
            )}
        </div>
    );
}
