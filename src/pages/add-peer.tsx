import AppSidebarLayout from '@/layouts/AppSidebarLayout';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Icon } from '@/components/icon';
import { ArrowLeft, Check, Copy, Terminal, Shield, AlertCircle, CheckCircle2, Monitor } from 'lucide-react';
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

type OsTab = 'windows' | 'linux';

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
                                <div className="flex flex-wrap gap-4">
                                    {([
                                        { id: 'windows', label: 'Windows', icon: Monitor },
                                        { id: 'linux', label: 'Linux', icon: Terminal },
                                    ] as { id: OsTab; label: string; icon: typeof Monitor }[]).map(t => (
                                        <Button
                                            key={t.id}
                                            type="button"
                                            size="lg"
                                            variant={osTab === t.id ? 'default' : 'outline'}
                                            onClick={() => setOsTab(t.id)}
                                            className="flex items-center gap-2 px-6 py-3"
                                        >
                                            <Icon iconNode={t.icon} className="h-5 w-5" />
                                            {t.label}
                                    </Button>
                                    ))}
                                </div>

                                {/* Commands */}
                                {osTab === 'windows' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                                <Icon iconNode={Monitor} className="h-5 w-5" />
                                                Install on Windows
                                            </h3>
                                            
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
                                                        <h4 className="font-medium text-gray-900 dark:text-white">Sign up using your email address</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {osTab === 'linux' && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Icon iconNode={Terminal} className="h-5 w-5 text-gray-900 dark:text-white" />
                                            <Label>Shell</Label>
                                        </div>
                                        <div className="relative">
                                            <pre className="bg-gray-900 text-gray-100 rounded-md p-4 overflow-x-auto text-sm">
{`curl -fsSL https://install.privymesh.com | sh
privymesh login `}
                                            </pre>
                                            <div className="absolute top-2 right-2">
                                                <Button size="sm" variant="secondary" onClick={() => handleCopy('cmd-linux', `curl -fsSL https://install.privymesh.com | sh\nprivymesh login`)}>
                                                    <Icon iconNode={copied['cmd-linux'] ? Check : Copy} className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
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
                                            <li>Check that your network allows UDP traffic</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Installation Problems</h4>
                                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                            <li>On Linux, ensure you have root/sudo privileges for installation</li>
                                            <li>On Windows, check Windows Defender isn't blocking the installer</li>
                                        </ul>
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
