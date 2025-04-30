const mongoose = require('mongoose');

const userPcBuildSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    buildName: {
        type: String,
        required: true
    },
    buildDescription: {
        type: String,
        default: ''
    },
    components: {
        cpu: { type: Object },
        ram: { type: Object },
        ssd: { type: Object },
        gpu: { type: Object },
        motherboard: { type: Object },
        psu: { type: Object },
        case: { type: Object },
        cooling: { type: Object }
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Processing', 'Completed', 'Cancelled'],
        default: 'Processing'
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

module.exports = mongoose.model('UserPcBuild', userPcBuildSchema); 