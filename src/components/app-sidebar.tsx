import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { type NavItem } from '@/types';
import { Link } from 'react-router-dom';
import { BookOpen, Folder, LayoutGrid, Users, Plus } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Add Peer',
        href: '/peers/add',
        icon: Plus,
    },
    {
        title: 'Peers',
        href: '/peers',
        icon: Users,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Releases',
        href: 'https://github.com/HarisAli3/privymesh-app-releases',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://privymesh.com/docs',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <div className="flex h-full w-full flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm">
            {/* Header */}
            <div className="flex flex-col gap-2 p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                    <Link to="/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                        <AppLogo />
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                <NavMain items={mainNavItems} />
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </div>
        </div>
    );
}