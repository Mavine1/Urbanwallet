import React, { useState } from 'react';
import axios from 'axios';

const SetPin = ({ hasPin, onSuccess, onClose }) => {
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [oldPin, setOldPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (pin !== confirmPin) {
            setError('PINs do not match');
            return;
        }
        
        if (pin.length < 4 || pin.length > 6 || !/^\d+$/.test(pin)) {
            setError('PIN must be 4-6 digits only');
            return;
        }
        
        setLoading(true);
        
        try {
            if (hasPin) {
                // Update existing PIN
                await axios.put('http://localhost:5000/api/pin/update', {
                    oldPin,
                    newPin: pin
                });
            } else {
                // Create new PIN
                await axios.post('http://localhost:5000/api/pin/create', {
                    pin
                });
            }
            
            onSuccess();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to set PIN');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="card p-6">
            <h3 className="text-xl font-semibold text-urban-blue-400 mb-4 flex items-center gap-2">
                🔒 {hasPin ? 'Change Transaction PIN' : 'Set Transaction PIN'}
            </h3>
            
            <p className="text-gray-400 text-sm mb-4">
                {hasPin 
                    ? 'Change your transaction PIN for secure payments' 
                    : 'Set a 4-6 digit PIN to secure your transactions'}
            </p>
            
            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                {hasPin && (
                    <div className="mb-4">
                        <label className="text-gray-400 text-sm mb-1 block">Current PIN</label>
                        <input
                            type="password"
                            placeholder="Enter current PIN"
                            className="input-field text-center text-2xl tracking-widest"
                            value={oldPin}
                            onChange={(e) => setOldPin(e.target.value)}
                            maxLength={6}
                            required
                        />
                    </div>
                )}
                
                <div className="mb-4">
                    <label className="text-gray-400 text-sm mb-1 block">New PIN</label>
                    <input
                        type="password"
                        placeholder="Enter 4-6 digit PIN"
                        className="input-field text-center text-2xl tracking-widest"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        maxLength={6}
                        required
                    />
                </div>
                
                <div className="mb-6">
                    <label className="text-gray-400 text-sm mb-1 block">Confirm PIN</label>
                    <input
                        type="password"
                        placeholder="Confirm PIN"
                        className="input-field text-center text-2xl tracking-widest"
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value)}
                        maxLength={6}
                        required
                    />
                </div>
                
                <button type="submit" className="btn-primary w-full" disabled={loading}>
                    {loading ? 'Processing...' : (hasPin ? 'Change PIN' : 'Set PIN')}
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

export default SetPin;