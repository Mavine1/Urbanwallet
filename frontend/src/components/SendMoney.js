import React, { useState } from 'react';
import axios from 'axios';

const SendMoney = ({ onSuccess, onClose }) => {
    const [recipientEmail, setRecipientEmail] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [pin, setPin] = useState('');
    const [showPinModal, setShowPinModal] = useState(false);
    const [error, setError] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!recipientEmail || !amount || amount <= 0) {
            setError('Please fill all fields correctly');
            return;
        }
        
        setShowPinModal(true);
    };
    
    const verifyPinAndSend = async () => {
        setLoading(true);
        setError('');
        
        try {
            // First verify PIN
            await axios.post('http://localhost:5000/api/pin/verify', {
                pin: pin
            });
            
            // Then send money
            const response = await axios.post('http://localhost:5000/api/transfers/send', {
                recipientEmail,
                amount: parseFloat(amount),
                description
            });
            
            alert(` Success! Sent ${amount} KES to ${recipientEmail}`);
            onSuccess();
        } catch (error) {
            setError(error.response?.data?.message || 'Transaction failed');
        } finally {
            setLoading(false);
            setShowPinModal(false);
        }
    };
    
    return (
        <>
            <div className="card p-6">
                <h3 className="text-xl font-semibold text-urban-blue-400 mb-4">
                    Send Money
                </h3>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="text-gray-400 text-sm mb-1 block">Recipient Email</label>
                        <input
                            type="email"
                            placeholder="friend@example.com"
                            className="input-field"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="text-gray-400 text-sm mb-1 block">Amount (KES)</label>
                        <input
                            type="number"
                            placeholder="Enter amount"
                            className="input-field"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label className="text-gray-400 text-sm mb-1 block">Description (Optional)</label>
                        <input
                            type="text"
                            placeholder="What's this for?"
                            className="input-field"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    
                    <button type="submit" className="btn-primary w-full">
                        Continue
                    </button>
                </form>
                
                <button 
                    onClick={onClose}
                    className="w-full mt-3 text-gray-400 hover:text-white transition"
                >
                    Cancel
                </button>
            </div>
            
            {/* PIN Modal */}
            {showPinModal && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                    <div className="bg-urban-dark-200 p-6 rounded-lg max-w-md w-full border border-urban-blue-800">
                        <h3 className="text-xl font-semibold mb-4 text-center">Enter Transaction PIN</h3>
                        <p className="text-gray-400 text-center mb-4">
                            Sending {amount} KES to {recipientEmail}
                        </p>
                        <input
                            type="password"
                            placeholder="Enter 4-6 digit PIN"
                            className="input-field mb-4 text-center text-2xl tracking-widest"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            maxLength={6}
                            autoFocus
                        />
                        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowPinModal(false)}
                                className="flex-1 bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-700 transition"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={verifyPinAndSend}
                                disabled={loading || !pin}
                                className="flex-1 btn-primary"
                            >
                                {loading ? 'Processing...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SendMoney;