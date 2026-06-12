const express = require('express');
const router = express.Router();

// Mock notifications - in production, use a real database
let notifications = [
    { id: 1, title: 'Welcome to UrbanWallet', message: 'Start sending money securely today!', read: false, createdAt: new Date().toISOString() },
    { id: 2, title: 'Account Verified', message: 'Your account has been verified successfully.', read: false, createdAt: new Date().toISOString() },
];

// Get notifications
router.get('/', (req, res) => {
    res.json({ notifications });
});

// Mark notification as read
router.put('/:id/read', (req, res) => {
    const { id } = req.params;
    const notification = notifications.find(n => n.id === parseInt(id));
    if (notification) {
        notification.read = true;
        res.json({ success: true });
    } else {
        res.status(404).json({ message: 'Notification not found' });
    }
});

module.exports = router;