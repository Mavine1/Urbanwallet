const Transaction = require('../models/Transaction');
const json2csv = require('json2csv').parse;

exports.getTransactionHistory = async (req, res) => {
    try {
        const { startDate, endDate, type, limit = 50, page = 1 } = req.query;
        
        let query = { user: req.user.id };
        
        // Apply date filters
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        // Apply type filter
        if (type && type !== 'all') {
            query.type = type;
        }
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const [transactions, total] = await Promise.all([
            Transaction.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Transaction.countDocuments(query)
        ]);
        
        res.json({
            transactions,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalTransactions: total,
                limit: parseInt(limit)
            }
        });
        
    } catch (error) {
        console.error('History error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.exportToCSV = async (req, res) => {
    try {
        const { startDate, endDate, type } = req.query;
        
        let query = { user: req.user.id };
        
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        if (type && type !== 'all') {
            query.type = type;
        }
        
        const transactions = await Transaction.find(query).sort({ createdAt: -1 });
        
        // Prepare data for CSV
        const csvData = transactions.map(t => ({
            'Date': new Date(t.createdAt).toLocaleString(),
            'Type': t.type.replace('_', ' ').toUpperCase(),
            'Amount (KES)': t.amount,
            'Status': t.status.toUpperCase(),
            'Description': t.description || '',
            'Reference': t.reference || '',
            'Recipient/Sender': t.recipientEmail || t.senderEmail || 'N/A'
        }));
        
        const csv = json2csv(csvData);
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=urbanwallet_transactions_${Date.now()}.csv`);
        res.send(csv);
        
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get current balance
        const user = await User.findById(userId);
        
        // Get total sent
        const sent = await Transaction.aggregate([
            { $match: { user: userId, type: 'transfer_sent', status: 'success' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        
        // Get total received
        const received = await Transaction.aggregate([
            { $match: { user: userId, type: 'transfer_received', status: 'success' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        
        // Get total airtime purchased
        const airtime = await Transaction.aggregate([
            { $match: { user: userId, type: 'airtime', status: 'success' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        
        // Get total deposits
        const deposits = await Transaction.aggregate([
            { $match: { user: userId, type: 'deposit', status: 'success' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        
        // Get monthly spending (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const monthlySpending = await Transaction.aggregate([
            { 
                $match: { 
                    user: userId, 
                    type: { $in: ['transfer_sent', 'airtime'] },
                    status: 'success',
                    createdAt: { $gte: sixMonthsAgo }
                } 
            },
            {
                $group: {
                    _id: { 
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    total: { $sum: '$amount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        
        res.json({
            currentBalance: user.walletBalance,
            totalSent: sent[0]?.total || 0,
            totalReceived: received[0]?.total || 0,
            totalAirtime: airtime[0]?.total || 0,
            totalDeposits: deposits[0]?.total || 0,
            monthlySpending: monthlySpending
        });
        
    } catch (error) {
        console.error('Summary error:', error);
        res.status(500).json({ message: error.message });
    }
};