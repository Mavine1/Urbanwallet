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
        
        const reference = `URBAN_${Date.now()}_${user._id}`;
        
        const payment = await initializePayment(user.email, amount, reference);
        
        // Create transaction record
        await Transaction.create({
            user: user._id,
            type: 'deposit',
            amount,
            reference,
            status: 'pending'
        });
        
        res.json({ 
            authorization_url: payment.data.authorization_url,
            reference 
        });
    } catch (error) {
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
                // Update transaction status
                transaction.status = 'success';
                transaction.paystackData = verification.data;
                await transaction.save();
                
                // Update user balance
                const user = await User.findById(transaction.user);
                user.walletBalance += transaction.amount;
                await user.save();
                
                res.json({ 
                    success: true, 
                    message: 'Deposit successful',
                    balance: user.walletBalance
                });
            }
        } else {
            await Transaction.findOneAndUpdate(
                { reference }, 
                { status: 'failed' }
            );
            res.json({ success: false, message: 'Payment failed' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id })
            .sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};