const express = require('express');
const router = express.Router();

const { createOrder, getAllOrders, getOrdersByCustomer, bulkUploadOrders } = require('../controllers/orderController');


router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/customer/:customerId', getOrdersByCustomer);
router.post('/bulk', bulkUploadOrders);



module.exports = router;
