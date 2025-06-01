const express = require('express');
const router = express.Router();
const {  createSegment, triggerCampaign, getAllCampaigns, getCampaignById,
     getCampaignSummary, getCampaignLogs  , getAiMessageSuggestion} = require('../controllers/campaignController');




const { body, validationResult } = require('express-validator');
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



router.post('/segment', createSegment); // Define audience rules
router.post('/trigger/:id', triggerCampaign); // Start campaign
router.get('/', getAllCampaigns); // List all campaigns
router.get('/:id', getCampaignById); // Campaign details
router.get('/summary/:id', getCampaignSummary); // AI-powered insight
router.get('/logs/:id', getCampaignLogs); // Delivery logs (optional)
router.get('/ai-message-suggestion/:id', getAiMessageSuggestion);


module.exports = router;
