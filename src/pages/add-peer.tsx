import AppSidebarLayout from '@/layouts/AppSidebarLayout';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Icon } from '@/components/icon';
import { ArrowLeft, Check, Copy, Smartphone, Terminal, Shield, Info, AlertCircle, CheckCircle2, Network, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Peers',
        href: '/peers',
    },
    {
        title: 'Add Peer',
        href: '/peers/add',
    },
];

type OsTab = 'windows' | 'macos' | 'linux' | 'ios' | 'android';

export default function AddPeer() {
    const [osTab, setOsTab] = useState<OsTab>('windows');
    const generatedKey = ''; // Placeholder - setup key creation removed
    const [copied, setCopied] = useState<Record<string, boolean>>({});

    const handleCopy = async (id: string, text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(prev => ({ ...prev, [id]: true }));
            setTimeout(() => setCopied(prev => ({ ...prev, [id]: false })), 1200);
        } catch (e) {
            console.error('Copy failed', e);
        }
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <div className="mt-6 mb-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link 
                        to="/peers"
                        className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                    >
                        <Icon iconNode={ArrowLeft} className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Add Peer</h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Run the install command on your device to join the network.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-6 max-w-5xl mx-auto">
                    {/* Overview Section */}
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Icon iconNode={Info} className="h-5 w-5 text-blue-600" />
                                What is PrivyMesh?
                            </CardTitle>
                            <CardDescription>
                                Learn about secure peer-to-peer networking
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 text-gray-700 dark:text-gray-300">
                                <p>
                                    PrivyMesh creates a secure, encrypted mesh network that connects your devices directly to each other. 
                                    Once connected, your devices can communicate privately without routing traffic through central servers.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                                    <div className="flex items-start gap-3">
                                        <Icon iconNode={Shield} className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">End-to-End Encryption</h4>
                                            <p className="text-sm">All traffic is encrypted using WireGuard protocol</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Icon iconNode={Network} className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Mesh Networking</h4>
                                            <p className="text-sm">Direct peer-to-peer connections between devices</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Icon iconNode={Lock} className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Zero Trust</h4>
                                            <p className="text-sm">Every connection requires authentication</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Install Commands */}
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Icon iconNode={Terminal} className="h-5 w-5 text-blue-600" />
                                Install and connect
                            </CardTitle>
                            <CardDescription>
                                Choose your OS and run the command. Replace the setup key if needed.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Tabs */}
                                <div className="flex flex-wrap gap-2">
                                    {([
                                        { id: 'windows', label: 'Windows' },
                                        { id: 'linux', label: 'Linux' },
                                        { id: 'macos', label: 'macOS' },
                                        { id: 'ios', label: 'iOS' },
                                        { id: 'android', label: 'Android' },
                                    ] as { id: OsTab; label: string }[]).map(t => (
                                        <Button
                                            key={t.id}
                                            type="button"
                                            size="sm"
                                            variant={osTab === t.id ? 'default' : 'outline'}
                                            onClick={() => setOsTab(t.id)}
                                        >
                                            {t.label}
                                    </Button>
                                    ))}
                                </div>

                                {/* Commands */}
                                {osTab === 'windows' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Install on Windows</h3>
                                            
                                            <div className="space-y-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                                        1
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h4 className="font-medium text-gray-900 dark:text-white">Download and run Windows Installer</h4>
                                                        <Button 
                                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                                            onClick={() => window.open('https://pkgs.netbird.io/windows/x64?_gl=1*11dsaly*_gcl_au*MjE0MDM0MzY5NC4xNzYwOTYwMzQ5LjI0MzkzODI5Ny4xNzYxMDMzMzE1LjE3NjEwMzMzMTQ.', '_blank')}
                                                        >
                                                            Download PrivyMesh
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4">
                                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                                        2
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 dark:text-white">Click on "Connect" from the PrivyMesh icon in your system tray</h4>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4">
                                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                                        3
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 dark:text-white">Sign up using your email address</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {osTab === 'macos' && (
                                    <div className="space-y-2">
                                        <Label>Terminal</Label>
                                        <div className="relative">
                                            <pre className="bg-gray-900 text-gray-100 rounded-md p-4 overflow-x-auto text-sm">
{`brew install netbirdio/netbird/netbird
netbird up --setup-key ${generatedKey || '<YOUR_SETUP_KEY>'}`}
                                            </pre>
                                            <div className="absolute top-2 right-2">
                                                <Button size="sm" variant="secondary" onClick={() => handleCopy('cmd-mac', `brew install netbirdio/netbird/netbird\nnetbird up --setup-key ${generatedKey || '<YOUR_SETUP_KEY>'}`)}>
                                                    <Icon iconNode={copied['cmd-mac'] ? Check : Copy} className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {osTab === 'linux' && (
                                    <div className="space-y-2">
                                        <Label>Shell</Label>
                                        <div className="relative">
                                            <pre className="bg-gray-900 text-gray-100 rounded-md p-4 overflow-x-auto text-sm">
{`curl -fsSL https://get.privymesh.sh | sh
netbird up --setup-key ${generatedKey || '<YOUR_SETUP_KEY>'}`}
                                            </pre>
                                            <div className="absolute top-2 right-2">
                                                <Button size="sm" variant="secondary" onClick={() => handleCopy('cmd-linux', `curl -fsSL https://get.privymesh.sh | sh\nnetbird up --setup-key ${generatedKey || '<YOUR_SETUP_KEY>'}`)}>
                                                    <Icon iconNode={copied['cmd-linux'] ? Check : Copy} className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {(osTab === 'ios' || osTab === 'android') && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                            <Icon iconNode={Smartphone} className="h-4 w-4" />
                                            Install the mobile app and sign in using a setup key.
                                        </div>
                                        <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">
                                            <li>Open the app, go to Add Device, paste your setup key</li>
                                            <li>Alternatively scan a QR code (coming soon)</li>
                                        </ul>
                                        {generatedKey && (
                                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-md px-3 py-2 w-fit">
                                                <code className="font-mono text-sm">{generatedKey}</code>
                                                <Button type="button" size="sm" variant="ghost" onClick={() => handleCopy('key-mobile', generatedKey)}>
                                                    <Icon iconNode={copied['key-mobile'] ? Check : Copy} className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* After Installation */}
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Icon iconNode={CheckCircle2} className="h-5 w-5 text-green-600" />
                                After Installation
                            </CardTitle>
                            <CardDescription>
                                What to expect once your peer is connected
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mt-0.5">
                                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Automatic Connection</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Your device will automatically connect to the mesh network and appear in your peers list.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mt-0.5">
                                            <Network className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Peer Discovery</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                You'll be able to see and connect to other peers in your network from the dashboard.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mt-0.5">
                                            <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Secure Communication</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                All traffic between peers is encrypted and routed through secure tunnels.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Troubleshooting */}
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Icon iconNode={AlertCircle} className="h-5 w-5 text-amber-600" />
                                Troubleshooting
                            </CardTitle>
                            <CardDescription>
                                Common issues and solutions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Connection Issues</h4>
                                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                            <li>Ensure your firewall allows PrivyMesh/NetBird traffic</li>
                                            <li>Check that your network allows UDP traffic on port 51820</li>
                                            <li>Verify your setup key is correct and hasn't expired</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Installation Problems</h4>
                                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                            <li>On Linux, ensure you have root/sudo privileges for installation</li>
                                            <li>On macOS, you may need to allow the app in System Preferences &gt; Security</li>
                                            <li>On Windows, check Windows Defender isn't blocking the installer</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Performance Tips</h4>
                                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                            <li>Keep the application running in the background for best connectivity</li>
                                            <li>Check your internet connection speed if experiencing slow transfers</li>
                                            <li>Ensure peers are online and connected to see them in your network</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security & Privacy */}
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Icon iconNode={Shield} className="h-5 w-5 text-green-600" />
                                Security & Privacy
                            </CardTitle>
                            <CardDescription>
                                How your data is protected
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                <p>
                                    PrivyMesh uses <strong className="text-gray-900 dark:text-white">WireGuard</strong>, a modern VPN protocol 
                                    that provides state-of-the-art cryptography. Your data is encrypted end-to-end, and the mesh network 
                                    operates on a zero-trust model where every connection requires authentication.
                                </p>
                                <div className="pt-2 space-y-2">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span>No central server stores or logs your traffic</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span>All peer-to-peer connections are encrypted</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span>Setup keys are single-use or time-limited for security</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
