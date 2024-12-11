const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/resource_site', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('MongoDB 连接成功');
    } catch (err) {
        console.error('MongoDB 连接失败:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB; 