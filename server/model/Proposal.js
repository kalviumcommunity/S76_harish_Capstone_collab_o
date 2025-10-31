const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  deliverables: [{
    filename: { type: String },
    path: { type: String },
    mimetype: { type: String },
    size: { type: Number },
    uploadedAt: { type: Date, default: Date.now }
  }],
  deliveryMessage: { type: String },
  deliveryStatus: { type: String, enum: ['not_submitted', 'submitted', 'approved', 'rejected'], default: 'not_submitted' }
  ,
  // Payment fields
  paymentStatus: { type: String, enum: ['unpaid', 'pending', 'paid'], default: 'unpaid' },
  paymentIntentId: { type: String },
  amountPaid: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Proposal', proposalSchema);