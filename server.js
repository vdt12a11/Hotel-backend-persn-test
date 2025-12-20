require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const verifyJWT = require('./middleware/verifyJWT');
const connectDB = require('./config/dbConn');
connectDB();
const PORT = 3000;
app.use(express.json());

// Route chính

app.use(express.urlencoded({ extended: true }));

app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));

//app.use(verifyJWT);

app.use('/room', require('./routes/room'));
app.use('/history', require('./routes/history'));
app.use('/booking', require('./routes/booking'));
app.use('/profile', require('./routes/profile'));
app.get('/', (req, res) => {
    res.send('Hello from Express server!');
});

// Thêm 1 API mẫu
// app.get('/register', (req, res) => {
//     res.json({
//         name: 'Tuan',
//         age: 22,
//         message: 'Welcome to my Express API!'
//     });
// });

// Start server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`) ;
});
