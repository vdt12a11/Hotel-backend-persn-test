const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

router.get('/:userID', historyController.getHistory);
router.get('/upcoming/:userID', historyController.getHistoryUpcoming);
module.exports = router;