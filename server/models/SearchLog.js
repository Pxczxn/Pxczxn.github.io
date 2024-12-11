const mongoose = require('mongoose');

const searchLogSchema = new mongoose.Schema({
    query: String,
    ip: String,
    timestamp: Date,
    userAgent: String,
    resultCount: Number,
    clickedResults: [{
        resourceId: mongoose.Schema.Types.ObjectId,
        position: Number
    }]
});

module.exports = mongoose.model('SearchLog', searchLogSchema); 