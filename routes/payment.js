const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.route('/link-wallet')
    .post(paymentController.linkingMomo)
router.route('/callback')
    .post(paymentController.callback)
module.exports = router;