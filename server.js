const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);

// 設置默認布局文件
app.set('layout', 'layout');

app.get('/', (req, res) => {
  res.render('index', { title: '首頁' });
});

const videoRouter = require('./routes/video');
app.use('/video', videoRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
