const express = require('express');
const { protect } = require('../middleware/auth');
const { sendMoney, getTransferHistory } = require('../controllers/transferController');
const router = express.Router();

router.use(protect);
router.post('/send', sendMoney);
router.get('/history', getTransferHistory);

module.exports = router;