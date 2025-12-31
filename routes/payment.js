const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
router.route('/').post(paymentController.createPayment);
router.route('/link-wallet')
    .post(paymentController.linkingMomo)
router.route('/callback/order')
    .post(paymentController.callbackOrder)
    router.route('/callback/wallet')
    .post(paymentController.callbackWallet)
router.route('/status/:orderId')
    .get(paymentController.getStatus)
module.exports = router;