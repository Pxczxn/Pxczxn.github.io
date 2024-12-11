const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
        required: true,
        index: true
    },
    category: {
        type: String,
        required: true,
        enum: ['软件', '视频', '图片', '音乐', '文档', '模板', '其他']
    },
    url: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
        index: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// 创建文本索引用于全文搜索
resourceSchema.index({
    title: 'text',
    description: 'text',
    tags: 'text'
});

module.exports = mongoose.model('Resource', resourceSchema); 