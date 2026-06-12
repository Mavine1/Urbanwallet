const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['deposit', 'withdrawal', 'transfer_sent', 'transfer_received', 'airtime', 'bill_payment'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    },
    reference: {
        type: String,
        unique: true,
        sparse: true
    },
    description: {
        type: String,
        default: ''
    },
    recipientEmail: String,
    senderEmail: String,
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    phoneNumber: String,
    network: String,
    paystackData: Object,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add index for faster queries
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ reference: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);