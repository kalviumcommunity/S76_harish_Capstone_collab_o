const express = require('express');
const router = express.Router();
const {
  createProposal,
  getProposalsForProject,
  acceptProposal,
  getFreelancerProposals,
  uploadDeliverables,
  getDeliverables,
  downloadDeliverable,
  approveDeliverables,
  rejectDeliverables
} = require('../controller/ProposalController');

// POST: Create a new proposal
router.post('/', createProposal);

// GET: Get proposals for a project
router.get('/:projectId', getProposalsForProject);

// POST: Accept a proposal
router.post('/:id/accept', acceptProposal);

// GET: Get proposals for a freelancer
router.get('/freelancer/:freelancerId', getFreelancerProposals);

// POST: Upload deliverables for an accepted proposal
router.post('/:id/deliverables', uploadDeliverables);

// GET: Get deliverables for a specific proposal
router.get('/:id/deliverables', getDeliverables);

// GET: Download a specific deliverable file
router.get('/:id/deliverables/:fileId', downloadDeliverable);

// POST: Approve deliverables
router.post('/:id/deliverables/approve', approveDeliverables);

// POST: Reject deliverables
router.post('/:id/deliverables/reject', rejectDeliverables);

module.exports = router;