const axios = require('axios');

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

const paystackAPI = axios.create({
    baseURL: 'https://api.paystack.co',
    headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        'Content-Type': 'application/json'
    }
});

const initializePayment = async (email, amount, reference) => {
    try {
        const response = await paystackAPI.post('/transaction/initialize', {
            email,
            amount: amount * 100, 
            reference,
            callback_url: `${process.env.FRONTEND_URL}/verify-payment`,
            channels: ['card', 'mobile_money', 'apple_pay']
        });
        return response.data;
    } catch (error) {
        console.error('Paystack init error:', error.response?.data || error.message);
        throw error;
    }
};

const verifyPayment = async (reference) => {
    try {
        const response = await paystackAPI.get(`/transaction/verify/${reference}`);
        return response.data;
    } catch (error) {
        console.error('Paystack verify error:', error.response?.data || error.message);
        throw error;
    }
};

module.exports = { initializePayment, verifyPayment };