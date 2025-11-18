const express = require('express');
const router = express.Router();
const { generateProposal, enhanceProposalSection } = require('../controller/aiProposalController');
const authenticate = require('../middleware/AuthMiddleWare');

// Generate or improve a complete proposal
router.post('/generate', authenticate, generateProposal);

// Enhance a specific section of the proposal
router.post('/enhance-section', authenticate, enhanceProposalSection);

module.exports = router;
