// vendorSimulator.js
const axios = require('axios');
const mongoose = require('mongoose');
const CommunicationLog = require('../models/CommunicationLog');

mongoose.connect('mongodb+srv://arnv15:sElbdfvRYFHtgzpM@targetly-crm-db.za4rjfz.mongodb.net/');

const simulateVendorDelivery = async () => {
  try {
    const pendingLogs = await CommunicationLog.find({ status: 'PENDING' });

    for (const log of pendingLogs) {
      const status = Math.random() < 0.9 ? 'SENT' : 'FAILED';

      await axios.post('http://localhost:5000/api/delivery/receipt', {
        logId: log._id,
        status
      });

      console.log(`Updated delivery status for logId: ${log._id}, status: ${status}`);
    }

    console.log('Vendor simulation complete.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

simulateVendorDelivery();
