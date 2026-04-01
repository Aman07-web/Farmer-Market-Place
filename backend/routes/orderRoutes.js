const express = require('express');
const router = express.Router();
const escrowController = require('../controllers/escrowController');

// 1. Create Order
router.post('/create-order', escrowController.createOrder);

// 2. Verify Payment
router.post('/verify-payment', escrowController.verifyPayment);

// 2b. General Update Status (Used by Farmer Dashboard)
router.post('/update-status', escrowController.updateStatus);

// 3. Ship Order
router.post('/ship-order', escrowController.shipOrder);

// 4. Confirm Delivery
router.post('/confirm-delivery', escrowController.confirmDelivery);

// 5. Refund
router.post('/refund', escrowController.refundOrder);

module.exports = router;
