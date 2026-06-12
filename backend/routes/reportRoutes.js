const express = require('express');
const { protect } = require('../middleware/auth');
const { getTransactionHistory, exportToCSV, getSummary } = require('../controllers/reportController');
const router = express.Router();

router.use(protect);
router.get('/history', getTransactionHistory);
router.get('/export', exportToCSV);
router.get('/summary', getSummary);

module.exports = router;