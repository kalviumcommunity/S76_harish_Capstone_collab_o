const express = require('express');
const router = express.Router();
const {
  createProposal,
  getProposalsForProject,
  acceptProposal
} = require('../controller/ProposalController');

// POST: Create a new proposal
router.post('/', createProposal);
router.get('/:projectId', getProposalsForProject);
router.post('/:id/accept', acceptProposal);


module.exports = router;
