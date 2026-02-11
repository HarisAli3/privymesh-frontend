import AppSidebarLayout from '@/layouts/AppSidebarLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Shield, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { updateProfile, deleteAccount, getUser } from '@/lib/api';

export default function Settings() {
    const { user, refreshUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    // Update form when user changes
    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        
        setError(null);
        setIsSaving(true);
        
        try {
            const payload: { email?: string; name?: string } = {};
            if (email !== user.email) payload.email = email;
            if (name !== user.name) payload.name = name;

            // Only call API if something changed
            if (Object.keys(payload).length === 0) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
                setIsSaving(false);
                return;
            }

            const result = await updateProfile(payload);
            
            console.log('[Settings] Profile update successful:', result);
            
            // Immediately update AuthContext with the response data
            // This ensures UI reflects changes instantly without requiring logout/login
            try {
                // Update auth context with the updated data from backend response
                await refreshUser({
                    user_id: result.user_id,
                    email: result.email,
                    name: result.name,
                });
                
                console.log('[Settings] AuthContext refreshed with new data');
                
                // Update local form state with response data
                if (result.email) setEmail(result.email);
                if (result.name) setName(result.name);
            } catch (refreshError) {
                console.warn('Failed to refresh auth context:', refreshError);
                // Still show success - the update worked, UI should update from response
                
                // Fallback: try fetching fresh data from backend
                try {
                    const updatedUserData = await getUser();
                    if (updatedUserData.email) setEmail(updatedUserData.email);
                    if (updatedUserData.name) setName(updatedUserData.name);
                    await refreshUser(updatedUserData);
                } catch (fetchError) {
                    console.warn('Failed to fetch fresh user data:', fetchError);
                }
            }
            
            // Show success message
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
            setError(errorMessage);
            console.error('Profile update error:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') {
            setError('Please type "DELETE" to confirm account deletion');
            return;
        }

        setError(null);
        setIsDeleting(true);
        
        try {
            await deleteAccount();
            console.log('[Settings] Account deleted successfully');
            
            // On successful deletion, clear all auth state locally
            // DON'T call logout() - account no longer exists in Zitadel
            // Instead, clear all state and redirect directly
            try {
                // Clear all authentication state without calling Zitadel logout
                const zitadelAuth = (await import('@/lib/zitadel-auth')).default;
                
                // Clear state synchronously BEFORE redirect
                zitadelAuth.clearAllAuthState();
                
                console.log('[Settings] All auth state cleared');
                
                // Wait a moment to ensure storage is cleared
                await new Promise(resolve => setTimeout(resolve, 200));
                
            } catch (clearError) {
                console.warn('Failed to clear auth state after deletion:', clearError);
                // Continue anyway - we'll redirect
            }
            
            // Force a full page reload - use replace to prevent back button issues
            // Add a cache-busting parameter to ensure fresh load
            window.location.replace('/?deleted=1&t=' + Date.now());
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete account';
            setError(errorMessage);
            console.error('Account deletion error:', err);
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
            setDeleteConfirmText('');
        }
    };

    return (
        <AppSidebarLayout breadcrumbs={[{ title: 'Settings', href: '/settings' }]}>
            <div className="space-y-8">
                {/* Profile Information */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Update your name and email address</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid gap-3">
                            <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                className="h-12 px-4 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                className="h-12 px-4 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Enter your email address"
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}
                        <div className="flex items-center gap-4 pt-4">
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="h-11 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                            {showSuccess && (
                                <p className="text-sm text-green-600 dark:text-green-400">Profile updated successfully!</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Password Management */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Password & Security</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Change your account password through the secure PrivyMesh portal
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            For security, password changes are handled by our identity provider. You&apos;ll be redirected to a
                            secure page where you can change the password for{' '}
                            <span className="font-medium text-gray-900 dark:text-white">
                                {user?.email ?? 'your account'}
                            </span>
                            .
                        </p>
                        <Button
                            onClick={() => {
                                if (!user?.email) {
                                    setError('Unable to start password change: email is not available.');
                                    return;
                                }

                                const baseUrl = 'https://auth.privymesh.com/ui/console/users/me/password';
                                const url = `${baseUrl}?username=${encodeURIComponent(user.email)}`;
                                window.location.href = url;
                            }}
                            className="h-11 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
                            disabled={!user?.email}
                        >
                            Change Password
                        </Button>
                        {!user?.email && (
                            <p className="text-xs text-red-600 dark:text-red-400">
                                Your email address is not available. Try reloading the page or signing in again.
                            </p>
                        )}
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                            <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Danger Zone</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Irreversible and destructive actions</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {!showDeleteConfirm ? (
                            <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900/50 rounded-lg bg-red-50 dark:bg-red-900/10">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Delete Account</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Permanently delete your account and all of its data. This action cannot be undone.
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20"
                                >
                                    Delete Account
                                </Button>
                            </div>
                        ) : (
                            <div className="p-4 border border-red-200 dark:border-red-900/50 rounded-lg bg-red-50 dark:bg-red-900/10">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Confirm Account Deletion
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                    This will permanently delete your account and all associated data. 
                                    Type <strong className="text-red-600 dark:text-red-400">DELETE</strong> to confirm.
                                </p>
                                <div className="space-y-3">
                                    <Input
                                        type="text"
                                        value={deleteConfirmText}
                                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                                        placeholder="Type DELETE to confirm"
                                        className="h-10 border-red-300 dark:border-red-800"
                                    />
                                    <div className="flex items-center gap-3">
                                        <Button
                                            onClick={handleDeleteAccount}
                                            disabled={isDeleting || deleteConfirmText !== 'DELETE'}
                                            variant="outline"
                                            className="border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 disabled:opacity-50"
                                        >
                                            {isDeleting ? 'Deleting...' : 'Confirm Deletion'}
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setShowDeleteConfirm(false);
                                                setDeleteConfirmText('');
                                                setError(null);
                                            }}
                                            variant="outline"
                                            disabled={isDeleting}
                                            className="disabled:opacity-50"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
