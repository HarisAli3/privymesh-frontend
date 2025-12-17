import { Link } from 'react-router-dom';
import AppLogoIcon from '@/components/app-logo-icon';
import { useAuth } from '@/contexts/AuthContext';

export default function PublicHeader() {
    const { isAuthenticated } = useAuth();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 dark:bg-gray-900/80 dark:border-gray-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0">
                            <div className="flex items-center space-x-2">
                                <AppLogoIcon className="h-8 w-8 rounded-lg" />
                                <span className="text-xl font-bold text-gray-900 dark:text-white">PrivyMesh</span>
                            </div>
                        </Link>
                    </div>
                    
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link to="/about" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors">
                                About
                            </Link>
                            <Link to="/contact" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors">
                                Contact
                            </Link>
                            <Link to="/docs" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors">
                                Docs
                            </Link>
                            <Link to="/pricing" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors">
                                Pricing
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <Link
                                to="/dashboard"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

