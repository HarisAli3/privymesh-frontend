import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full">
                {/* Sidebar */}
                <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:z-50">
                    <AppSidebar />
                </div>
                
                {/* Mobile sidebar overlay */}
                <div className="md:hidden">
                    {/* Mobile sidebar will be handled by the AppSidebar component */}
                </div>
                
                {/* Main content */}
                <div className="flex flex-1 flex-col md:pl-64">
                    {/* Header */}
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white dark:bg-gray-900 px-4">
                        <SidebarTrigger className="md:hidden" />
                        <div className="flex items-center gap-2">
                            {breadcrumbs.map((breadcrumb, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    {index > 0 && <span className="text-gray-400">/</span>}
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                        {breadcrumb.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </header>
                    
                    {/* Content */}
                    <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-900/20">
                        <div className="p-6">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}