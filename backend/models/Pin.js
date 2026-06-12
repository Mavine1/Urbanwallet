const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const pinSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    pin: {
        type: String,
        required: true
    },
    failedAttempts: {
        type: Number,
        default: 0
    },
    lockedUntil: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Hash PIN before saving
pinSchema.pre('save', async function() {
    if (this.isModified('pin')) {
        this.pin = await bcrypt.hash(this.pin, 10);
    }
    this.updatedAt = Date.now();
});

// Verify PIN
pinSchema.methods.verifyPin = async function(candidatePin) {
    return await bcrypt.compare(candidatePin, this.pin);
};

module.exports = mongoose.model('Pin', pinSchema);