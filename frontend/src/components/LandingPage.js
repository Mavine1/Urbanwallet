import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const LandingPage = () => {
    const { theme, toggleTheme } = useTheme();

    const features = [
        {
            title: 'Send Money',
            description: 'Send money instantly to any bank account in Kenya',
        },
        {
            title: 'Buy Airtime',
            description: 'Purchase airtime for any network instantly',
        },
        {
            title: 'Secure Payments',
            description: 'Your transactions are protected with bank-level security',
        },
        {
            title: 'Instant Deposits',
            description: 'Deposit money using M-Pesa with instant availability',
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-urban-dark-300/80 backdrop-blur-md border-b border-gray-200 dark:border-urban-blue-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-urban-blue-600 to-urban-blue-800 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">U</span>
                            </div>
                            <span className="text-xl font-bold text-urban-blue-500">UrbanWallet</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-urban-dark-400 transition"
                                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            >
                                {theme === 'dark' ? (
                                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                )}
                            </button>
                            <Link
                                to="/login"
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-urban-blue-500 transition"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 text-sm font-medium bg-urban-blue-600 text-white rounded-lg hover:bg-urban-blue-700 transition"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        <span className="text-urban-blue-500">Secure</span> Digital Wallet
                        <br />
                        for Kenya
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
                        Send money, buy airtime, and manage your finances with ease.
                        Bank-level security meets simple design.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="px-8 py-4 text-lg font-semibold bg-urban-blue-600 text-white rounded-xl hover:bg-urban-blue-700 transition shadow-lg hover:shadow-xl"
                        >
                            Create Free Account
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-4 text-lg font-semibold bg-white dark:bg-urban-dark-200 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-urban-blue-800 rounded-xl hover:bg-gray-50 dark:hover:bg-urban-dark-300 transition"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-gray-50 dark:bg-urban-dark-300">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                        Everything You Need
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                        Manage your money with powerful tools designed for Kenya
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-urban-dark-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100 dark:border-urban-blue-800"
                            >
                                <div className="w-12 h-12 rounded-xl bg-urban-blue-600 flex items-center justify-center mb-4">
                                    <span className="text-white font-bold text-xl">{index + 1}</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                        How It Works
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                        Get started in minutes
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-urban-blue-600 flex items-center justify-center mx-auto mb-4">
                                <span className="text-white font-bold text-2xl">1</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Create Account</h3>
                            <p className="text-gray-600 dark:text-gray-400">Sign up with your email and get started instantly</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-urban-blue-600 flex items-center justify-center mx-auto mb-4">
                                <span className="text-white font-bold text-2xl">2</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Deposit Money</h3>
                            <p className="text-gray-600 dark:text-gray-400">Add funds using M-Pesa or bank transfer</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-urban-blue-600 flex items-center justify-center mx-auto mb-4">
                                <span className="text-white font-bold text-2xl">3</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Start Transacting</h3>
                            <p className="text-gray-600 dark:text-gray-400">Send money, buy airtime, and more</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-urban-blue-800 to-urban-blue-600">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of Kenyans who trust UrbanWallet for their daily financial needs
                    </p>
                    <Link
                        to="/register"
                        className="inline-block px-8 py-4 text-lg font-semibold bg-white text-urban-blue-600 rounded-xl hover:bg-gray-100 transition shadow-lg"
                    >
                        Create Free Account
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 bg-white dark:bg-urban-dark-200 border-t border-gray-200 dark:border-urban-blue-800">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        2024 UrbanWallet. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;