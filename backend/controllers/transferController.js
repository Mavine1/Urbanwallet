const User = require('../models/User');
const Transaction = require('../models/Transaction');

exports.sendMoney = async (req, res) => {
    try {
        const { recipientEmail, amount, description } = req.body;
        const senderId = req.user.id;
        
        // Validate amount
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Amount must be greater than 0' });
        }
        
        // Find sender and recipient
        const sender = await User.findById(senderId);
        const recipient = await User.findOne({ email: recipientEmail });
        
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }
        
        // Check if sending to self
        if (sender.email === recipientEmail) {
            return res.status(400).json({ message: 'Cannot send money to yourself' });
        }
        
        // Check sufficient balance
        if (sender.walletBalance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }
        
        // Check daily transfer limit (500,000 KES)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const dailyTransfers = await Transaction.find({
            user: senderId,
            type: 'transfer_sent',
            status: 'success',
            createdAt: { $gte: today }
        });
        
        const dailyTotal = dailyTransfers.reduce((sum, t) => sum + t.amount, 0);
        if (dailyTotal + amount > 500000) {
            return res.status(400).json({ 
                message: `Daily transfer limit exceeded. Remaining limit: ${500000 - dailyTotal} KES` 
            });
        }
        
        // Perform transfer
        sender.walletBalance -= amount;
        recipient.walletBalance += amount;
        
        await sender.save();
        await recipient.save();
        
        // Create transaction records
        const reference = `TRF_${Date.now()}_${sender._id}`;
        
        const debitTransaction = await Transaction.create({
            user: senderId,
            type: 'transfer_sent',
            amount: amount,
            status: 'success',
            reference: `${reference}_SENT`,
            description: description || `Transfer to ${recipient.email}`,
            recipientEmail: recipient.email,
            recipientId: recipient._id
        });
        
        await Transaction.create({
            user: recipient._id,
            type: 'transfer_received',
            amount: amount,
            status: 'success',
            reference: `${reference}_RECEIVED`,
            description: description || `Transfer from ${sender.email}`,
            senderEmail: sender.email,
            senderId: sender._id
        });
        
        res.json({
            success: true,
            message: 'Transfer successful',
            newBalance: sender.walletBalance,
            transaction: debitTransaction
        });
        
    } catch (error) {
        console.error('Transfer error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getTransferHistory = async (req, res) => {
    try {
        const transfers = await Transaction.find({
            user: req.user.id,
            type: { $in: ['transfer_sent', 'transfer_received'] }
        }).sort({ createdAt: -1 }).limit(50);
        
        res.json(transfers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};