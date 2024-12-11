const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');

// 搜索建议
router.get('/suggestions', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) {
            return res.json({ suggestions: [] });
        }

        const suggestions = await Resource.aggregate([
            {
                $match: {
                    $or: [
                        { title: new RegExp(q, 'i') },
                        { tags: new RegExp(q, 'i') }
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    suggestions: { $addToSet: '$title' },
                    tagSuggestions: { $addToSet: '$tags' }
                }
            },
            { $limit: 10 }
        ]);

        res.json({ suggestions: suggestions[0]?.suggestions || [] });
    } catch (err) {
        res.status(500).json({ error: '获取搜索建议失败' });
    }
});

// 高级搜索
router.get('/search', async (req, res) => {
    try {
        const { 
            q, 
            page = 1, 
            limit = 10, 
            category,
            sortBy = 'relevance',
            dateRange,
            tags
        } = req.query;
        
        const skip = (page - 1) * limit;

        // 构建查询条件
        let query = {};
        
        if (q) {
            query.$text = { $search: q };
        }
        
        if (category) {
            query.category = category;
        }

        if (tags) {
            query.tags = { $all: tags.split(',') };
        }

        if (dateRange) {
            const [start, end] = dateRange.split(',');
            query.createdAt = {
                $gte: new Date(start),
                $lte: new Date(end)
            };
        }

        // 排序条件
        let sort = {};
        switch (sortBy) {
            case 'relevance':
                sort = { score: { $meta: 'textScore' } };
                break;
            case 'date':
                sort = { createdAt: -1 };
                break;
            case 'views':
                sort = { views: -1 };
                break;
        }

        // 执行查询
        const resources = await Resource.find(query)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        // 处理高亮
        const highlightedResources = resources.map(resource => {
            let highlightedTitle = resource.title;
            let highlightedDesc = resource.description;

            if (q) {
                const keywords = q.split(' ');
                keywords.forEach(keyword => {
                    const regex = new RegExp(keyword, 'gi');
                    highlightedTitle = highlightedTitle.replace(
                        regex, 
                        match => `<mark>${match}</mark>`
                    );
                    highlightedDesc = highlightedDesc.replace(
                        regex, 
                        match => `<mark>${match}</mark>`
                    );
                });
            }

            return {
                ...resource.toObject(),
                title: highlightedTitle,
                description: highlightedDesc
            };
        });

        // 获取总数
        const total = await Resource.countDocuments(query);

        // 获取分类统计
        const categoryStats = await Resource.aggregate([
            { $match: query },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        // 记录用户搜索行为
        await logSearchBehavior(q, req.ip);

        res.json({
            success: true,
            data: {
                resources: highlightedResources,
                pagination: {
                    total,
                    page: parseInt(page),
                    totalPages: Math.ceil(total / limit)
                },
                stats: {
                    categories: categoryStats
                }
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: '服务器错误'
        });
    }
});

// 用户行为分析
const SearchLog = require('../models/SearchLog');

async function logSearchBehavior(query, ip) {
    try {
        await SearchLog.create({
            query,
            ip,
            timestamp: new Date()
        });
    } catch (err) {
        console.error('记录搜索行为失败:', err);
    }
}

module.exports = router; 