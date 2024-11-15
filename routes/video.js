const express = require('express');
const router = express.Router();
const multer = require('multer'); // 用於處理上傳的文件
const path = require('path');

// 設定存儲目錄和檔名格式
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // 儲存位置
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // 文件名稱為當前時間戳
  },
});
const upload = multer({ storage: storage });

// 錄影頁面
router.get('/record', (req, res) => {
  res.render('record', { title: '錄影頁面' });
});

// 影片列表頁面
router.get('/list', (req, res) => {
  // 假設影片檔案儲存在 `uploads` 資料夾中
  const fs = require('fs');
  const videoFiles = fs
    .readdirSync('uploads/')
    .filter((file) => file.endsWith('.webm')) // 篩選 webm 格式的檔案
    .map((file) => ({ name: file, path: `/uploads/${file}` }));

  res.render('list', { videos: videoFiles, title: '影片列表' });
});

module.exports = router;
