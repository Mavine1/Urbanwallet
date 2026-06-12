import React, { useState } from 'react';

const DepositModal = ({ onClose, onDeposit }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const amounts = [1000, 2000, 5000, 10000, 20000, 50000];
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!amount || amount < 10) {
            setError('Amount must be at least 10 KES');
            return;
        }
        
        setLoading(true);
        try {
            await onDeposit(amount);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };
    
    return (
        <div className="card p-6">
            <h3 className="text-xl font-semibold text-urban-blue-400 mb-4">
                Deposit Money
            </h3>
            
            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="text-gray-400 text-sm mb-2 block">Select Amount (KES)</label>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                        {amounts.map(a => (
                            <button
                                key={a}
                                type="button"
                                onClick={() => setAmount(a.toString())}
                                className={`p-3 rounded text-center transition ${
                                    amount === a.toString() 
                                        ? 'bg-urban-blue-600 text-white' 
                                        : 'bg-urban-dark-100 text-gray-300 hover:bg-urban-blue-800'
                                }`}
                            >
                                {a.toLocaleString()}
                            </button>
                        ))}
                    </div>
                    <input
                        type="number"
                        placeholder="Or enter custom amount"
                        className="input-field"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                
                <div className="mb-4 p-3 bg-urban-blue-500/10 border border-urban-blue-500 rounded-lg">
                    <p className="text-sm text-gray-300">
                        You will be redirected to Paystack to complete your payment securely.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Supported: M-PESA, Cards, Apple Pay
                    </p>
                </div>
                
                <button type="submit" className="btn-primary w-full" disabled={loading}>
                    {loading ? 'Processing...' : `Deposit ${amount || '0'} KES`}
                </button>
            </form>
            
            <button 
                onClick={onClose}
                className="w-full mt-3 text-gray-400 hover:text-white transition"
            >
                Cancel
            </button>
        </div>
    );
};

export default DepositModal;