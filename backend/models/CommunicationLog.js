const mongoose = require('mongoose');

const communicationLogSchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  message: { type: String },
  status: { type: String, enum: ['SENT', 'FAILED' , 'PENDING'], required: true },
  deliveryTimestamp: { type: Date },
  vendorResponse: { type: String }, // optional details from vendor API
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CommunicationLog', communicationLogSchema);