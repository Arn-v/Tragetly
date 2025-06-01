

const CommunicationLog = require('../models/CommunicationLog');


// Simulate vendor message sending (not called from frontend)
exports.sendMessageToVendor = (req, res) => {
  const success = Math.random() < 0.9;
  const status = success ? 'SENT' : 'FAILED';
  // Simulated delivery callback
  res.status(200).json({ status });
};



// Delivery callback from vendor
exports.receiveDeliveryReceipt = async (req, res) => {
  try {
    const { logId, status } = req.body;
    await CommunicationLog.findByIdAndUpdate(logId, {
      status,
      deliveryTimestamp: new Date()
    });
    res.status(200).json({ message: 'Updated delivery status' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
