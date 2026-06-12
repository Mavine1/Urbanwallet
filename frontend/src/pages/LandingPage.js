import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const features = [
        {
            title: 'Non-Custodial Wallet',
            description: 'Full control over your private keys. Your money, your rules.',
            link: '#',
            icon: '🔐'
        },
        {
            title: 'Built-in Exchange',
            description: 'Swap cryptocurrencies and fiat directly within the app.',
            link: '#',
            icon: '🔄'
        },
        {
            title: 'Biometric Security',
            description: 'Face ID & fingerprint authentication for extra protection.',
            link: '#',
            icon: '👆'
        },
        {
            title: 'QR Code Payments',
            description: 'Send and receive money effortlessly with QR codes.',
            link: '#',
            icon: '📱'
        }
    ];

    const reviews = [
        {
            name: 'John Mwangi',
            role: 'Business Owner',
            content: 'UrbanWallet has transformed how I handle payments. Fast, secure, and incredibly user-friendly!',
            rating: 5
        },
        {
            name: 'Sarah Wanjiku',
            role: 'Freelancer',
            content: 'The best digital wallet in Kenya. I love how easy it is to send money and buy airtime.',
            rating: 5
        },
        {
            name: 'Michael Otieno',
            role: 'Investor',
            content: 'Secure, reliable, and feature-rich. The biometric login gives me peace of mind.',
            rating: 5
        }
    ];

    const supportedCoins = [
        'Bitcoin (BTC)', 'Ethereum (ETH)', 'M-PESA', 'Binance Smart Chain',
        'Litecoin (LTC)', 'Ripple (XRP)', 'Cardano (ADA)', 'USDT (ERC-20/BEP-20)'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-urban-dark-500 to-urban-dark-300">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-urban-dark-300/95 backdrop-blur-md border-b border-urban-blue-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-urban-blue-600 to-urban-blue-800 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">U</span>
                            </div>
                            <span className="text-xl font-bold text-urban-blue-500">UrbanWallet</span>
                        </div>

                        <div className="hidden md:flex items-center gap-6">
                            <a href="#about" className="text-gray-300 hover:text-urban-blue-400 transition">About</a>
                            <a href="#features" className="text-gray-300 hover:text-urban-blue-400 transition">Features</a>
                            <a href="#faq" className="text-gray-300 hover:text-urban-blue-400 transition">FAQ</a>
                            <a href="#reviews" className="text-gray-300 hover:text-urban-blue-400 transition">Reviews</a>
                            <a href="#blog" className="text-gray-300 hover:text-urban-blue-400 transition">Blog</a>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link
                                to="/login"
                                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-urban-blue-400 transition"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 text-sm font-medium bg-urban-blue-600 text-white rounded-lg hover:bg-urban-blue-700 transition shadow-lg"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* About Us Section - Hero */}
            <section id="about" className="pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            <span className="text-urban-blue-500">About us</span>
                        </h1>
                        <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6">
                            We provide a secure, intuitive, and efficient platform
                        </h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            We believe in a decentralized future where everyone has full control over their financial assets.
                        </p>
                    </div>

                    {/* Security Feature */}
                    <div className="bg-gradient-to-r from-urban-blue-600/10 to-purple-600/10 rounded-3xl p-8 md:p-12 mb-16 border border-urban-blue-800">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="flex-1">
                                <div className="text-5xl mb-4">🔒</div>
                                <h3 className="text-2xl font-bold text-white mb-3">Secure & Private</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Industry-leading encryption and non-custodial storage ensure your assets are safe.
                                    Face ID & fingerprint authentication for extra protection.
                                </p>
                            </div>
                            <div className="flex-1 grid grid-cols-2 gap-4">
                                <div className="bg-urban-dark-200 p-4 rounded-xl text-center border border-urban-blue-800">
                                    <div className="text-3xl mb-2">🏦</div>
                                    <div className="text-sm font-semibold text-white">Non-Custodial</div>
                                    <div className="text-xs text-gray-500">Full control</div>
                                </div>
                                <div className="bg-urban-dark-200 p-4 rounded-xl text-center border border-urban-blue-800">
                                    <div className="text-3xl mb-2">🔄</div>
                                    <div className="text-sm font-semibold text-white">Instant Swap</div>
                                    <div className="text-xs text-gray-500">Built-in exchange</div>
                                </div>
                                <div className="bg-urban-dark-200 p-4 rounded-xl text-center border border-urban-blue-800">
                                    <div className="text-3xl mb-2">👆</div>
                                    <div className="text-sm font-semibold text-white">Biometric</div>
                                    <div className="text-xs text-gray-500">Face ID / Fingerprint</div>
                                </div>
                                <div className="bg-urban-dark-200 p-4 rounded-xl text-center border border-urban-blue-800">
                                    <div className="text-3xl mb-2">📱</div>
                                    <div className="text-sm font-semibold text-white">QR Code</div>
                                    <div className="text-xs text-gray-500">Easy payments</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div id="features" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-urban-dark-200 p-6 rounded-2xl border border-urban-blue-800 hover:border-urban-blue-600 transition">
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-400 text-sm mb-4">{feature.description}</p>
                                <a href={feature.link} className="text-urban-blue-400 text-sm hover:text-urban-blue-300 transition">
                                    Learn more →
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-20 px-4 bg-urban-dark-300">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Frequently asked questions</h2>
                        <p className="text-gray-400 text-lg">We have given answers to the most popular questions below.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* FAQ 1 */}
                        <div className="bg-urban-dark-200 rounded-2xl p-6 border border-urban-blue-800">
                            <h3 className="text-xl font-semibold text-white mb-3">Is my money safe with UrbanWallet?</h3>
                            <p className="text-gray-400 mb-4">
                                Yes! UrbanWallet uses bank-level encryption, non-custodial storage, and biometric authentication.
                                Your funds are protected with industry-leading security measures.
                            </p>
                            <a href="#" className="text-urban-blue-400 text-sm hover:text-urban-blue-300 transition">
                                Learn more →
                            </a>
                        </div>

                        {/* FAQ 2 */}
                        <div className="bg-urban-dark-200 rounded-2xl p-6 border border-urban-blue-800">
                            <h3 className="text-xl font-semibold text-white mb-3">Which payment methods are supported?</h3>
                            <p className="text-gray-400 mb-4">
                                We support a wide range of payment methods, including M-PESA, bank transfers, Visa, Mastercard,
                                and Apple Pay. You can also hold multiple currencies in your wallet.
                            </p>
                            <a href="#" className="text-urban-blue-400 text-sm hover:text-urban-blue-300 transition">
                                Learn more →
                            </a>
                        </div>

                        {/* FAQ 3 */}
                        <div className="bg-urban-dark-200 rounded-2xl p-6 border border-urban-blue-800">
                            <h3 className="text-xl font-semibold text-white mb-3">How can I restore my wallet?</h3>
                            <p className="text-gray-400 mb-4">
                                Your wallet can be restored using your recovery phrase or by contacting our support team.
                                Always keep your recovery phrase secure and never share it with anyone.
                            </p>
                            <a href="#" className="text-urban-blue-400 text-sm hover:text-urban-blue-300 transition">
                                Learn more →
                            </a>
                        </div>

                        {/* FAQ 4 */}
                        <div className="bg-urban-dark-200 rounded-2xl p-6 border border-urban-blue-800">
                            <h3 className="text-xl font-semibold text-white mb-3">How long do transactions take?</h3>
                            <p className="text-gray-400 mb-4">
                                M-PESA transactions are instant. Bank transfers take 1-2 business days.
                                Crypto transactions depend on network congestion but typically complete within minutes.
                            </p>
                            <a href="#" className="text-urban-blue-400 text-sm hover:text-urban-blue-300 transition">
                                Learn more →
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section id="reviews" className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Reviews</h2>
                        <h3 className="text-2xl md:text-3xl font-semibold text-urban-blue-400 mb-4">
                            We offer a safe, user-friendly, and efficient Crypto App
                        </h3>
                        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                            We envision a decentralized future where individuals have complete control over their financial assets.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {reviews.map((review, index) => (
                            <div key={index} className="bg-urban-dark-200 p-6 rounded-2xl border border-urban-blue-800">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <span key={i} className="text-yellow-500">★</span>
                                    ))}
                                </div>
                                <p className="text-gray-300 mb-4 italic">"{review.content}"</p>
                                <div className="font-semibold text-white">{review.name}</div>
                                <div className="text-sm text-gray-500">{review.role}</div>
                            </div>
                        ))}
                    </div>

                    {/* Features Grid 2 */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        <div className="bg-urban-dark-200 p-6 rounded-2xl border border-urban-blue-800">
                            <div className="text-4xl mb-4">🔐</div>
                            <h3 className="text-lg font-semibold text-white mb-2">Non-Custodial Wallet</h3>
                            <p className="text-gray-400 text-sm mb-3">Full control over your private keys.</p>
                            <a href="#" className="text-urban-blue-400 text-sm">Learn more →</a>
                        </div>

                        <div className="bg-urban-dark-200 p-6 rounded-2xl border border-urban-blue-800">
                            <div className="text-4xl mb-4">🔄</div>
                            <h3 className="text-lg font-semibold text-white mb-2">Built-in Exchange</h3>
                            <p className="text-gray-400 text-sm mb-3">Swap cryptocurrencies directly within the app.</p>
                            <a href="#" className="text-urban-blue-400 text-sm">Learn more →</a>
                        </div>

                        <div className="bg-urban-dark-200 p-6 rounded-2xl border border-urban-blue-800">
                            <div className="text-4xl mb-4">👆</div>
                            <h3 className="text-lg font-semibold text-white mb-2">Biometric Security</h3>
                            <p className="text-gray-400 text-sm mb-3">Face ID & authentication for extra protection.</p>
                            <a href="#" className="text-urban-blue-400 text-sm">Learn more →</a>
                        </div>

                        <div className="bg-urban-dark-200 p-6 rounded-2xl border border-urban-blue-800">
                            <div className="text-4xl mb-4">📱</div>
                            <h3 className="text-lg font-semibold text-white mb-2">QR Code Payments</h3>
                            <p className="text-gray-400 text-sm mb-3">Send and receive crypto effortlessly.</p>
                            <a href="#" className="text-urban-blue-400 text-sm">Learn more →</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Multi-Currency & Support Section */}
            <section className="py-20 px-4 bg-urban-dark-300">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <div className="bg-urban-dark-200 p-8 rounded-2xl border border-urban-blue-800">
                            <div className="text-5xl mb-4">💎</div>
                            <h3 className="text-2xl font-bold text-white mb-3">Multi-Currency Support</h3>
                            <p className="text-gray-400 mb-4">
                                Store Bitcoin, Ethereum, M-PESA, and a wide range of altcoins all in one wallet.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {supportedCoins.slice(0, 6).map((coin, i) => (
                                    <span key={i} className="px-3 py-1 bg-urban-blue-600/20 rounded-full text-xs text-urban-blue-400">
                                        {coin}
                                    </span>
                                ))}
                            </div>
                            <a href="#" className="inline-block mt-4 text-urban-blue-400 text-sm">Learn more →</a>
                        </div>

                        <div className="bg-urban-dark-200 p-8 rounded-2xl border border-urban-blue-800">
                            <div className="text-5xl mb-4">🛡️</div>
                            <h3 className="text-2xl font-bold text-white mb-3">24/7 Support</h3>
                            <p className="text-gray-400 mb-4">
                                Our team is always here to help you with any questions. Get instant support via live chat or email.
                            </p>
                            <div className="flex gap-4">
                                <div className="flex-1 text-center">
                                    <div className="text-2xl mb-1">💬</div>
                                    <div className="text-sm text-gray-400">Live Chat</div>
                                </div>
                                <div className="flex-1 text-center">
                                    <div className="text-2xl mb-1">📧</div>
                                    <div className="text-sm text-gray-400">Email Support</div>
                                </div>
                                <div className="flex-1 text-center">
                                    <div className="text-2xl mb-1">📞</div>
                                    <div className="text-sm text-gray-400">Phone Support</div>
                                </div>
                            </div>
                            <a href="#" className="inline-block mt-4 text-urban-blue-400 text-sm">Contact support →</a>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-gradient-to-r from-urban-blue-800 to-urban-blue-600 rounded-3xl p-12 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Let's start now</h2>
                        <p className="text-xl text-blue-100 mb-8">Join the Future of Digital Finance Today!</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/register"
                                className="px-8 py-3 bg-white text-urban-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition"
                            >
                                Create Free Account
                            </Link>
                            <Link
                                to="/login"
                                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition"
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 border-t border-urban-blue-800">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-urban-blue-600 to-urban-blue-800 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">U</span>
                            </div>
                            <span className="text-xl font-bold text-urban-blue-500">UrbanWallet</span>
                        </div>

                        <div className="flex gap-6">
                            <a href="#about" className="text-gray-400 hover:text-urban-blue-400 text-sm transition">About us</a>
                            <a href="#reviews" className="text-gray-400 hover:text-urban-blue-400 text-sm transition">Reviews</a>
                            <a href="#blog" className="text-gray-400 hover:text-urban-blue-400 text-sm transition">Blog</a>
                            <a href="#" className="text-gray-400 hover:text-urban-blue-400 text-sm transition">Download App</a>
                        </div>

                        <div className="flex gap-4">
                            <button className="px-4 py-2 bg-urban-dark-200 border border-urban-blue-800 rounded-lg text-sm text-gray-300 hover:border-urban-blue-600 transition">
                                📱 App Store
                            </button>
                            <button className="px-4 py-2 bg-urban-dark-200 border border-urban-blue-800 rounded-lg text-sm text-gray-300 hover:border-urban-blue-600 transition">
                                📱 Google Play
                            </button>
                        </div>
                    </div>

                    <div className="text-center mt-8 pt-8 border-t border-urban-blue-800">
                        <p className="text-gray-500 text-sm">
                            © 2024 UrbanWallet. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;