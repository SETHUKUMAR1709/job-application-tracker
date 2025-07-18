const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
        default: 'Applied',
        required: true
    },
    resumeUrl: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    statusHistory: [
        {
            status: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', JobSchema);
