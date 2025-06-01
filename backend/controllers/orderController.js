

const Customer = require('../models/Customer');
const Order = require('../models/Order');




exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    // update customer totalSpend
    const customer = await Customer.findById(req.body.customer) ; 

    if(customer){
      customer.totalSpend += req.body.amount ; 
      customer.orderCount ++ ; 
      await customer.save() ; 
      console.log(customer); 

    }
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('customer');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getOrdersByCustomer = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.params.customerId }).populate('customer') ;
    // console.log(orders);
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.bulkUploadOrders = async (req, res) => {
  try {
    const inserted = await Order.insertMany(req.body);
    res.status(201).json({ count: inserted.length, data: inserted });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
