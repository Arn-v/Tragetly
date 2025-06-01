const express = require('express');
const router = express.Router();
const { createCustomer, getAllCustomers, getCustomerById, bulkUploadCustomers, updateCustomer, deleteCustomer } = require('../controllers/customerController');

router.post('/', createCustomer);
router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);
router.post('/bulk', bulkUploadCustomers);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;
