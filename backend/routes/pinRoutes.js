const express = require('express');
const { protect } = require('../middleware/auth');
const { createPin, updatePin, verifyPin, hasPin } = require('../controllers/pinController');
const router = express.Router();

router.use(protect);
router.post('/create', createPin);
router.put('/update', updatePin);
router.post('/verify', verifyPin);
router.get('/has', hasPin);

module.exports = router;