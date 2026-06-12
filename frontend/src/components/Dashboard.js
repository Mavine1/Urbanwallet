import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchBalance();
        fetchTransactions();
    }, [user, navigate]);
    
    const fetchBalance = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/wallet/balance');
            setBalance(response.data.balance);
        } catch (error) {
            console.error('Error fetching balance:', error);
            if (error.response?.status === 401) {
                logout();
                navigate('/login');
            }
        }
    };
    
    const fetchTransactions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/wallet/transactions');
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };
    
    const handleDeposit = async () => {
        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/wallet/deposit/initialize', {
                amount: parseFloat(amount)
            });
            window.location.href = response.data.authorization_url;
        } catch (error) {
            console.error('Deposit failed:', error);
            alert('Deposit failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-urban-blue-800">
                <div>
                    <h1 className="text-3xl font-bold text-urban-blue-500">💰 UrbanWallet</h1>
                    <p className="text-gray-400 text-sm mt-1">Your Secure Digital Wallet</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-gray-300">Welcome, <span className="text-urban-blue-400 font-semibold">{user?.name}</span>!</span>
                    <button onClick={handleLogout} className="btn-secondary">
                        Logout
                    </button>
                </div>
            </div>
            
            {/* Wallet Card */}
            <div className="card p-8 mb-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-urban-blue-500/5 to-transparent"></div>
                <div className="relative z-10">
                    <h2 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Wallet Balance</h2>
                    <div className="text-6xl font-bold text-urban-blue-500 mb-2 animate-pulse-slow">
                        KSh {balance.toLocaleString()}
                    </div>
                    <p className="text-gray-500 text-sm">Available Balance</p>
                </div>
            </div>
            
            {/* Deposit Section */}
            <div className="card p-6 mb-8">
                <h3 className="text-xl font-semibold text-urban-blue-400 mb-4">💳 Fund Your Wallet</h3>
                <div className="space-y-4">
                    <input
                        type="number"
                        placeholder="Enter amount (KSh)"
                        className="input-field"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        disabled={loading}
                    />
                    <button onClick={handleDeposit} className="btn-primary w-full" disabled={loading}>
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            'Deposit with Paystack'
                        )}
                    </button>
                </div>
            </div>
            
            {/* Transactions Section */}
            <div className="card p-6">
                <h3 className="text-xl font-semibold text-urban-blue-400 mb-4">📊 Transaction History</h3>
                {transactions.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No transactions yet</p>
                        <p className="text-gray-600 text-sm mt-2">Make a deposit to get started</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-urban-blue-800">
                                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Type</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Amount</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr key={tx._id} className="border-b border-urban-blue-800/50 hover:bg-urban-dark-100 transition-colors">
                                        <td className="py-3 px-4 text-gray-300">
                                            {new Date(tx.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4 text-gray-300 capitalize">
                                            {tx.type}
                                        </td>
                                        <td className="py-3 px-4 text-gray-300 font-semibold">
                                            KSh {tx.amount.toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`status-${tx.status}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;