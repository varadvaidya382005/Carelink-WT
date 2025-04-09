const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    submissionLocation: {
        type: String,
        required: true
    },
    issueType: {
        type: String,
        enum: ['road', 'water', 'electricity', 'waste', 'other'],
        required: true
    },
    urgencyLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: true
    },
    expectedImpact: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'in_progress', 'resolved'],
        default: 'pending'
    },
    assignedNGO: {
        ngoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ngouser'
        },
        ngoName: String,
        assignedAt: Date
    },
    verificationStatus: {
        isVerified: {
            type: Boolean,
            default: false
        },
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ngouser'
        },
        verifiedAt: Date,
        verificationNote: String
    },
    updates: [{
        status: String,
        message: String,
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ngouser'
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Issue', issueSchema); 