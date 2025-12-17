import { Link } from 'react-router-dom';
import AppLogoIcon from '@/components/app-logo-icon';
import { Check, Zap, Shield, Globe } from 'lucide-react';
import PublicHeader from '@/components/public-header';

export default function Pricing() {
    return (
        <>
            <PublicHeader />

            {/* Hero Section */}
            <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        Choose the plan that fits your needs. All plans include full access to PrivyMesh's quantum-resistant VPN features.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Free Plan */}
                        <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Free
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                                    For individuals or small teams looking for easy-to-use and secure connectivity.
                                </p>
                                <div className="mb-4">
                                    <span className="text-5xl font-bold text-gray-900 dark:text-white">$0</span>
                                    <span className="text-gray-600 dark:text-gray-400 text-lg"> / month</span>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                    <span className="font-semibold text-gray-900 dark:text-white">Up to 5 machines</span>
                                </div>
                                <Link
                                    to="/register"
                                    className="block w-full text-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    Get Started
                                </Link>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600 dark:text-gray-300 text-sm">Peer-to-peer (P2P) encrypted connections</span>
                                </div>
                                <div className="flex items-start">
                                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600 dark:text-gray-300 text-sm">WireGuard-based secure tunnels</span>
                                </div>
                                <div className="flex items-start">
                                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600 dark:text-gray-300 text-sm">Quantum-resistant key exchange concepts</span>
                                </div>
                                <div className="flex items-start">
                                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600 dark:text-gray-300 text-sm">Zero-trust network access</span>
                                </div>
                                <div className="flex items-start">
                                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600 dark:text-gray-300 text-sm">Centralized web dashboard</span>
                                </div>
                                <div className="flex items-start">
                                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600 dark:text-gray-300 text-sm">Community support</span>
                                </div>
                            </div>
                        </div>

                        {/* Team Plan - Featured */}
                        <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 border-2 border-blue-500 transform scale-105 shadow-xl relative">
                            <div className="absolute top-4 right-4">
                                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-white text-xs font-medium">
                                    Popular
                                </span>
                            </div>
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    Team
                                </h3>
                                <p className="text-blue-100 text-sm mb-6">
                                    For teams replacing legacy VPNs with secure remote access and site-to-site connectivity.
                                </p>
                                <div className="mb-4">
                                    <span className="text-5xl font-bold text-white">$6</span>
                                    <span className="text-blue-100 text-lg"> / month</span>
                                </div>
                                <div className="text-sm text-blue-100 mb-6">
                                    <span className="font-semibold text-white">Up to 20 machines</span>
                                </div>
                                <Link
                                    to="/register"
                                    className="block w-full text-center px-6 py-3 border-2 border-white text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
                                >
                                    Try for Free
                                </Link>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <Check className="w-5 h-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-white text-sm">Everything in Free, plus:</span>
                                </div>
                                <div className="flex items-start">
                                    <Check className="w-5 h-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-white text-sm">Advanced network routing</span>
                                </div>
                                <div className="flex items-start">
                                    <Check className="w-5 h-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-white text-sm">Private DNS support</span>
                                </div>
                                <div className="flex items-start">
                                    <Check className="w-5 h-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-white text-sm">Device-based access control</span>
                                </div>
                                <div className="flex items-start">
                                    <Check className="w-5 h-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-white text-sm">Improved scalability for team environments</span>
                                </div>
                                <div className="flex items-start">
                                    <Check className="w-5 h-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-white text-sm">Email-based support</span>
                                </div>
                            </div>
                        </div>

                        {/* Business Plan */}
                        <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Business
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                                    For organizations adopting a modern Zero Trust networking approach.
                                </p>
                                <div className="mb-4">
                                    <span className="text-5xl font-bold text-gray-900 dark:text-white">$12</span>
                                    <span className="text-gray-600 dark:text-gray-400 text-lg"> / month</span>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                    <span className="font-semibold text-gray-900 dark:text-white">Up to 50 machines</span>
                                </div>
                                <Link
                                    to="/register"
                                    className="block w-full text-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    Try for Free
                                </Link>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600 dark:text-gray-300 text-sm">Everything in Team, plus:</span>
                                </div>
                                <div className="flex items-start">
                                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600 dark:text-gray-300 text-sm">Enhanced device verification</span>
                                </div>
                                <div className="flex items-start">
                                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600 dark:text-gray-300 text-sm">Policy-based network segmentation</span>
                                </div>
                                <div className="flex items-start">
                                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600 dark:text-gray-300 text-sm">Traffic visibility (basic, non-logging)</span>
                                </div>
                                <div className="flex items-start">
                                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600 dark:text-gray-300 text-sm">High availability control plane</span>
                                </div>
                                <div className="flex items-start">
                                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600 dark:text-gray-300 text-sm">Priority support</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Additional Info Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            All Plans Include
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Core features available across all pricing tiers
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6 rounded-xl bg-white dark:bg-gray-900">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Quantum-Resistant Security
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                Enhanced key exchange mechanisms designed for future-proof security
                            </p>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-white dark:bg-gray-900">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                High Performance
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                WireGuard-based peer-to-peer connectivity for low latency and high throughput
                            </p>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-white dark:bg-gray-900">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Globe className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Cross-Platform Support
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                Unified client architecture compatible with multiple operating systems
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Academic Project Note */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                            <strong className="text-gray-900 dark:text-white">Note:</strong> PrivyMesh is developed as a Final Year Software Engineering Project 
                            for academic and research purposes. Pricing shown is for demonstration purposes and reflects 
                            potential future commercialization models.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Ready to get started?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Start using PrivyMesh today. Try any plan free to explore all features.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-xl text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all transform hover:scale-105"
                        >
                            Get Started
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

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center space-x-2 mb-4">
                                <AppLogoIcon className="h-8 w-8 rounded-lg" />
                                <span className="text-xl font-bold">PrivyMesh</span>
                            </div>
                            <p className="text-gray-400 mb-4 max-w-md">
                                Secure network management made simple. Enterprise-grade security with an intuitive interface.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">Twitter</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">GitHub</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A9.019 9.019 0 0020 12.017C20 6.484 15.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Product</h3>
                            <ul className="space-y-3">
                                <li><Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link></li>
                                <li><Link to="/docs" className="text-gray-300 hover:text-white transition-colors">Documentation</Link></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Company</h3>
                            <ul className="space-y-3">
                                <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link></li>
                                <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-gray-800">
                        <p className="text-gray-400 text-sm text-center">
                            © 2025 PrivyMesh. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}

