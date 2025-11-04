import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronsUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function NavUser() {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    return (
        <div className="px-2 py-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 dark:text-gray-400 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 dark:hover:text-blue-300 transition-all duration-200 hover:scale-[1.01] group">
                        <UserInfo user={user} />
                        <ChevronsUpDown className="ml-auto h-4 w-4" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-56 rounded-lg"
                    align="end"
                    side="top"
                >
                    <UserMenuContent user={user} navigate={navigate} />
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
