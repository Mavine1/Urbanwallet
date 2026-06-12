import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/notifications');
            setNotifications(response.data.notifications || []);
            setUnreadCount(response.data.notifications?.filter(n => !n.read).length || 0);
        } catch (error) {
            // Mock notifications for demo
            setNotifications([
                { id: 1, title: 'Welcome to UrbanWallet', message: 'Start sending money securely today!', read: false, createdAt: new Date().toISOString() },
                { id: 2, title: 'Account Verified', message: 'Your account has been verified successfully.', read: false, createdAt: new Date().toISOString() },
            ]);
            setUnreadCount(2);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/notifications/${id}/read`);
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, read: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, read: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-urban-dark-300 transition relative"
            >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-urban-dark-200 border border-gray-200 dark:border-urban-blue-800 rounded-lg shadow-xl z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-urban-blue-800">
                        <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <p className="p-4 text-sm text-gray-500 text-center">No notifications</p>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-urban-dark-300 transition cursor-pointer ${
                                        !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                    }`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-2 h-2 mt-2 rounded-full ${!notification.read ? 'bg-blue-500' : 'bg-gray-300'}`} />
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{notification.title}</p>
                                            <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                                            <p className="text-xs text-gray-400 mt-2">
                                                {formatTime(notification.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;