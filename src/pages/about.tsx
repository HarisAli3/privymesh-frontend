import { Link } from 'react-router-dom';
import AppLogoIcon from '@/components/app-logo-icon';
import { Users, Target, Award, Shield } from 'lucide-react';
import PublicHeader from '@/components/public-header';

export default function About() {
    return (
        <>
            <PublicHeader />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        About PrivyMesh
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        PrivyMesh is a modern, quantum-resistant, peer-to-peer VPN platform built for secure, high-performance private networking.
                    </p>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        PrivyMesh enables organizations to connect users, devices, and infrastructure through encrypted peer-to-peer tunnels while maintaining centralized visibility and control. By eliminating unnecessary intermediaries and embracing next-generation cryptography, PrivyMesh delivers secure connectivity that is fast, resilient, and future-ready.
                    </p>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        Our platform is designed for teams and organizations that require strong security guarantees, low-latency communication, and simplified network management across distributed environments.
                    </p>
                </div>
            </section>

            {/* What We Do Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-6">
                            <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            What We Do
                        </h2>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                        PrivyMesh provides a secure networking layer that allows trusted devices to communicate directly over encrypted channels. The system combines decentralized connectivity with centralized policy management, ensuring security without sacrificing performance or operational simplicity.
                    </p>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        By adopting a zero-trust model and forward-looking cryptographic design, PrivyMesh helps organizations protect sensitive data, reduce attack surfaces, and prepare for emerging security challenges.
                    </p>
                </div>
            </section>

            {/* Key Capabilities Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Key Capabilities
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-2xl bg-white dark:bg-gray-900">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Secure Peer-to-Peer Networking
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                PrivyMesh establishes direct encrypted tunnels between devices, reducing latency and improving performance compared to traditional hub-based VPN architectures.
                            </p>
                        </div>
                        
                        <div className="p-8 rounded-2xl bg-white dark:bg-gray-900">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
                                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Quantum-Resistant Cryptography
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Designed with long-term security in mind, PrivyMesh integrates advanced key exchange mechanisms intended to withstand future quantum computing threats.
                            </p>
                        </div>
                        
                        <div className="p-8 rounded-2xl bg-white dark:bg-gray-900">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-6">
                                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Zero-Trust Access Model
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Every device must authenticate before joining the network. Access is continuously verified, ensuring that trust is explicit, enforced, and auditable.
                            </p>
                        </div>
                        
                        <div className="p-8 rounded-2xl bg-white dark:bg-gray-900">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-6">
                                <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Cross-Platform Connectivity
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                A unified client architecture supports secure connections across multiple operating systems, enabling seamless communication across diverse environments.
                            </p>
                        </div>
                        
                        <div className="p-8 rounded-2xl bg-white dark:bg-gray-900">
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-6">
                                <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Centralized Control & Visibility
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Administrators manage devices, access policies, and network configurations through a centralized web dashboard, maintaining full oversight without compromising decentralization.
                            </p>
                        </div>
                        
                        <div className="p-8 rounded-2xl bg-white dark:bg-gray-900">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mb-6">
                                <Award className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Performance & Reliability
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Optimized for encrypted, real-time communication, PrivyMesh delivers stable and scalable connectivity for modern distributed teams.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Principles Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Our Principles
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Security by Design
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Security is embedded into every layer of PrivyMesh, from cryptographic protocols to network architecture.
                            </p>
                        </div>
                        
                        <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
                                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Simplicity at Scale
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Powerful networking capabilities are delivered through intuitive workflows, reducing operational complexity.
                            </p>
                        </div>
                        
                        <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-6">
                                <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Reliability & Quality
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                We focus on building robust, maintainable systems that organizations can depend on for critical connectivity.
                            </p>
                        </div>
                        
                        <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-6">
                                <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Continuous Innovation
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                PrivyMesh evolves with the security landscape, adopting new techniques to address emerging threats.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technology Focus Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Technology Focus
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-8 rounded-2xl bg-white dark:bg-gray-900">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-6">
                                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Decentralized Secure Networking
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Building peer-to-peer architectures that reduce single points of failure while preserving centralized governance.
                            </p>
                        </div>
                        <div className="text-center p-8 rounded-2xl bg-white dark:bg-gray-900">
                            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-6">
                                <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Post-Quantum Readiness
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Preparing secure communication systems for the next generation of cryptographic challenges.
                            </p>
                        </div>
                        <div className="text-center p-8 rounded-2xl bg-white dark:bg-gray-900">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-6">
                                <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Modern VPN Infrastructure
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Designing secure networking solutions that align with real-world operational and performance requirements.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Closing Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                        Built for the Future of Secure Connectivity
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                        PrivyMesh is designed for organizations that demand privacy, performance, and control over their networks. As security threats evolve, PrivyMesh remains focused on delivering a secure, scalable, and forward-looking networking platform.
                    </p>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        We welcome collaboration and feedback from security professionals, engineers, and organizations looking to advance secure networking.
                    </p>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Ready to get started?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join thousands of organizations that trust PrivyMesh
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-xl text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all transform hover:scale-105"
                        >
                            Start Free Trial
                        </Link>
                        <Link
                            to="/contact"
                            className="inline-flex items-center px-8 py-4 border-2 border-transparent text-lg font-medium rounded-xl text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all"
                        >
                            Contact Us
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

