const Contract = require('../model/Contract');
const Proposal = require('../model/Proposal');
const Project = require('../model/ProjectSchema');
const User = require('../model/User');
const { generateContract } = require('../services/contractAIService');
const ioService = require('../services/io');
const emailService = require('../services/emailService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for deliverable uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/deliverables';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'deliverable-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: function (req, file, cb) {
    // Allow common file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip|rar|mp4|mov|avi/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: images, PDFs, documents, videos, archives'));
    }
  }
});

exports.uploadMiddleware = upload.array('deliverables', 10);

/**
 * Generate and create contract after proposal acceptance
 */
exports.generateContractForProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;
    
    console.log('[Contract] Generating contract for proposal:', proposalId);
    
    // Get proposal with populated data
    const proposal = await Proposal.findById(proposalId)
      .populate('projectId')
      .populate('freelancerId', 'username email');
    
    if (!proposal) {
      console.log('[Contract] Proposal not found:', proposalId);
      return res.status(404).json({ error: 'Proposal not found' });
    }
    
    console.log('[Contract] Proposal status:', proposal.status);
    
    if (proposal.status !== 'accepted') {
      return res.status(400).json({ 
        error: 'Proposal must be accepted before generating contract',
        currentStatus: proposal.status,
        hint: 'Please accept the proposal first from the proposals page'
      });
    }
    
    // Check if contract already exists
    const existingContract = await Contract.findOne({ proposalId });
    if (existingContract) {
      return res.status(400).json({ 
        error: 'Contract already exists for this proposal',
        contractId: existingContract._id 
      });
    }
    
    // Get client info
    const client = await User.findById(proposal.projectId.createdBy);
    
    // Prepare contract data
    const contractData = {
      projectTitle: proposal.projectId.title,
      projectDescription: proposal.projectId.description,
      clientName: client.username,
      freelancerName: proposal.freelancerId.username,
      paymentAmount: proposal.projectId.price,
      timeline: calculateTimeline(proposal.projectId.deadline),
      deliverables: extractDeliverables(proposal.message, proposal.projectId.description),
      requiredSkills: proposal.projectId.requiredSkills || []
    };
    
    // Generate contract using AI
    const aiContract = await generateContract(contractData);
    
    // Create contract in database
    const contract = new Contract({
      proposalId: proposal._id,
      projectId: proposal.projectId._id,
      clientId: client._id,
      freelancerId: proposal.freelancerId._id,
      contractText: aiContract.contractText,
      projectScope: aiContract.projectScope,
      deliverables: aiContract.deliverables,
      paymentAmount: proposal.projectId.price,
      paymentTerms: aiContract.paymentTerms,
      timeline: aiContract.timeline,
      revisions: aiContract.revisions,
      confidentialityClause: aiContract.confidentialityClause,
      intellectualPropertyClause: aiContract.intellectualPropertyClause,
      disputeResolutionClause: aiContract.disputeResolutionClause,
      status: 'pending',
      milestones: createMilestones(proposal.projectId.price, proposal.projectId.deadline)
    });
    
    await contract.save();
    
    // Notify both parties via socket
    const io = ioService.getIO();
    if (io) {
      io.to(`user_${client._id}`).emit('contractGenerated', { 
        contractId: contract._id,
        proposalId: proposal._id 
      });
      io.to(`user_${proposal.freelancerId._id}`).emit('contractGenerated', { 
        contractId: contract._id,
        proposalId: proposal._id 
      });
    }
    
    // Send email notifications
    emailService.sendContractGeneratedEmail(
      client.email,
      client.username,
      'client',
      project.title
    ).catch(err => console.error('Email error:', err));
    
    emailService.sendContractGeneratedEmail(
      proposal.freelancerId.email,
      proposal.freelancerId.username,
      'freelancer',
      project.title
    ).catch(err => console.error('Email error:', err));
    
    res.status(201).json({ 
      message: 'Contract generated successfully',
      contract 
    });
  } catch (error) {
    console.error('Error generating contract:', error);
    res.status(500).json({ error: error.message || 'Failed to generate contract' });
  }
};

/**
 * Get contract by ID
 */
exports.getContract = async (req, res) => {
  try {
    const { contractId } = req.params;
    
    const contract = await Contract.findById(contractId)
      .populate('projectId', 'title description')
      .populate('clientId', 'username email')
      .populate('freelancerId', 'username email')
      .populate('proposalId');
    
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    
    // Verify user has access
    const userId = req.user.id;
    if (contract.clientId._id.toString() !== userId && 
        contract.freelancerId._id.toString() !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(contract);
  } catch (error) {
    console.error('Error fetching contract:', error);
    res.status(500).json({ error: 'Failed to fetch contract' });
  }
};

/**
 * Get contract by proposal ID
 */
exports.getContractByProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;
    
    const contract = await Contract.findOne({ proposalId })
      .populate('projectId', 'title description')
      .populate('clientId', 'username email')
      .populate('freelancerId', 'username email');
    
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    
    // Verify user has access
    const userId = req.user.id;
    if (contract.clientId._id.toString() !== userId && 
        contract.freelancerId._id.toString() !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(contract);
  } catch (error) {
    console.error('Error fetching contract:', error);
    res.status(500).json({ error: 'Failed to fetch contract' });
  }
};

/**
 * Accept contract (client or freelancer)
 */
exports.acceptContract = async (req, res) => {
  try {
    const { contractId } = req.params;
    const { signature } = req.body;
    const userId = req.user.id;
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    const contract = await Contract.findById(contractId);
    
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    
    // Determine if user is client or freelancer
    const isClient = contract.clientId.toString() === userId;
    const isFreelancer = contract.freelancerId.toString() === userId;
    
    if (!isClient && !isFreelancer) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Update acceptance
    if (isClient) {
      if (contract.clientAccepted) {
        return res.status(400).json({ error: 'Client has already accepted' });
      }
      contract.clientAccepted = true;
      contract.clientAcceptedAt = new Date();
      contract.clientSignature = signature || 'Digital Signature';
      contract.clientIpAddress = ipAddress;
    } else {
      if (contract.freelancerAccepted) {
        return res.status(400).json({ error: 'Freelancer has already accepted' });
      }
      contract.freelancerAccepted = true;
      contract.freelancerAcceptedAt = new Date();
      contract.freelancerSignature = signature || 'Digital Signature';
      contract.freelancerIpAddress = ipAddress;
    }
    
    // Update status
    if (contract.clientAccepted && contract.freelancerAccepted) {
      contract.status = 'fully_signed';
      // Start first milestone
      if (contract.milestones.length > 0) {
        contract.milestones[0].status = 'in_progress';
      }
    } else {
      contract.status = 'partially_signed';
    }
    
    await contract.save();
    
    // Populate for email
    await contract.populate([
      { path: 'clientId', select: 'username email' },
      { path: 'freelancerId', select: 'username email' },
      { path: 'projectId', select: 'title' }
    ]);
    
    // Notify other party
    const io = ioService.getIO();
    if (io) {
      const notifyUserId = isClient ? contract.freelancerId : contract.clientId;
      io.to(`user_${notifyUserId}`).emit('contractSigned', { 
        contractId: contract._id,
        signedBy: isClient ? 'client' : 'freelancer',
        fullyExecuted: contract.status === 'fully_signed'
      });
    }
    
    // Send email to other party
    const otherParty = isClient ? contract.freelancerId : contract.clientId;
    const signer = isClient ? contract.clientId : contract.freelancerId;
    const fullyExecuted = contract.status === 'fully_signed';
    
    emailService.sendContractSignedEmail(
      otherParty.email,
      otherParty.username,
      signer.username,
      contract.projectId.title,
      fullyExecuted
    ).catch(err => console.error('Email error:', err));
    
    res.json({ 
      message: 'Contract accepted successfully',
      contract,
      fullyExecuted: contract.status === 'fully_signed'
    });
  } catch (error) {
    console.error('Error accepting contract:', error);
    res.status(500).json({ error: 'Failed to accept contract' });
  }
};

/**
 * Upload deliverables for a milestone
 */
exports.uploadDeliverables = async (req, res) => {
  try {
    const { contractId, milestoneIndex } = req.params;
    const { notes } = req.body;
    const userId = req.user.id;
    
    const contract = await Contract.findById(contractId);
    
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    
    // Only freelancer can upload deliverables
    if (contract.freelancerId.toString() !== userId) {
      return res.status(403).json({ error: 'Only freelancer can upload deliverables' });
    }
    
    if (!contract.milestones[milestoneIndex]) {
      return res.status(404).json({ error: 'Milestone not found' });
    }
    
    const milestone = contract.milestones[milestoneIndex];
    
    if (milestone.status === 'paid') {
      return res.status(400).json({ error: 'Cannot upload deliverables for paid milestone' });
    }
    
    // Process uploaded files
    const deliverables = req.files.map(file => ({
      filename: file.originalname,
      path: file.path,
      size: file.size,
      uploadedAt: new Date()
    }));
    
    if (!milestone.deliverables) {
      milestone.deliverables = [];
    }
    milestone.deliverables.push(...deliverables);
    
    if (notes) {
      if (!milestone.notes) {
        milestone.notes = [];
      }
      milestone.notes.push({
        text: notes,
        createdAt: new Date(),
        createdBy: userId
      });
    }
    
    await contract.save();
    
    // Populate for email
    await contract.populate([
      { path: 'clientId', select: 'username email' },
      { path: 'freelancerId', select: 'username email' },
      { path: 'projectId', select: 'title' }
    ]);
    
    // Notify client
    const io = ioService.getIO();
    if (io) {
      io.to(`user_${contract.clientId}`).emit('deliverablesUploaded', { 
        contractId: contract._id,
        milestoneIndex,
        deliverableCount: deliverables.length
      });
    }
    
    // Send email to client
    emailService.sendDeliverablesUploadedEmail(
      contract.clientId.email,
      contract.clientId.username,
      contract.freelancerId.username,
      contract.projectId.title,
      milestone.description,
      deliverables.length
    ).catch(err => console.error('Email error:', err));
    
    res.json({ 
      message: 'Deliverables uploaded successfully',
      deliverables,
      milestone: contract.milestones[milestoneIndex]
    });
  } catch (error) {
    console.error('Error uploading deliverables:', error);
    res.status(500).json({ error: 'Failed to upload deliverables' });
  }
};

/**
 * Complete a milestone
 */
exports.completeMilestone = async (req, res) => {
  try {
    const { contractId, milestoneIndex } = req.params;
    const userId = req.user.id;
    
    const contract = await Contract.findById(contractId);
    
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    
    // Only freelancer can mark milestone as complete
    if (contract.freelancerId.toString() !== userId) {
      return res.status(403).json({ error: 'Only freelancer can complete milestones' });
    }
    
    if (!contract.milestones[milestoneIndex]) {
      return res.status(404).json({ error: 'Milestone not found' });
    }
    
    const milestone = contract.milestones[milestoneIndex];
    
    // Check if deliverables are uploaded
    if (!milestone.deliverables || milestone.deliverables.length === 0) {
      return res.status(400).json({ error: 'Please upload deliverables before completing milestone' });
    }
    
    milestone.status = 'completed';
    milestone.completedAt = new Date();
    
    await contract.save();
    
    // Populate for email
    await contract.populate([
      { path: 'clientId', select: 'username email' },
      { path: 'freelancerId', select: 'username email' },
      { path: 'projectId', select: 'title' }
    ]);
    
    // Notify client
    const io = ioService.getIO();
    if (io) {
      io.to(`user_${contract.clientId}`).emit('milestoneCompleted', { 
        contractId: contract._id,
        milestoneIndex,
        milestone: contract.milestones[milestoneIndex]
      });
    }
    
    // Send email to client
    emailService.sendMilestoneCompletedEmail(
      contract.clientId.email,
      contract.clientId.username,
      contract.freelancerId.username,
      contract.projectId.title,
      milestone.description,
      milestone.amount
    ).catch(err => console.error('Email error:', err));
    
    res.json({ 
      message: 'Milestone marked as completed',
      milestone: contract.milestones[milestoneIndex]
    });
  } catch (error) {
    console.error('Error completing milestone:', error);
    res.status(500).json({ error: 'Failed to complete milestone' });
  }
};

/**
 * Record payment for milestone
 */
exports.recordMilestonePayment = async (req, res) => {
  try {
    const { contractId, milestoneIndex } = req.params;
    const { paymentId, paypalOrderId, paypalPayerId } = req.body;
    const userId = req.user.id;
    
    const contract = await Contract.findById(contractId);
    
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    
    // Only client can record payment
    if (contract.clientId.toString() !== userId) {
      return res.status(403).json({ error: 'Only client can record payments' });
    }
    
    if (!contract.milestones[milestoneIndex]) {
      return res.status(404).json({ error: 'Milestone not found' });
    }
    
    const milestone = contract.milestones[milestoneIndex];
    
    if (milestone.status !== 'completed') {
      return res.status(400).json({ error: 'Milestone must be completed before payment' });
    }
    
    milestone.status = 'paid';
    milestone.paidAt = new Date();
    milestone.paymentId = paymentId;
    
    contract.totalPaid += milestone.amount;
    contract.paypalOrderId = paypalOrderId;
    contract.paypalPayerId = paypalPayerId;
    
    // Check if all milestones are paid
    const allPaid = contract.milestones.every(m => m.status === 'paid');
    if (allPaid) {
      contract.status = 'completed';
    }
    
    await contract.save();
    
    // Populate for email
    await contract.populate([
      { path: 'clientId', select: 'username email' },
      { path: 'freelancerId', select: 'username email' },
      { path: 'projectId', select: 'title' }
    ]);
    
    // Notify freelancer
    const io = ioService.getIO();
    if (io) {
      io.to(`user_${contract.freelancerId}`).emit('paymentReceived', { 
        contractId: contract._id,
        milestoneIndex,
        amount: milestone.amount,
        totalPaid: contract.totalPaid
      });
    }
    
    // Send email to freelancer
    emailService.sendPaymentReceivedEmail(
      contract.freelancerId.email,
      contract.freelancerId.username,
      contract.clientId.username,
      contract.projectId.title,
      milestone.amount,
      contract.totalPaid,
      contract.paymentAmount
    ).catch(err => console.error('Email error:', err));
    
    // Send completion email if all milestones paid
    if (allPaid) {
      emailService.sendProjectCompletedEmail(
        contract.clientId.email,
        contract.clientId.username,
        contract.projectId.title,
        contract.paymentAmount
      ).catch(err => console.error('Email error:', err));
      
      emailService.sendProjectCompletedEmail(
        contract.freelancerId.email,
        contract.freelancerId.username,
        contract.projectId.title,
        contract.paymentAmount
      ).catch(err => console.error('Email error:', err));
    }
    
    res.json({ 
      message: 'Payment recorded successfully',
      contract,
      completed: allPaid
    });
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({ error: 'Failed to record payment' });
  }
};

/**
 * Dispute and request refund for a milestone
 */
exports.disputeMilestone = async (req, res) => {
  try {
    const { contractId, milestoneIndex } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;
    
    const contract = await Contract.findById(contractId);
    
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    
    // Only client can dispute
    if (contract.clientId.toString() !== userId) {
      return res.status(403).json({ error: 'Only client can dispute milestones' });
    }
    
    if (!contract.milestones[milestoneIndex]) {
      return res.status(404).json({ error: 'Milestone not found' });
    }
    
    const milestone = contract.milestones[milestoneIndex];
    
    if (milestone.status !== 'paid') {
      return res.status(400).json({ error: 'Can only dispute paid milestones' });
    }
    
    // Mark milestone as disputed
    milestone.disputed = true;
    milestone.disputeReason = reason;
    milestone.disputedAt = new Date();
    
    await contract.save();
    
    // Notify freelancer
    const io = ioService.getIO();
    if (io) {
      io.to(`user_${contract.freelancerId}`).emit('milestoneDisputed', { 
        contractId: contract._id,
        milestoneIndex,
        reason
      });
    }
    
    res.json({ 
      message: 'Dispute filed successfully. Admin will review.',
      milestone: contract.milestones[milestoneIndex]
    });
  } catch (error) {
    console.error('Error disputing milestone:', error);
    res.status(500).json({ error: 'Failed to file dispute' });
  }
};

// Helper functions
function calculateTimeline(deadline) {
  const now = new Date();
  const end = new Date(deadline);
  const days = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return `${days} days`;
}

function extractDeliverables(proposalMessage, projectDescription) {
  // Simple extraction - can be enhanced with AI
  const deliverables = [];
  const text = `${proposalMessage} ${projectDescription}`;
  
  // Look for numbered lists or bullet points
  const lines = text.split('\n');
  lines.forEach(line => {
    if (line.match(/^[\d\-\*•]\s*\.?\s*/)) {
      const clean = line.replace(/^[\d\-\*•]\s*\.?\s*/, '').trim();
      if (clean.length > 10 && clean.length < 200) {
        deliverables.push(clean);
      }
    }
  });
  
  // Fallback if no deliverables found
  if (deliverables.length === 0) {
    deliverables.push('Complete project as per requirements');
    deliverables.push('Source code and documentation');
    deliverables.push('Deployment and handover');
  }
  
  return deliverables.slice(0, 5); // Max 5 deliverables
}

function createMilestones(totalAmount, deadline) {
  const milestoneCount = totalAmount > 1000 ? 3 : 2;
  const milestones = [];
  const amountPerMilestone = totalAmount / milestoneCount;
  const now = new Date();
  const end = new Date(deadline);
  const totalDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  const daysPerMilestone = Math.floor(totalDays / milestoneCount);
  
  for (let i = 0; i < milestoneCount; i++) {
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + (daysPerMilestone * (i + 1)));
    
    milestones.push({
      description: i === 0 ? 'Initial work and setup' : 
                   i === milestoneCount - 1 ? 'Final delivery and completion' :
                   `Milestone ${i + 1}`,
      amount: Math.round(amountPerMilestone * 100) / 100,
      dueDate: dueDate,
      status: 'pending'
    });
  }
  
  return milestones;
}

module.exports = exports;
