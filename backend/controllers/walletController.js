const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { initializePayment, verifyPayment } = require('../config/paystack');

exports.getWalletBalance = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({ balance: user.walletBalance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.initializeDeposit = async (req, res) => {
    try {
        const { amount } = req.body;
        const user = await User.findById(req.user.id);
        
        if (!amount || amount < 10) {
            return res.status(400).json({ message: 'Amount must be at least 10 KES' });
        }
        
        const reference = `URBAN_${Date.now()}_${user._id}`;
        
        const payment = await initializePayment(user.email, amount, reference);
        
        await Transaction.create({
            user: user._id,
            type: 'deposit',
            amount,
            reference,
            status: 'success'
        });

        // Add funds immediately for demo purposes
        user.walletBalance += parseFloat(amount);
        await user.save();

        // Add notification for deposit
        const axios = require('axios');
        try {
            await axios.post('http://localhost:5000/api/notifications', {
                title: 'Deposit Successful',
                message: `Your deposit of KES ${parseFloat(amount).toLocaleString()} has been received.`
            }, {
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (notifError) {
            console.log('Notification error:', notifError.message);
        }

        res.json({
            authorization_url: payment.data.authorization_url,
            reference
        });
        
    } catch (error) {
        console.error('Deposit init error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.verifyDeposit = async (req, res) => {
    try {
        const { reference } = req.query;
        
        const verification = await verifyPayment(reference);
        
        if (verification.data.status === 'success') {
            const transaction = await Transaction.findOne({ reference });
            
            if (transaction && transaction.status === 'pending') {
                transaction.status = 'success';
                transaction.paystackData = verification.data;
                await transaction.save();
                
                const user = await User.findById(transaction.user);
                user.walletBalance += transaction.amount;
                await user.save();
                
                res.json({ 
                    success: true, 
                    message: 'Deposit successful',
                    balance: user.walletBalance
                });
            } else {
                res.json({ success: false, message: 'Transaction already processed' });
            }
        } else {
            await Transaction.findOneAndUpdate(
                { reference }, 
                { status: 'failed' }
            );
            res.json({ success: false, message: 'Payment failed' });
        }
        
    } catch (error) {
        console.error('Verify deposit error:', error);
        res.status(500).json({ message: error.message });
    }
};