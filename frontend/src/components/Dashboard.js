import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SendMoney from './SendMoney';
import BuyAirtime from './BuyAirtime';
import TransactionHistory from './TransactionHistory';
import SetPin from './SetPin';
import DepositModal from './DepositModal';

const Dashboard = () => {
    const { user, logout, updateBalance } = useAuth();
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showSendModal, setShowSendModal] = useState(false);
    const [showAirtimeModal, setShowAirtimeModal] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showPinModal, setShowPinModal] = useState(false);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [hasPin, setHasPin] = useState(false);
    const [summary, setSummary] = useState(null);
    
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchBalance();
        fetchHasPin();
        fetchSummary();
    }, [user, navigate]);
    
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
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b-2 border-urban-blue-800">
                <div>
                    <h1 className="text-3xl font-bold text-urban-blue-500 flex items-center gap-2">
                        💰 UrbanWallet
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Your Secure Digital Wallet</p>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <span className="text-gray-300">
                        Welcome, <span className="text-urban-blue-400 font-semibold">{user?.name}</span>!
                    </span>
                    <button onClick={handleLogout} className="btn-secondary">
                        Logout
                    </button>
                </div>
            </div>
            
            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <button 
                    onClick={() => setShowDepositModal(true)}
                    className="card p-4 hover:border-urban-blue-500 transition-all group"
                >
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">💰</div>
                    <div className="font-semibold text-sm">Deposit</div>
                </button>
                
                <button 
                    onClick={() => {
                        if (!hasPin) {
                            setShowPinModal(true);
                        } else {
                            setShowSendModal(true);
                        }
                    }}
                    className="card p-4 hover:border-urban-blue-500 transition-all group"
                >
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📤</div>
                    <div className="font-semibold text-sm">Send Money</div>
                </button>
                
                <button 
                    onClick={() => setShowAirtimeModal(true)}
                    className="card p-4 hover:border-urban-blue-500 transition-all group"
                >
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📱</div>
                    <div className="font-semibold text-sm">Buy Airtime</div>
                </button>
                
                <button 
                    onClick={() => setShowHistory(!showHistory)}
                    className="card p-4 hover:border-urban-blue-500 transition-all group"
                >
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📊</div>
                    <div className="font-semibold text-sm">History</div>
                </button>
                
                <button 
                    onClick={() => setShowPinModal(true)}
                    className="card p-4 hover:border-urban-blue-500 transition-all group"
                >
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🔒</div>
                    <div className="font-semibold text-sm">{hasPin ? 'Change PIN' : 'Set PIN'}</div>
                </button>
            </div>
            
            {/* Wallet Balance Card */}
            <div className="card p-8 mb-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-urban-blue-500/10 to-transparent"></div>
                <div className="relative z-10">
                    <h2 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Wallet Balance</h2>
                    <div className="text-5xl md:text-6xl font-bold text-urban-blue-500 mb-2 animate-pulse-slow">
                        KES {balance.toLocaleString()}
                    </div>
                    <p className="text-gray-500 text-sm">Available Balance</p>
                </div>
            </div>
            
            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="card p-4 text-center">
                        <p className="text-gray-400 text-xs uppercase">Total Sent</p>
                        <p className="text-xl font-bold text-red-500">KES {summary.totalSent.toLocaleString()}</p>
                    </div>
                    <div className="card p-4 text-center">
                        <p className="text-gray-400 text-xs uppercase">Total Received</p>
                        <p className="text-xl font-bold text-green-500">KES {summary.totalReceived.toLocaleString()}</p>
                    </div>
                    <div className="card p-4 text-center">
                        <p className="text-gray-400 text-xs uppercase">Airtime</p>
                        <p className="text-xl font-bold text-blue-500">KES {summary.totalAirtime.toLocaleString()}</p>
                    </div>
                    <div className="card p-4 text-center">
                        <p className="text-gray-400 text-xs uppercase">Deposits</p>
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
    );
};

export default Dashboard;