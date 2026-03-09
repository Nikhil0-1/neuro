const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional if using Google OAuth exclusively
    googleId: { type: String },
    avatar: { type: String },
    theme: { type: String, default: 'dark' },
    tokensUsed: { type: Number, default: 0 }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
