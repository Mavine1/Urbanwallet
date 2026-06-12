const express = require('express');
const { buyAirtime } = require('../controllers/airtimeController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/buy', protect, buyAirtime);

module.exports = router;