import { Link } from 'react-router-dom';
import AppLogoIcon from '@/components/app-logo-icon';
import { ArrowLeft, Check, Zap, Shield, Globe } from 'lucide-react';

export default function Pricing() {
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
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        Pricing
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        This project is developed for academic and research purposes as part of a Final Year Project.
                    </p>
                </div>
            </section>

            {/* Pricing Information */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-6">
                            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                            Free to Use
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                            No commercial pricing applied. This project is developed for academic and research purposes.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                Educational License
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                PrivyMesh is intended for demonstration, learning, and evaluation purposes as part of 
                                a Final Year Software Engineering Project.
                            </p>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                <li className="flex items-start">
                                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span>Free for academic use</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span>Open for evaluation</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span>Research and learning purposes</span>
                                </li>
                            </ul>
                        </div>
                        
                        <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                No Hidden Costs
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                There are no subscription requirements or hidden costs for the current version of PrivyMesh.
                            </p>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                <li className="flex items-start">
                                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span>No subscription fees</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span>No credit card required</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span>Full feature access</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Future Scope
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Pricing models may be explored in future iterations as part of extended research or 
                            commercialization efforts. For now, PrivyMesh remains completely free for all users.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Included */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            All Features Included
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Every user gets access to all features at no cost
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Quantum-Resistant Security
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Enhanced key exchange mechanisms for future-proof security
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                High Performance
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                WireGuard-based peer-to-peer connectivity for optimal speed
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Globe className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Cross-Platform Support
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Unified client architecture for multiple operating systems
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Ready to get started?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Start using PrivyMesh today. Completely free for academic and research purposes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-xl text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all transform hover:scale-105"
                        >
                            Get Started Free
                        </Link>
                        <Link
                            to="/docs"
                            className="inline-flex items-center px-8 py-4 border-2 border-transparent text-lg font-medium rounded-xl text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all"
                        >
                            View Documentation
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}

