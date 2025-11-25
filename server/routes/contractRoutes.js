const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/AuthMiddleWare');
const contractController = require('../controller/contractController');

// All routes require authentication
router.use(authenticate);

// Generate contract for accepted proposal
router.post('/generate/:proposalId', contractController.generateContractForProposal);

// Get contract by ID
router.get('/:contractId', contractController.getContract);

// Get contract by proposal ID
router.get('/proposal/:proposalId', contractController.getContractByProposal);

// Accept contract (client or freelancer)
router.post('/:contractId/accept', contractController.acceptContract);

// Complete a milestone
router.post('/:contractId/milestone/:milestoneIndex/complete', contractController.completeMilestone);

// Record payment for milestone
router.post('/:contractId/milestone/:milestoneIndex/pay', contractController.recordMilestonePayment);

module.exports = router;
