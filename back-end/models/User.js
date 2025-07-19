const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    // New Profile Fields
    bio: {
        type: String,
        default: ''
    },
    skills: {
        type: [String], // Array of strings
        default: []
    },
    experience: {
        type: [String], // Array of strings for job experiences
        default: []
    },
    education: {
        type: [String], // Array of strings for education details
        default: []
    },
    birthday: {
        type: Date
    },
    hometown: {
        type: String,
        default: ''
    },
    socialMedia: {
        linkedin: { type: String, default: '' },
        github: { type: String, default: '' },
        twitter: { type: String, default: '' },
        website: { type: String, default: '' }
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

module.exports = mongoose.model('User', UserSchema);
