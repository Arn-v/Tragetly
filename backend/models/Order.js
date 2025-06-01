const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // orderId: { type: String, required: true, unique: true }, // External reference ID
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  amount: { type: Number, required: true },
  items: [{ productName: String, quantity: Number, price: Number }],
  paymentMethod: { type: String },
  status: { type: String, enum: ['paid', 'pending', 'failed'], default: 'paid' },
  date: { type: Date, required: true , default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema );