const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const crypto = require('crypto');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/transfers', require('./routes/transferRoutes'));
app.use('/api/airtime', require('./routes/airtimeRoutes'));
app.use('/api/pin', require('./routes/pinRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Paystack Webhook endpoint
app.post('/api/webhook/paystack', (req, res) => {
    // Immediately respond to prevent timeout
    res.sendStatus(200);
    
    // Verify signature (optional but recommended)
    const hash = crypto
        .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
        .update(JSON.stringify(req.body))
        .digest('hex');
    
    if (hash !== req.headers['x-paystack-signature']) {
        console.log('⚠️ Invalid webhook signature - ignoring');
        return;
    }
    
    const event = req.body;
    console.log(`📨 Webhook received: ${event.event} at ${new Date().toISOString()}`);
    
    if (event.event === 'charge.success') {
        console.log(`Payment successful!`);
        console.log(`   Reference: ${event.data.reference}`);
        console.log(`   Amount: ${event.data.amount / 100} ${event.data.currency}`);
        console.log(`   Customer: ${event.data.customer.email}`);
        console.log(`   Channel: ${event.data.channel}`);
        
        // Here you would update your database
        // Find transaction by reference and update status
        // Then add funds to user's wallet
    }
});

// Payment verification endpoint (callback)
app.get('/verify-payment', async (req, res) => {
    const { reference } = req.query;
    
    if (!reference) {
        return res.redirect(`${process.env.FRONTEND_URL}/dashboard?payment=error&message=No reference provided`);
    }
    
    try {
        const axios = require('axios');
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }
        );
        
        const transaction = response.data.data;
        
        if (transaction.status === 'success') {
            // Update transaction in database
            const Transaction = require('./models/Transaction');
            const User = require('./models/User');
            
            const dbTransaction = await Transaction.findOne({ reference });
            
            if (dbTransaction && dbTransaction.status === 'pending') {
                dbTransaction.status = 'success';
                dbTransaction.paystackData = transaction;
                await dbTransaction.save();
                
                // Add funds to user's wallet
                await User.findByIdAndUpdate(
                    dbTransaction.user,
                    { $inc: { walletBalance: dbTransaction.amount } }
                );
                
                return res.redirect(`${process.env.FRONTEND_URL}/dashboard?payment=success&amount=${dbTransaction.amount}`);
            }
        }
        
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?payment=failed`);
        
    } catch (error) {
        console.error('Verification error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?payment=error`);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Paystack: ${process.env.PAYSTACK_SECRET_KEY ? 'Configured' : 'Missing API Key'}`);
});