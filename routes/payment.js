const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.route('/link-wallet')
    .post(paymentController.linkingMomo)
module.exports = router;