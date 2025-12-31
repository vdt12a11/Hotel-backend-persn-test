require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const verifyJWT = require('./middleware/verifyJWT');
const connectDB = require('./config/dBConn');
connectDB();
const PORT = 3000;

// parse urlencoded bodies (form posts from gateways)
app.use(express.urlencoded({ extended: true }));

// only parse JSON when Content-Type is application/json and non-empty
app.use(express.json({
  type: (req) => {
    const ct = (req.headers['content-type'] || '');
    const len = req.headers['content-length'];
    if (!ct.includes('application/json')) return false;
    if (!len || len === '0') return false;
    return true;
  }
}));

// incoming request logger (headers + content-length) for webhook debugging
app.use((req, res, next) => {
  console.log('INCOMING', req.method, req.originalUrl);
  console.log('content-type:', req.headers['content-type']);
  console.log('content-length:', req.headers['content-length']);
  next();
});

// Route chính

app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));

//app.use(verifyJWT);

app.use('/room', require('./routes/room'));
app.use('/history', require('./routes/history'));
app.use('/booking', require('./routes/booking'));
app.use('/profile', require('./routes/profile'));
app.use('/payment', require('./routes/payment'));
app.get('/', (req, res) => {
    res.send('Thanh cong!');
});

// body-parser error handler to catch empty/invalid JSON
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`) ;
});
