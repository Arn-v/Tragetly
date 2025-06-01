const express = require('express');
const router = express.Router();
const { sendMessageToVendor, receiveDeliveryReceipt } = require('../controllers/deliveryController');



// Delivery acknowledgment from vendor
router.post('/receipt', receiveDeliveryReceipt);

module.exports = router;
