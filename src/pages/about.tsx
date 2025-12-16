import { Link } from 'react-router-dom';
import AppLogoIcon from '@/components/app-logo-icon';
import { ArrowLeft, Users, Target, Award, Heart, Shield } from 'lucide-react';

export default function About() {
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
                        About PrivyMesh
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        A quantum-resistant, peer-to-peer VPN system designed for the future of secure networking.
                    </p>
                </div>
            </section>

            {/* Project Overview Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-6">
                            <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Project Overview
                        </h2>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                        PrivyMesh is a Final Year Software Engineering Project focused on building a quantum-resistant, 
                        peer-to-peer VPN system inspired by modern solutions such as NetBird and Tailscale.
                    </p>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                        Our VPN is designed with modern security and performance in mind, combining peer-to-peer networking 
                        with next-generation cryptography. The goal of this project is to explore secure decentralized 
                        networking, post-quantum cryptography concepts, and real-world VPN architecture and implementation.
                    </p>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        By combining academic research with practical development, this project demonstrates how 
                        next-generation secure communication systems can be designed for future-ready networks.
                    </p>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Key Features
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Our VPN is designed with modern security and performance in mind, combining peer-to-peer networking with next-generation cryptography.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-2xl bg-white dark:bg-gray-900">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Peer-to-Peer Secure Connectivity
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Direct device-to-device tunnels using WireGuard for low latency and high throughput. 
                                Experience fast, stable, and encrypted communication between your devices.
                            </p>
                        </div>
                        
                        <div className="p-8 rounded-2xl bg-white dark:bg-gray-900">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
                                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Quantum-Resistant Security
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Enhanced key exchange mechanisms designed to mitigate future quantum computing threats. 
                                Built for the security challenges of tomorrow, today.
                            </p>
                        </div>
                        
                        <div className="p-8 rounded-2xl bg-white dark:bg-gray-900">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-6">
                                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Zero-Trust Networking
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Devices authenticate securely before joining the private network. Every connection is 
                                verified and encrypted, ensuring maximum security.
                            </p>
                        </div>
                        
                        <div className="p-8 rounded-2xl bg-white dark:bg-gray-900">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-6">
                                <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Cross-Platform Support
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Compatible with multiple operating systems through a unified client architecture. 
                                Connect devices regardless of their platform.
                            </p>
                        </div>
                        
                        <div className="p-8 rounded-2xl bg-white dark:bg-gray-900">
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-6">
                                <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Centralized Management
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Manage devices and network access via an intuitive web dashboard. Control your entire 
                                network from a single, easy-to-use interface.
                            </p>
                        </div>
                        
                        <div className="p-8 rounded-2xl bg-white dark:bg-gray-900">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mb-6">
                                <Award className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                High Performance & Reliability
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Optimized for fast, stable, and encrypted communication. Built with performance in mind 
                                to ensure your network runs smoothly.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Our Values
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Security First
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                We prioritize security in every decision we make, ensuring your network is protected by 
                                industry-leading standards.
                            </p>
                        </div>
                        
                        <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
                                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                User-Centric
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Every feature is designed with our users in mind, focusing on simplicity and intuitive 
                                experiences.
                            </p>
                        </div>
                        
                        <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-6">
                                <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Excellence
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                We strive for excellence in everything we do, from code quality to customer support.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Research Focus Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Research & Development Focus
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Exploring the future of secure networking through academic research and practical implementation
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-8 rounded-2xl bg-gray-50 dark:bg-gray-800">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-6">
                                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Secure Decentralized Networking
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Researching peer-to-peer architectures that eliminate single points of failure while 
                                maintaining security and performance.
                            </p>
                        </div>
                        <div className="text-center p-8 rounded-2xl bg-gray-50 dark:bg-gray-800">
                            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-6">
                                <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Post-Quantum Cryptography
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Exploring quantum-resistant cryptographic algorithms to protect against future 
                                quantum computing threats.
                            </p>
                        </div>
                        <div className="text-center p-8 rounded-2xl bg-gray-50 dark:bg-gray-800">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-6">
                                <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Real-World VPN Architecture
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Implementing and evaluating VPN systems inspired by industry leaders like NetBird 
                                and Tailscale.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Academic Project Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mx-auto mb-6">
                        <Heart className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                        Academic Excellence
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                        PrivyMesh is developed as a Final Year Software Engineering Project, combining rigorous 
                        academic research with practical software development. This project demonstrates how 
                        theoretical concepts in cryptography and network security can be applied to build real-world 
                        solutions.
                    </p>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        We welcome feedback, collaboration, and evaluation from the academic and technical community 
                        to help advance the field of secure networking.
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

