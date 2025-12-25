import AppSidebarLayout from '@/layouts/AppSidebarLayout';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Icon } from '@/components/icon';
import { ArrowLeft, Check, Copy, Smartphone, Terminal } from 'lucide-react';
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

                <div className="grid grid-cols-1 gap-6 items-start">
                    {/* Install Commands */}
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
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
                </div>
            </div>
        </AppSidebarLayout>
    );
}
