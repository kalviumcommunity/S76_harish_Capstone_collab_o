const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/AuthMiddleWare');
const contractController = require('../controller/contractController');
const path = require('path');
const fs = require('fs');

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

// Upload deliverables for a milestone
router.post('/:contractId/milestone/:milestoneIndex/deliverables', 
  contractController.uploadMiddleware, 
  contractController.uploadDeliverables
);

// Complete a milestone
router.post('/:contractId/milestone/:milestoneIndex/complete', contractController.completeMilestone);

// Record payment for milestone
router.post('/:contractId/milestone/:milestoneIndex/pay', contractController.recordMilestonePayment);

// Dispute a milestone (request refund)
router.post('/:contractId/milestone/:milestoneIndex/dispute', contractController.disputeMilestone);

// Download deliverable file
router.get('/:contractId/milestone/:milestoneIndex/deliverable/:fileIndex', async (req, res) => {
  try {
    const { contractId, milestoneIndex, fileIndex } = req.params;
    const Contract = require('../model/Contract');
    
    const contract = await Contract.findById(contractId);
    
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    
    // Verify user has access
    const userId = req.user.id;
    if (contract.clientId.toString() !== userId && contract.freelancerId.toString() !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const milestone = contract.milestones[milestoneIndex];
    if (!milestone || !milestone.deliverables[fileIndex]) {
      return res.status(404).json({ error: 'Deliverable not found' });
    }
    
    const deliverable = milestone.deliverables[fileIndex];
    const filePath = path.join(__dirname, '..', deliverable.path);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }
    
    res.download(filePath, deliverable.filename);
  } catch (error) {
    console.error('Error downloading deliverable:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

module.exports = router;
