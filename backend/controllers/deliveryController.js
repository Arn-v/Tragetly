

const CommunicationLog = require('../models/CommunicationLog');



exports.receiveDeliveryReceipt = async (req, res) => {
  const { logId, status } = req.body;

  if (!logId || !['SENT', 'FAILED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  try {
    await CommunicationLog.findByIdAndUpdate(logId, {
      status,
      deliveryTimestamp: new Date()
    });


    res.status(200).json({ message: 'Delivery status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update delivery status' });
  }
};




