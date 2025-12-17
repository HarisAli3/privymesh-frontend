import { Link } from 'react-router-dom';
import AppLogoIcon from '@/components/app-logo-icon';
import { Mail, MessageSquare, Book } from 'lucide-react';
import PublicHeader from '@/components/public-header';

export default function Contact() {
    return (
        <>
            <PublicHeader />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        Get in Touch
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        Have questions, feedback, or suggestions? We welcome constructive feedback to help improve the project.
                    </p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Contact our team
                            </h2>
                            <form className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Subject <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="What's this about?"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Message <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={6}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Your message..."
                                    />
                                </div>
                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        id="email-consent"
                                        name="email-consent"
                                        required
                                        className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor="email-consent" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                                        I agree to receive emails regarding my questions or reported issues from the Privymesh eam <span className="text-red-500">*</span>
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    <MessageSquare className="w-5 h-5 mr-2" />
                                    Send Request
                                </button>
                            </form>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Contact Options
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                            <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                            Email Support
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Contact us via email for project-related inquiries, technical discussions, 
                                            or academic collaboration.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                            <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                            Contact Form
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Use the contact form on this page to send us your questions, feedback, 
                                            or suggestions directly.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                            <Book className="w-6 h-6 text-green-600 dark:text-green-400" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                            Documentation
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Check our documentation for technical details, setup guides, and 
                                            comprehensive system information.
                                        </p>
                                        <Link
                                            to="/docs"
                                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm mt-2 inline-block"
                                        >
                                            View Documentation →
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    What We Welcome
                                </h3>
                                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                    <li>• Project-related inquiries</li>
                                    <li>• Technical discussions</li>
                                    <li>• Constructive feedback</li>
                                </ul>
                            </div>
                        </div>
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

