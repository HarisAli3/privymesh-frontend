import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useAuth } from '@/contexts/AuthContext';
import { type User } from '@/types';
import { LogOut, Settings } from 'lucide-react';
import type { NavigateFunction } from 'react-router-dom';

interface UserMenuContentProps {
    user: User;
    navigate: NavigateFunction;
}

export function UserMenuContent({ user, navigate }: UserMenuContentProps) {
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleSettings = () => {
        navigate('/settings');
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem 
                    onClick={handleSettings}
                    className="block w-full hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 dark:hover:text-blue-300 transition-all duration-200 transform hover:scale-[1.01] rounded-lg"
                >
                    <Settings className="mr-2" />
                    Settings
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
                onClick={handleLogout}
                className="block w-full hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 dark:hover:text-red-300 transition-all duration-200 transform hover:scale-[1.01] rounded-lg"
            >
                <LogOut className="mr-2" />
                Log out
            </DropdownMenuItem>
        </>
    );
}
