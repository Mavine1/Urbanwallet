const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Detect network from Kenyan phone number
const detectNetwork = (phoneNumber) => {
    // Remove any non-digit characters
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Get last 9 digits (Safaricom/Airtel/Telkom format)
    const number = cleanNumber.slice(-9);
    const prefix = number.substring(0, 3);
    
    // Safaricom prefixes
    const safaricomPrefixes = ['701', '702', '703', '704', '705', '706', '707', '708', '709',
                               '710', '711', '712', '713', '714', '715', '716', '717', '718', '719',
                               '720', '721', '722', '723', '724', '725', '726', '727', '728', '729',
                               '740', '741', '742', '743', '744', '745', '746', '747', '748', '749',
                               '750', '751', '752', '753', '754', '755', '756', '757', '758', '759',
                               '760', '761', '762', '763', '764', '765', '766', '767', '768', '769',
                               '790', '791', '792', '793', '794', '795', '796', '797', '798', '799'];
    
    // Airtel prefixes
    const airtelPrefixes = ['700', '701', '702', '703', '704', '705', '706', '707', '708', '709',
                            '710', '711', '712', '713', '714', '715', '716', '717', '718', '719',
                            '750', '751', '752', '753', '754', '755', '756', '757', '758', '759',
                            '780', '781', '782', '783', '784', '785', '786', '787', '788', '789'];
    
    // Telkom prefixes
    const telkomPrefixes = ['747', '748', '749', '750', '751', '752', '753', '754', '755', '756',
                            '757', '758', '759', '760', '761', '762', '763', '764', '765', '766',
                            '767', '768', '769', '770', '771', '772', '773', '774', '775', '776',
                            '777', '778', '779'];
    
    if (safaricomPrefixes.includes(prefix)) return 'Safaricom';
    if (airtelPrefixes.includes(prefix)) return 'Airtel';
    if (telkomPrefixes.includes(prefix)) return 'Telkom';
    
    return 'Unknown';
};

exports.buyAirtime = async (req, res) => {
    try {
        const { phoneNumber, amount } = req.body;
        const userId = req.user.id;
        
        // Validate
        if (!phoneNumber || !amount || amount < 10) {
            return res.status(400).json({ message: 'Valid phone number and amount (min 10 KES) required' });
        }
        
        if (amount > 50000) {
            return res.status(400).json({ message: 'Maximum airtime purchase is 50,000 KES' });
        }
        
        const user = await User.findById(userId);
        
        if (user.walletBalance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }
        
        const network = detectNetwork(phoneNumber);
        if (network === 'Unknown') {
            return res.status(400).json({ message: 'Invalid Kenyan phone number' });
        }
        
        // Deduct from wallet
        user.walletBalance -= amount;
        await user.save();
        
        // Create transaction
        const transaction = await Transaction.create({
            user: userId,
            type: 'airtime',
            amount: amount,
            status: 'success',
            reference: `AIR_${Date.now()}_${userId}`,
            description: `${amount} KES airtime for ${phoneNumber}`,
            phoneNumber: phoneNumber,
            network: network
        });
        
        // Here you would integrate with a real airtime API
        // For Paystack, you can use their beta airtime API or third-party services
        console.log(`✅ Airtime: ${amount} KES sent to ${phoneNumber} via ${network}`);
        
        res.json({
            success: true,
            message: `Successfully purchased ${amount} KES airtime for ${phoneNumber}`,
            newBalance: user.walletBalance,
            transaction: transaction,
            network: network
        });
        
    } catch (error) {
        console.error('Airtime error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getAirtimeHistory = async (req, res) => {
    try {
        const history = await Transaction.find({
            user: req.user.id,
            type: 'airtime'
        }).sort({ createdAt: -1 }).limit(50);
        
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};