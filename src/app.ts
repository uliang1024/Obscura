// 導入必要的模組
import express from 'express';
import path from 'path';
import { router } from './routes/router';
const expressLayouts = require('express-ejs-layouts');

// 設置端口
const port = 3000;

// 創建 Express 應用程式實例
const app: express.Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 設置視圖引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 設置布局模板
app.use(expressLayouts);
app.set('layout', 'layout');

// 設置靜態文件目錄
app.use(express.static('public'));

// load routes
router.forEach(route => {
    app.use(route.getPrefix(), route.getRouter());
});

// 啟動服務器
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
