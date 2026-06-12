import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import SendMoney from '../components/SendMoney';
import BuyAirtime from '../components/BuyAirtime';
import TransactionHistory from '../components/TransactionHistory';
import SetPin from '../components/SetPin';
import DepositModal from '../components/DepositModal';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Profile from '../pages/Profile';

const Dashboard = () => {
    const { user, logout, updateBalance, updateUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showSendModal, setShowSendModal] = useState(false);
    const [showAirtimeModal, setShowAirtimeModal] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showPinModal, setShowPinModal] = useState(false);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [hasPin, setHasPin] = useState(false);
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        // Handle URL query params for navigation
        const params = new URLSearchParams(location.search);
        if (params.get('action') === 'deposit') {
            setShowDepositModal(true);
        } else if (params.get('action') === 'send') {
            setShowSendModal(true);
        } else if (params.get('action') === 'airtime') {
            setShowAirtimeModal(true);
        } else if (params.get('action') === 'history') {
            setShowHistory(true);
        } else if (params.get('action') === 'pin') {
            setShowPinModal(true);
        } else if (location.pathname === '/profile') {
            setShowProfile(true);
        }

        fetchBalance();
        fetchHasPin();
        fetchSummary();
    }, [user, navigate, location]);

    const fetchBalance = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/wallet/balance');
            setBalance(response.data.balance);
            updateBalance(response.data.balance);
        } catch (error) {
            console.error('Error fetching balance:', error);
            if (error.response?.status === 401) {
                logout();
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchHasPin = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/pin/has');
            setHasPin(response.data.hasPin);
        } catch (error) {
            console.error('Error checking PIN:', error);
        }
    };

    const fetchSummary = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/reports/summary');
            setSummary(response.data);
        } catch (error) {
            console.error('Error fetching summary:', error);
        }
    };

    const handleDeposit = async (amount) => {
        try {
            const response = await axios.post('http://localhost:5000/api/wallet/deposit/initialize', {
                amount: parseFloat(amount)
            });
            window.location.href = response.data.authorization_url;
        } catch (error) {
            alert(error.response?.data?.message || 'Deposit failed');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const refreshData = () => {
        fetchBalance();
        fetchSummary();
    };

    const handleMenuClick = () => {
        setSidebarOpen(!sidebarOpen);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-urban-blue-500 border-t-transparent"></div>
                    <p className="mt-4 text-gray-400">Loading your wallet...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar onMenuClick={handleMenuClick} />
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="main-content p-6">
                {showProfile ? (
                    <Profile />
                ) : (
                    <div className="max-w-6xl mx-auto">
                        {/* Wallet Balance Card */}
                        <div className="card p-8 mb-8 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-urban-blue-500/10 to-transparent"></div>
                            <div className="relative z-10">
                                <h2 className="text-gray-400 dark:text-gray-500 text-sm uppercase tracking-wider mb-2">Wallet Balance</h2>
                                <div className="text-5xl md:text-6xl font-bold text-urban-blue-500 mb-2 animate-pulse-slow">
                                    KES {balance.toLocaleString()}
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Available Balance</p>
                            </div>
                        </div>

                        {/* Quick Actions Grid - Text only, no icons */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                            <button
                                onClick={() => setShowDepositModal(true)}
                                className="card p-4 hover:border-urban-blue-500 transition-all group text-center"
                            >
                                <div className="font-semibold text-sm text-urban-blue-400 group-hover:text-white">
                                    Deposit
                                </div>
                            </button>

                            <button
                                onClick={() => {
                                    if (!hasPin) {
                                        setShowPinModal(true);
                                    } else {
                                        setShowSendModal(true);
                                    }
                                }}
                                className="card p-4 hover:border-urban-blue-500 transition-all group text-center"
                            >
                                <div className="font-semibold text-sm text-urban-blue-400 group-hover:text-white">
                                    Send Money
                                </div>
                            </button>

                            <button
                                onClick={() => setShowAirtimeModal(true)}
                                className="card p-4 hover:border-urban-blue-500 transition-all group text-center"
                            >
                                <div className="font-semibold text-sm text-urban-blue-400 group-hover:text-white">
                                    Buy Airtime
                                </div>
                            </button>

                            <button
                                onClick={() => setShowHistory(!showHistory)}
                                className="card p-4 hover:border-urban-blue-500 transition-all group text-center"
                            >
                                <div className="font-semibold text-sm text-urban-blue-400 group-hover:text-white">
                                    History
                                </div>
                            </button>

                            <button
                                onClick={() => setShowPinModal(true)}
                                className="card p-4 hover:border-urban-blue-500 transition-all group text-center"
                            >
                                <div className="font-semibold text-sm text-urban-blue-400 group-hover:text-white">
                                    {hasPin ? 'Change PIN' : 'Set PIN'}
                                </div>
                            </button>
                        </div>

                        {/* Summary Cards */}
                        {summary && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="card p-4 text-center">
                                    <p className="text-gray-400 dark:text-gray-500 text-xs uppercase">Total Sent</p>
                                    <p className="text-xl font-bold text-red-500">KES {summary.totalSent.toLocaleString()}</p>
                                </div>
                                <div className="card p-4 text-center">
                                    <p className="text-gray-400 dark:text-gray-500 text-xs uppercase">Total Received</p>
                                    <p className="text-xl font-bold text-green-500">KES {summary.totalReceived.toLocaleString()}</p>
                                </div>
                                <div className="card p-4 text-center">
                                    <p className="text-gray-400 dark:text-gray-500 text-xs uppercase">Airtime</p>
                                    <p className="text-xl font-bold text-blue-500">KES {summary.totalAirtime.toLocaleString()}</p>
                                </div>
                                <div className="card p-4 text-center">
                                    <p className="text-gray-400 dark:text-gray-500 text-xs uppercase">Deposits</p>
                                    <p className="text-xl font-bold text-urban-blue-400">KES {summary.totalDeposits.toLocaleString()}</p>
                                </div>
                            </div>
                        )}

                        {/* Transaction History Section */}
                        {showHistory && (
                            <div className="mt-6">
                                <TransactionHistory />
                            </div>
                        )}

                        {/* Modals */}
                        {showDepositModal && (
                            <DepositModal
                                onClose={() => setShowDepositModal(false)}
                                onDeposit={handleDeposit}
                            />
                        )}

                        {showSendModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                                <div className="relative max-w-md w-full">
                                    <button
                                        onClick={() => setShowSendModal(false)}
                                        className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300"
                                    >
                                        ✕
                                    </button>
                                    <SendMoney
                                        hasPin={hasPin}
                                        onSetPin={() => {
                                            setShowSendModal(false);
                                            setShowPinModal(true);
                                        }}
                                        onSuccess={() => {
                                            refreshData();
                                            setShowSendModal(false);
                                        }}
                                        onClose={() => setShowSendModal(false)}
                                    />
                                </div>
                            </div>
                        )}

                        {showAirtimeModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                                <div className="relative max-w-md w-full">
                                    <button
                                        onClick={() => setShowAirtimeModal(false)}
                                        className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300"
                                    >
                                        ✕
                                    </button>
                                    <BuyAirtime
                                        onSuccess={() => {
                                            refreshData();
                                            setShowAirtimeModal(false);
                                        }}
                                        onClose={() => setShowAirtimeModal(false)}
                                    />
                                </div>
                            </div>
                        )}

                        {showPinModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                                <div className="relative max-w-md w-full">
                                    <button
                                        onClick={() => setShowPinModal(false)}
                                        className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300"
                                    >
                                        ✕
                                    </button>
                                    <SetPin
                                        hasPin={hasPin}
                                        onSuccess={() => {
                                            fetchHasPin();
                                            setShowPinModal(false);
                                            alert(hasPin ? 'PIN changed successfully!' : 'PIN set successfully!');
                                        }}
                                        onClose={() => setShowPinModal(false)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;