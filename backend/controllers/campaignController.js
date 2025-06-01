const Campaign = require('../models/Campaign');
const Customer = require('../models/Customer');
const CommunicationLog = require('../models/CommunicationLog');
const { generateMessage } = require('../utlis/messageGenerator'); 
const { parseNaturalLanguageToQuery } = require('../services/aiService')
const { body, validationResult } = require('express-validator');

// exports.createSegment = async (req, res) => {
//   try {
    
//     const { name, segmentRules, messageTemplate } = req.body;
//     const customers = await Customer.find(segmentRules);
//     const campaign = await Campaign.create({
//       name,
//       createdBy: req.user._id,
//       segmentRules,
//       messageTemplate,
//       audienceSize: customers.length,
//       status: 'pending'
//     });
//     res.status(201).json(campaign);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// const express = require('express');
// const { body, validationResult } = require('express-validator');
// const router = express.Router();

// Middleware for validation
const validateCampaign = [
  body('name').notEmpty().withMessage('Name is required'),
  body('messageTemplate').notEmpty().withMessage('Message template is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];






exports.createSegment = async (req, res) => {
  try {
    const { name, segmentRules, naturalPrompt, messageTemplate } = req.body;

    let finalSegmentRules = segmentRules;

    // If user provided a prompt instead of raw rules
    if (!segmentRules && naturalPrompt) {
      finalSegmentRules = await parseNaturalLanguageToQuery(naturalPrompt);
    }

    if (!finalSegmentRules || Object.keys(finalSegmentRules).length === 0) {
      return res.status(400).json({ error: 'Failed to parse natural language prompt. Please try again with a different description.' });
    }

    const customers = await Customer.find(finalSegmentRules);

    if (customers.length === 0) {
      return res.status(400).json({ error: 'No customers match the provided segment rules.' });
    }

    // Preview audience size if requested
    if (req.query.preview === 'true') {
      return res.status(200).json({ audienceSize: customers.length, generatedQuery: finalSegmentRules });
    }

    const campaign = await Campaign.create({
      name,
      createdBy: req.user._id,
      segmentRules: finalSegmentRules,
      messageTemplate,
      audienceSize: customers.length,
      status: 'pending'
    });

    console.log('Natural Prompt:', naturalPrompt);
    console.log('Generated Query:', finalSegmentRules);
    console.log('Customers Found:', customers.length);

    res.status(201).json({ campaign, generatedQuery: finalSegmentRules });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};



exports.triggerCampaign = async (req, res) => {
  
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    const customers = await Customer.find(campaign.segmentRules);
    const logs = customers.map(customer => {
      const message = generateMessage(campaign.messageTemplate, { name: customer.name });
      return {
        campaign: campaign._id,
        customer: customer._id,
        message,
        status: 'SENT', // Simulated, you can randomize
        deliveryTimestamp: new Date()
      };
    });

    await CommunicationLog.insertMany(logs);
    campaign.status = 'completed';
    campaign.completedAt = new Date();
    await campaign.save();

    res.status(200).json({ campaign, logsCreated: logs.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.status(200).json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    res.status(200).json(campaign);
  } catch (err) {
    res.status(404).json({ error: 'Campaign not found' });
  }
};

exports.getCampaignSummary = async (req, res) => {
  try {
    const logs = await CommunicationLog.find({ campaign: req.params.id });
    const sent = logs.filter(l => l.status === 'SENT').length;
    const failed = logs.length - sent;
    res.status(200).json({
      summary: `Campaign reached ${logs.length} users. ${sent} delivered, ${failed} failed.`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCampaignLogs = async (req, res) => {
  try {
    const logs = await CommunicationLog.find({ campaign: req.params.id }).populate('customer');
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

