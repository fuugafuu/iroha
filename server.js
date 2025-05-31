require('dotenv').config(); // ← .envから環境変数を読み込む
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const ADMIN_PASS = process.env.ADMIN_PASS;

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// パスワード確認API
app.post('/api/checkpw', (req, res) => {
  res.json({ ok: req.body.pw === ADMIN_PASS });
});

// お知らせ取得API
app.get('/api/notices', (req, res) => {
  fs.readFile('notices.json', (err, data) => {
    if (err) return res.json([]);
    res.json(JSON.parse(data));
  });
});

// 投稿API（管理者のみ）
app.post('/api/notices', (req, res) => {
  if (req.body.pass !== ADMIN_PASS) return res.status(403).json({ error: 'forbidden' });
  fs.readFile('notices.json', (err, data) => {
    let notices = [];
    if (!err) notices = JSON.parse(data);
    notices.unshift({
      title: req.body.title,
      body: req.body.body,
      date: req.body.date
    });
    fs.writeFile('notices.json', JSON.stringify(notices, null, 2), () => {
      res.json({ ok: true });
    });
  });
});

app.listen(3000, () => {
  console.log('サーバー起動 http://localhost:3000');
});
