const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ 
                message: 'Please provide name, email and password' 
            });
        }
        
        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Create user
        const user = await User.create({ name, email, password });
        
        // Generate token
        const token = generateToken(user._id);
        
        res.status(201).json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            walletBalance: user.walletBalance,
            token: token
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }
        
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const token = generateToken(user._id);
        
        res.json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            walletBalance: user.walletBalance,
            token: token
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            walletBalance: user.walletBalance
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name } = req.body;
        const user = await User.findById(req.user.id);

        if (name) user.name = name;

        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            walletBalance: user.walletBalance
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Google Login (mock - in production use real Google OAuth)
exports.googleLogin = async (req, res) => {
    try {
        const { googleId, email, name, avatar } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Google account email is required' });
        }

        let user = await User.findOne({ email });

        // Create user if doesn't exist (Google OAuth sign up)
        if (!user) {
            user = await User.create({
                name: name || email.split('@')[0],
                email,
                password: googleId + '_google_oauth', // Dummy password for OAuth users
                isGoogleAccount: true
            });
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            walletBalance: user.walletBalance,
            isGoogleAccount: user.isGoogleAccount,
            token: token
        });

    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update Password
exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Please provide current and new password' });
        }

        // Check if user has a password (Google users can't change password)
        if (user.isGoogleAccount) {
            return res.status(400).json({ message: 'Google accounts cannot change password' });
        }

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Validate new password
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ success: true, message: 'Password updated successfully' });

    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({ message: error.message });
    }
};