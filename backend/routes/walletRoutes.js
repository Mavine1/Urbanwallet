const express = require('express');
const { protect } = require('../middleware/auth');
const { 
    getWalletBalance, 
    initializeDeposit, 
    verifyDeposit,
    getTransactions 
} = require('../controllers/walletController');
const router = express.Router();

router.use(protect);
router.get('/balance', getWalletBalance);
router.post('/deposit/initialize', initializeDeposit);
router.get('/deposit/verify', verifyDeposit);
router.get('/transactions', getTransactions);

module.exports = router;