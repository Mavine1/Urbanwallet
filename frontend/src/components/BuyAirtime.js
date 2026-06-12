import React, { useState } from 'react';
import axios from 'axios';

const BuyAirtime = ({ onSuccess, onClose }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [network, setNetwork] = useState('');
    
    const amounts = [50, 100, 200, 500, 1000];
    
    const detectNetwork = (phone) => {
        if (!phone) return '';
        const cleanNumber = phone.replace(/\D/g, '');
        const number = cleanNumber.slice(-9);
        const prefix = number.substring(0, 3);
        
        const safaricomPrefixes = ['701', '702', '703', '704', '705', '706', '707', '708', '709',
                                   '710', '711', '712', '713', '714', '715', '716', '717', '718', '719',
                                   '720', '721', '722', '723', '724', '725', '726', '727', '728', '729',
                                   '740', '741', '742', '743', '744', '745', '746', '747', '748', '749'];
        
        const airtelPrefixes = ['750', '751', '752', '753', '754', '755', '756', '757', '758', '759',
                                '780', '781', '782', '783', '784', '785', '786', '787', '788', '789'];
        
        if (safaricomPrefixes.includes(prefix)) return 'Safaricom';
        if (airtelPrefixes.includes(prefix)) return 'Airtel';
        return 'Telkom';
    };
    
    const handlePhoneChange = (e) => {
        const phone = e.target.value;
        setPhoneNumber(phone);
        setNetwork(detectNetwork(phone));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        if (!phoneNumber || !amount || amount < 10) {
            setError('Please enter valid phone number and amount (min 10 KES)');
            setLoading(false);
            return;
        }
        
        try {
            const response = await axios.post('http://localhost:5000/api/airtime/buy', {
                phoneNumber,
                amount: parseFloat(amount)
            });
            
            alert(`✅ Success! Purchased ${amount} KES airtime for ${phoneNumber} (${response.data.network})`);
            onSuccess();
        } catch (error) {
            setError(error.response?.data?.message || 'Purchase failed');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="card p-6">
            <h3 className="text-xl font-semibold text-urban-blue-400 mb-4">
                Buy Airtime
            </h3>
            
            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="text-gray-400 text-sm mb-1 block">Phone Number</label>
                    <input
                        type="tel"
                        placeholder="0712345678"
                        className="input-field"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        required
                    />
                    {network && (
                        <p className="text-sm text-urban-blue-400 mt-1">
                            Network: {network}
                        </p>
                    )}
                </div>
                
                <div className="mb-4">
                    <label className="text-gray-400 text-sm mb-2 block">Select Amount (KES)</label>
                    <div className="grid grid-cols-5 gap-2 mb-3">
                        {amounts.map(a => (
                            <button
                                key={a}
                                type="button"
                                onClick={() => setAmount(a.toString())}
                                className={`p-2 rounded text-center transition ${
                                    amount === a.toString() 
                                        ? 'bg-urban-blue-600 text-white' 
                                        : 'bg-urban-dark-100 text-gray-300 hover:bg-urban-blue-800'
                                }`}
                            >
                                {a}
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
                
                <button type="submit" className="btn-primary w-full" disabled={loading}>
                    {loading ? 'Processing...' : `Buy ${amount || '0'} KES Airtime`}
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

export default BuyAirtime;