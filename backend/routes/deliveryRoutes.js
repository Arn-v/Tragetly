const express = require('express');
const router = express.Router();
const { sendMessageToVendor, receiveDeliveryReceipt } = require('../controllers/deliveryController');

// Simulate sending messages (dummy vendor)
router.post('/send', sendMessageToVendor);

// Delivery acknowledgment from vendor
router.post('/receipt', receiveDeliveryReceipt);

module.exports = router;
