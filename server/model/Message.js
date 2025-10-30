const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  filename: String,
  path: String,
  mimetype: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now }
});

const MessageSchema = new mongoose.Schema({
  proposalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  senderName: { type: String },
  message: { type: String },
  attachments: [attachmentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
