const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  proposalId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Proposal', 
    required: true 
  },
  projectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
  },
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  freelancerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Contract content
  contractText: { 
    type: String, 
    required: true 
  },
  
  // Contract terms
  projectScope: { type: String, required: true },
  deliverables: [{ type: String }],
  paymentAmount: { type: Number, required: true },
  paymentTerms: { type: String, required: true },
  timeline: { type: String, required: true },
  revisions: { type: String, default: '2 revisions included' },
  
  // Acceptance status
  clientAccepted: { type: Boolean, default: false },
  clientAcceptedAt: { type: Date },
  clientSignature: { type: String },
  clientIpAddress: { type: String },
  
  freelancerAccepted: { type: Boolean, default: false },
  freelancerAcceptedAt: { type: Date },
  freelancerSignature: { type: String },
  freelancerIpAddress: { type: String },
  
  // Contract status
  status: { 
    type: String, 
    enum: ['pending', 'partially_signed', 'fully_signed', 'in_progress', 'completed', 'terminated'], 
    default: 'pending' 
  },
  
  // Milestones
  milestones: [{
    description: String,
    amount: Number,
    dueDate: Date,
    status: { type: String, enum: ['pending', 'in_progress', 'completed', 'paid'], default: 'pending' },
    completedAt: Date,
    paidAt: Date,
    paymentId: String
  }],
  
  // Payment tracking
  totalPaid: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ['paypal', 'razorpay'], default: 'paypal' },
  paypalOrderId: { type: String },
  paypalPayerId: { type: String },
  
  // Termination
  terminatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  terminationReason: { type: String },
  terminatedAt: { type: Date },
  
  // Additional terms
  confidentialityClause: { type: String },
  intellectualPropertyClause: { type: String },
  disputeResolutionClause: { type: String }
  
}, { timestamps: true });

// Index for quick lookups
contractSchema.index({ proposalId: 1 });
contractSchema.index({ projectId: 1 });
contractSchema.index({ clientId: 1, freelancerId: 1 });

module.exports = mongoose.model('Contract', contractSchema);
