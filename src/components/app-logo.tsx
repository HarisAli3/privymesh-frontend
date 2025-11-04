import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex items-center justify-center">
                <AppLogoIcon className="h-8 w-8 rounded-lg" />
            </div>
            <div className="ml-3 grid flex-1 text-left">
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                    PrivyMesh
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Secure Network Management
                </span>
            </div>
        </>
    );
}
