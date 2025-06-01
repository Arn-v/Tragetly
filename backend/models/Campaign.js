const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  segmentRules: { type: Object, required: true }, // e.g., MongoDB filter object
  messageTemplate: { type: String, required: true }, // e.g., "Hi {{name}}, get 10% off!"
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  audienceSize: { type: Number, default: 0 },
  startedAt: { type: Date },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', campaignSchema);