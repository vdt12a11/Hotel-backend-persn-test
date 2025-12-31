const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
router.route('/').post(paymentController.createPayment);
router.route('/link-wallet')
    .post(paymentController.linkingMomo)
router.route('/callback')
    .post(paymentController.callback)
router.route('/status/:orderId')
    .get(paymentController.getStatus)
module.exports = router;