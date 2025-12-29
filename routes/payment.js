const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.route('/')
    .get(roomController.getAllRoom)
module.exports = router;