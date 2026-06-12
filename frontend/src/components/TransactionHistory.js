import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
    const [exporting, setExporting] = useState(false);
    
    useEffect(() => {
        fetchTransactions();
    }, [filter, startDate, endDate, pagination.currentPage]);
    
    const fetchTransactions = async () => {
        setLoading(true);
        try {
            let url = `http://localhost:5000/api/reports/history?limit=20&page=${pagination.currentPage}`;
            if (filter !== 'all') url += `&type=${filter}`;
            if (startDate) url += `&startDate=${startDate}`;
            if (endDate) url += `&endDate=${endDate}`;
            
            const response = await axios.get(url);
            setTransactions(response.data.transactions);
            setPagination({
                currentPage: response.data.pagination.currentPage,
                totalPages: response.data.pagination.totalPages,
                totalTransactions: response.data.pagination.totalTransactions
            });
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const exportToCSV = async () => {
        setExporting(true);
        try {
            let url = `http://localhost:5000/api/reports/export`;
            if (filter !== 'all') url += `?type=${filter}`;
            if (startDate) url += `${filter !== 'all' ? '&' : '?'}startDate=${startDate}`;
            if (endDate) url += `&endDate=${endDate}`;
            
            window.open(url, '_blank');
        } catch (error) {
            alert('Export failed');
        } finally {
            setExporting(false);
        }
    };
    
    const getTypeIcon = (type) => {
        switch(type) {
            case 'deposit': return '💰';
            case 'transfer_sent': return '📤';
            case 'transfer_received': return '📥';
            case 'airtime': return '📱';
            default: return '💳';
        }
    };
    
    const getTypeColor = (type) => {
        if (type === 'transfer_sent' || type === 'airtime') return 'text-red-500';
        if (type === 'transfer_received' || type === 'deposit') return 'text-green-500';
        return 'text-gray-400';
    };
    
    return (
        <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-urban-blue-400 flex items-center gap-2">
                    📊 Transaction History
                </h3>
                <button 
                    onClick={exportToCSV}
                    disabled={exporting}
                    className="btn-secondary text-sm"
                >
                    {exporting ? 'Exporting...' : '📥 Export CSV'}
                </button>
            </div>
            
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <select 
                    className="input-field"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All Transactions</option>
                    <option value="deposit">Deposits</option>
                    <option value="transfer_sent">Sent</option>
                    <option value="transfer_received">Received</option>
                    <option value="airtime">Airtime</option>
                </select>
                
                <input
                    type="date"
                    className="input-field"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                
                <input
                    type="date"
                    className="input-field"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                
                <button onClick={fetchTransactions} className="btn-secondary">
                    Apply Filters
                </button>
            </div>
            
            {/* Transactions Table */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-urban-blue-500 border-t-transparent"></div>
                    <p className="mt-4 text-gray-400">Loading transactions...</p>
                </div>
            ) : transactions.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">No transactions found</p>
                    <p className="text-gray-600 text-sm mt-2">Make a deposit to get started</p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-urban-dark-100">
                                <tr className="border-b border-urban-blue-800">
                                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Type</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Description</th>
                                    <th className="text-right py-3 px-4 text-gray-400 font-semibold">Amount</th>
                                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr key={tx._id} className="border-b border-urban-blue-800/50 hover:bg-urban-dark-100 transition-colors">
                                        <td className="py-3 px-4 text-gray-300 whitespace-nowrap">
                                            {new Date(tx.createdAt).toLocaleDateString()}
                                            <div className="text-xs text-gray-500">
                                                {new Date(tx.createdAt).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="flex items-center gap-2">
                                                {getTypeIcon(tx.type)}
                                                <span className="capitalize">{tx.type.replace('_', ' ')}</span>
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-400 text-sm">
                                            {tx.description || '-'}
                                            {tx.phoneNumber && <div className="text-xs">{tx.phoneNumber}</div>}
                                        </td>
                                        <td className={`py-3 px-4 text-right font-semibold ${getTypeColor(tx.type)}`}>
                                            {tx.type === 'transfer_sent' || tx.type === 'airtime' ? '-' : '+'}
                                            KES {tx.amount.toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`status-${tx.status} px-2 py-1 rounded text-xs font-semibold`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                            <button
                                onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
                                disabled={pagination.currentPage === 1}
                                className="px-3 py-1 bg-urban-dark-100 rounded disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="px-3 py-1 text-gray-400">
                                Page {pagination.currentPage} of {pagination.totalPages}
                            </span>
                            <button
                                onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
                                disabled={pagination.currentPage === pagination.totalPages}
                                className="px-3 py-1 bg-urban-dark-100 rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TransactionHistory;