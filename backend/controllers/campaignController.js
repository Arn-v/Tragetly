const Campaign = require('../models/Campaign');
const Customer = require('../models/Customer');
const CommunicationLog = require('../models/CommunicationLog');
const { generateMessage } = require('../utils/messageGenerator'); 
const { parseNaturalLanguageToQuery , generateMessageSuggestion } = require('../services/aiService')
const { body, validationResult } = require('express-validator') ;

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
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];





// segmentization of audience & creating campaign
exports.createSegment = async (req, res) => {
  try {
    const { name, segmentRules, naturalPrompt  } = req.body;

    let finalSegmentRules = segmentRules;
    console.log(finalSegmentRules) ; 
    console.log(naturalPrompt) ; 

    // If user provided a prompt instead of raw rules
    if (!segmentRules && naturalPrompt) {
      console.log("Calling LLM") ; 
      finalSegmentRules = await parseNaturalLanguageToQuery(naturalPrompt) ;
      console.log("Segment Rule created from natural language") ; 
      // console.log(finalSegmentRules);
    }

    if (! finalSegmentRules || Object.keys(finalSegmentRules).length === 0) {
      // console.log("didnt find a valid db query ")
      return res.status(400).json({ error: 'Failed to parse natural language prompt. Please try again with a different description.' 
       });
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


//Launching the campaign for the audience segment with a personalized message 
exports.triggerCampaign = async (req , res) => {
  
  try {

    const {messageTemplate} = req.body ; 

    if (!messageTemplate || messageTemplate.trim() === '') {
      return res.status(400).json({ error: 'Message template is required.' });
    }


    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    campaign.messageTemplate = messageTemplate.trim() ; 
    await campaign.save();



    const customers = await Customer.find(campaign.segmentRules);

    const logs = customers.map(customer => {
      const message = generateMessage(campaign.messageTemplate, { name: customer.name });
      return {
        campaign: campaign._id,
        customer: customer._id,
        message,
        status: 'PENDING', // intially pending 
        deliveryTimestamp: new Date()
      };
    });

    await CommunicationLog.insertMany(logs);

    campaign.status = 'in-progress'; // Set status to in-progress
    campaign.startedAt = new Date();
    await campaign.save();


    res.status(200).json({
       campaign , 
       logsCreated: logs.length , 
       message: 'Campaign triggered. Delivery receipts will update status.' 
      });
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



exports.getAiMessageSuggestion = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    // Call AI service with campaign's segment rules
    const suggestion = await generateMessageSuggestion(campaign.segmentRules);

    res.status(200).json({ suggestedMessage: suggestion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate AI message suggestion.' });
  }
};

