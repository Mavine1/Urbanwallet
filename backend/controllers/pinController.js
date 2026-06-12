const Pin = require('../models/Pin');

exports.createPin = async (req, res) => {
    try {
        const { pin } = req.body;
        const userId = req.user.id;
        
        // Validate PIN (4-6 digits)
        if (!pin || pin.length < 4 || pin.length > 6 || !/^\d+$/.test(pin)) {
            return res.status(400).json({ message: 'PIN must be 4-6 digits only' });
        }
        
        // Check if PIN already exists
        const existingPin = await Pin.findOne({ user: userId });
        if (existingPin) {
            return res.status(400).json({ message: 'PIN already set. Use update endpoint.' });
        }
        
        // Create new PIN
        await Pin.create({
            user: userId,
            pin: pin
        });
        
        res.json({ success: true, message: 'Transaction PIN created successfully' });
        
    } catch (error) {
        console.error('Create PIN error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.updatePin = async (req, res) => {
    try {
        const { oldPin, newPin } = req.body;
        const userId = req.user.id;
        
        const pinRecord = await Pin.findOne({ user: userId });
        if (!pinRecord) {
            return res.status(404).json({ message: 'PIN not set. Create one first.' });
        }
        
        // Verify old PIN
        const isValid = await pinRecord.verifyPin(oldPin);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid old PIN' });
        }
        
        // Validate new PIN
        if (!newPin || newPin.length < 4 || newPin.length > 6 || !/^\d+$/.test(newPin)) {
            return res.status(400).json({ message: 'New PIN must be 4-6 digits only' });
        }
        
        // Update PIN
        pinRecord.pin = newPin;
        pinRecord.failedAttempts = 0;
        await pinRecord.save();
        
        res.json({ success: true, message: 'PIN updated successfully' });
        
    } catch (error) {
        console.error('Update PIN error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.verifyPin = async (req, res) => {
    try {
        const { pin } = req.body;
        const userId = req.user.id;
        
        const pinRecord = await Pin.findOne({ user: userId });
        if (!pinRecord) {
            return res.status(404).json({ message: 'PIN not set. Please set a transaction PIN first.' });
        }
        
        // Check if PIN is locked
        if (pinRecord.lockedUntil && pinRecord.lockedUntil > new Date()) {
            const remaining = Math.ceil((pinRecord.lockedUntil - new Date()) / 60000);
            return res.status(401).json({ message: `PIN locked. Try again in ${remaining} minutes` });
        }
        
        // Verify PIN
        const isValid = await pinRecord.verifyPin(pin);
        
        if (!isValid) {
            pinRecord.failedAttempts += 1;
            
            // Lock after 5 failed attempts
            if (pinRecord.failedAttempts >= 5) {
                pinRecord.lockedUntil = new Date(Date.now() + 30 * 60000); // 30 minutes
                await pinRecord.save();
                return res.status(401).json({ message: 'Too many failed attempts. PIN locked for 30 minutes' });
            }
            
            await pinRecord.save();
            return res.status(401).json({ message: `Invalid PIN. ${5 - pinRecord.failedAttempts} attempts remaining` });
        }
        
        // Reset failed attempts on success
        pinRecord.failedAttempts = 0;
        pinRecord.lockedUntil = null;
        await pinRecord.save();
        
        res.json({ success: true, message: 'PIN verified successfully' });
        
    } catch (error) {
        console.error('Verify PIN error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.hasPin = async (req, res) => {
    try {
        const pinRecord = await Pin.findOne({ user: req.user.id });
        res.json({ hasPin: !!pinRecord });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};