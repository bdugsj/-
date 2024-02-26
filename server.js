const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = 3000;

// 存储内容的文件路径
const DATA_FILE = path.join(__dirname, 'content.json');

// 中间件
app.use(bodyParser.json());
app.use(express.static('public')); // 假设您的前端文件放在项目的public目录下

// 获取页面内容的接口
app.get('/api/content/:page', async (req, res) => {
    try {
        const data = await fs.readJson(DATA_FILE);
        const page = req.params.page;
        const pageContent = data[page] || '页面内容未找到';
        res.json({ success: true, content: pageContent });
    } catch (error) {
        res.status(500).json({ success: false, message: '服务器错误' });
    }
});

// 更新页面内容的接口
app.post('/api/content/:page', async (req, res) => {
    try {
        const page = req.params.page;
        const { content } = req.body;

        const data = await fs.readJson(DATA_FILE);
        data[page] = content;
        await fs.writeJson(DATA_FILE, data);

        res.json({ success: true, message: '内容更新成功' });
    } catch (error) {
        res.status(500).json({ success: false, message: '服务器错误' });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});
