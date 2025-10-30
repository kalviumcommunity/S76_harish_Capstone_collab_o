const Proposal = require('../model/Proposal');
const ioService = require('../services/io');
const Project = require('../model/ProjectSchema');
// const Project = require('../model/Project');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up storage for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = path.join(__dirname, '../uploads/deliverables');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
}).array('files', 10); // Allow up to 10 files

// Create a new proposal
exports.createProposal = async (req, res) => {
  try {
    const proposal = await Proposal.create(req.body);
    res.status(201).json(proposal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all proposals for a specific project
exports.getProposalsForProject = async (req, res) => {
  try {
    const proposals = await Proposal.find({ projectId: req.params.projectId })
      .populate('freelancerId', 'name email') 
      .populate('projectId', 'title');        
    res.status(200).json(proposals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Accept a specific proposal
exports.acceptProposal = async (req, res) => {
  try {
    // Update proposal status to accepted
    const proposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      { status: 'accepted' },
      { new: true }
    ).populate('freelancerId').populate({ path: 'projectId', populate: { path: 'createdBy' } });

    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    // Emit socket event to notify participants and create a room for the proposal
    try {
      const io = ioService.getIO();
      const room = `proposal_${proposal._id}`;

      // Emit to room (if clients joined), and also to users' personal rooms
      if (io) {
        io.to(room).emit('proposalAccepted', { proposal });
        if (proposal.freelancerId && proposal.freelancerId._id) {
          io.to(`user_${proposal.freelancerId._id}`).emit('proposalAccepted', { proposal });
        }
        if (proposal.projectId && proposal.projectId.createdBy && proposal.projectId.createdBy._id) {
          io.to(`user_${proposal.projectId.createdBy._id}`).emit('proposalAccepted', { proposal });
        }
      }
    } catch (emitErr) {
      console.error('Failed to emit socket event for accepted proposal', emitErr);
    }

    res.status(200).json(proposal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all proposals for a freelancer
exports.getFreelancerProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ freelancerId: req.params.freelancerId })
      .populate('projectId');
    
    res.status(200).json(proposals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upload deliverables for an accepted proposal
exports.uploadDeliverables = (req, res) => {
  upload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    try {
      // Check if the proposal exists and is accepted
      const proposal = await Proposal.findById(req.params.id);
      
      if (!proposal) {
        return res.status(404).json({ error: 'Proposal not found' });
      }
      
      if (proposal.status !== 'accepted') {
        return res.status(400).json({ error: 'Can only upload deliverables for accepted proposals' });
      }
      
      // No file uploaded
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }
      
      // Process uploaded files
      const fileDetails = req.files.map(file => ({
        filename: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size
      }));
      
      // Update the proposal with the uploaded files and message
      const updatedProposal = await Proposal.findByIdAndUpdate(
        req.params.id,
        {
          deliverables: fileDetails,
          deliveryMessage: req.body.message || '',
          deliveryStatus: 'submitted'
        },
        { new: true }
      );
      
      res.status(200).json(updatedProposal);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

// Get deliverables for a specific proposal



exports.getDeliverables = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    
    res.status(200).json({
      deliverables: proposal.deliverables || [],
      deliveryMessage: proposal.deliveryMessage || '',
      deliveryStatus: proposal.deliveryStatus || 'not_submitted'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Download a specific deliverable file
exports.downloadDeliverable = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    
    const deliverable = proposal.deliverables.find(d => d._id.toString() === req.params.fileId);
    
    if (!deliverable) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    res.download(deliverable.path, deliverable.filename);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve deliverables
exports.approveDeliverables = async (req, res) => {
  try {
    const proposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      { deliveryStatus: 'approved' },
      { new: true }
    );
    
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    
    res.status(200).json({
      message: 'Deliverables approved successfully',
      deliveryStatus: proposal.deliveryStatus
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reject deliverables
exports.rejectDeliverables = async (req, res) => {
  try {
    const proposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      { deliveryStatus: 'rejected' },
      { new: true }
    );
    
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    
    res.status(200).json({
      message: 'Deliverables rejected',
      deliveryStatus: proposal.deliveryStatus
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};