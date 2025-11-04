import { type NavItem } from '@/types';
import { type ComponentPropsWithoutRef } from 'react';

export function NavFooter({
    items,
    className,
    ...props
}: ComponentPropsWithoutRef<'div'> & {
    items: NavItem[];
}) {
    return (
        <div {...props} className={`space-y-1 ${className || ''}`}>
            <nav className="space-y-1">
                {items.map((item) => (
                    <a
                        key={item.title}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 dark:text-gray-400 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 dark:hover:text-blue-300 transition-all duration-200 hover:scale-[1.01]"
                    >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.title}</span>
                    </a>
                ))}
            </nav>
        </div>
    );
}
