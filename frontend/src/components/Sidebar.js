import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { user } = useAuth();

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', label: 'Dashboard' },
        { name: 'Deposit', path: '/dashboard?action=deposit', label: 'Deposit' },
        { name: 'Send Money', path: '/dashboard?action=send', label: 'Send Money' },
        { name: 'Buy Airtime', path: '/dashboard?action=airtime', label: 'Buy Airtime' },
        { name: 'Transaction History', path: '/dashboard?action=history', label: 'History' },
        { name: 'Set PIN', path: '/dashboard?action=pin', label: 'Set PIN' },
    ];

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                {/* Logo */}
                <div className="p-6 border-b border-gray-200 dark:border-urban-blue-800">
                    <Link to="/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-urban-blue-600 to-urban-blue-800 flex items-center justify-center">
                            <span className="text-white font-bold text-xl">U</span>
                        </div>
                        <span className="text-xl font-bold text-urban-blue-500">UrbanWallet</span>
                    </Link>
                </div>

                {/* User Info */}
                <div className="p-4 border-b border-gray-200 dark:border-urban-blue-800">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-urban-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-semibold text-sm">{user?.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4">
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.name}>
                                <Link
                                    to={item.path}
                                    className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                                        location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard')
                                            ? 'bg-urban-blue-600 text-white font-medium'
                                            : 'hover:bg-gray-100 dark:hover:bg-urban-dark-300 text-gray-700 dark:text-gray-300'
                                    }`}
                                    onClick={() => {
                                        if (window.innerWidth < 768) {
                                            onClose();
                                        }
                                    }}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-urban-blue-800">
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                        UrbanWallet v1.0
                    </p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;