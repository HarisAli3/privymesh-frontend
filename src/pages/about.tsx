import { Link } from 'react-router-dom';
import AppLogoIcon from '@/components/app-logo-icon';
import { Users, Target, Award, Heart, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function About() {
    const { isAuthenticated } = useAuth();

    return (
        <>
            {/* Navigation */}
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
                                <a href="/#features" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors">
                                    Features
                                </a>
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

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        About PrivyMesh
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        PrivyMesh is a modern, quantum-resistant, peer-to-peer VPN platform built for secure, high-performance private networking.
                    </p>
                </div>
            </section>

            {/* What We Do Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
                <div className="max-w-4xl mx-auto">
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                        PrivyMesh enables organizations to connect users, devices, and infrastructure through encrypted peer-to-peer tunnels while maintaining centralized visibility and control. By eliminating unnecessary intermediaries and embracing next-generation cryptography, PrivyMesh delivers secure connectivity that is fast, resilient, and future-ready.
                    </p>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                        Our platform is designed for teams and organizations that require strong security guarantees, low-latency communication, and simplified network management across distributed environments.
                    </p>
                    <div className="text-center mb-12 mt-12">
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
        </>
    );
}

