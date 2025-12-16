import { Link } from 'react-router-dom';
import AppLogoIcon from '@/components/app-logo-icon';
import { ArrowLeft, Book, FileText, Code, Settings, Shield, Zap, Search } from 'lucide-react';

export default function Docs() {
    return (
        <>
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 dark:bg-gray-900/80 dark:border-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center space-x-2">
                                <AppLogoIcon className="h-8 w-8 rounded-lg" />
                                <span className="text-xl font-bold text-gray-900 dark:text-white">PrivyMesh</span>
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
                            <Link
                                to="/"
                                className="inline-flex items-center text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-6">
                        <Book className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        Documentation
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        Detailed technical and user guidance for the VPN system
                    </p>
                    
                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search documentation..."
                                className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Documentation Sections */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Getting Started */}
                        <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group cursor-pointer">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Installation & Setup
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Installation and setup guides to get you started with PrivyMesh quickly.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                                <li>• System requirements</li>
                                <li>• Installation steps</li>
                                <li>• Initial configuration</li>
                                <li>• First connection setup</li>
                            </ul>
                        </div>

                        {/* API Reference */}
                        <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group cursor-pointer">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Code className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                API & Dashboard Usage
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                API documentation and dashboard usage guides for programmatic access and management.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                                <li>• RESTful API endpoints</li>
                                <li>• Dashboard features</li>
                                <li>• Authentication methods</li>
                                <li>• Integration examples</li>
                            </ul>
                        </div>

                        {/* Security */}
                        <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group cursor-pointer">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Network & Security Design
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Detailed information about network architecture and security design principles.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                                <li>• Zero-trust networking</li>
                                <li>• Quantum-resistant cryptography</li>
                                <li>• WireGuard implementation</li>
                                <li>• Security best practices</li>
                            </ul>
                        </div>

                        {/* Configuration */}
                        <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group cursor-pointer">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Settings className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Client Configuration
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Client configuration instructions for setting up devices across different platforms.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                                <li>• Cross-platform setup</li>
                                <li>• Client configuration files</li>
                                <li>• Network settings</li>
                                <li>• Advanced options</li>
                            </ul>
                        </div>

                        {/* Architecture */}
                        <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group cursor-pointer">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                System Architecture
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                System architecture overview explaining the design and components of PrivyMesh.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                                <li>• Architecture overview</li>
                                <li>• Component descriptions</li>
                                <li>• Data flow diagrams</li>
                                <li>• Design decisions</li>
                            </ul>
                        </div>

                        {/* Technical Details */}
                        <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group cursor-pointer">
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Book className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Technical Details
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Comprehensive technical documentation for end-users and technical reviewers.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                                <li>• Protocol specifications</li>
                                <li>• Cryptographic details</li>
                                <li>• Performance metrics</li>
                                <li>• Troubleshooting guides</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        Need Help?
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                        Can't find what you're looking for? Our support team is here to help.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/contact"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            Contact Support
                        </Link>
                        <Link
                            to="/register"
                            className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            Start Free Trial
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}

