import { type NavItem } from '@/types';
import { Link, useLocation } from 'react-router-dom';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const location = useLocation();
    
    return (
        <div className="px-2 py-4">
            <div className="px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Platform
            </div>
            
            <nav className="space-y-1">
                {items.map((item) => (
                    <Link
                        key={item.title}
                        to={item.href}
                        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            location.pathname === item.href 
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]" 
                                : "text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 dark:text-gray-400 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 dark:hover:text-blue-300 hover:scale-[1.01]"
                        }`}
                    >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.title}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
}
