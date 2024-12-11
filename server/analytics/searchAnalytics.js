const SearchLog = require('../models/SearchLog');

class SearchAnalytics {
    // 获取热门搜索词
    static async getPopularQueries(days = 7) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        return await SearchLog.aggregate([
            {
                $match: {
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: '$query',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 10
            }
        ]);
    }

    // 分析搜索转化率
    static async getSearchConversion() {
        return await SearchLog.aggregate([
            {
                $group: {
                    _id: '$query',
                    searches: { $sum: 1 },
                    clicks: { $sum: { $size: '$clickedResults' } }
                }
            },
            {
                $project: {
                    query: '$_id',
                    conversionRate: {
                        $divide: ['$clicks', '$searches']
                    }
                }
            },
            {
                $sort: { conversionRate: -1 }
            }
        ]);
    }

    // 获取无结果的搜索词
    static async getZeroResultQueries() {
        return await SearchLog.find({
            resultCount: 0
        }).distinct('query');
    }
}

module.exports = SearchAnalytics; 