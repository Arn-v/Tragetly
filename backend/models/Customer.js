const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const customerSchema = new mongoose.Schema({
  customerId: { type: String, unique: true }, // External reference ID
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
  totalSpend: { type: Number, default: 0 },
  visits: { type: Number, default: 0 },
  lastActive: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

customerSchema.pre('save', function(next) {
  if (!this.customerId) {
    this.customerId = uuidv4();
  }
  next();
});

module.exports = mongoose.model('Customer', customerSchema);