const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Message = require('../model/Message');
const ioService = require('../services/io');
const authenticate = require('../middleware/AuthMiddleWare');
const { verifyProposalParticipant } = require('../services/proposalAccess');

// storage for message attachments
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = path.join(__dirname, '../uploads/messages');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage }).array('files', 5);

const normalizeMessage = (msg) => ({
  _id: msg._id,
  proposalId: msg.proposalId,
  message: msg.message,
  sender: {
    id: msg.senderId ? msg.senderId.toString() : null,
    name: msg.senderName || 'Unknown'
  },
  attachments: (msg.attachments || []).map((file) => ({
    filename: file.filename,
    path: file.path,
    url: file.url || (file.path ? `/uploads/messages/${path.basename(file.path)}` : null),
    mimetype: file.mimetype,
    size: file.size,
    uploadedAt: file.uploadedAt
  })),
  createdAt: msg.createdAt,
  updatedAt: msg.updatedAt
});

const ensureProposalParticipant = async (req, res, next) => {
  try {
    const { proposalId } = req.params;
    const result = await verifyProposalParticipant(proposalId, req.user.id);
    if (!result.allowed) {
      return res.status(result.status || 403).json({ message: result.error || 'Access denied' });
    }
    req.proposal = result.proposal;
    req.participantRole = result.role;
    next();
  } catch (error) {
    console.error('Proposal access verification failed', error);
    res.status(500).json({ message: 'Failed to verify conversation access.' });
  }
};

router.use(authenticate);

// GET messages for a proposal
router.get('/:proposalId', ensureProposalParticipant, async (req, res) => {
  try {
    const messages = await Message.find({ proposalId: req.params.proposalId }).sort({ createdAt: 1 });
    res.status(200).json(messages.map(normalizeMessage));
  } catch (err) {
    console.error('Failed to load messages', err);
    res.status(500).json({ error: err.message });
  }
});

// POST text message (alternative to socket)
router.post('/:proposalId', ensureProposalParticipant, async (req, res) => {
  try {
    const text = (req.body.message || '').trim();
    if (!text) {
      return res.status(400).json({ message: 'Message text is required.' });
    }

    const msg = await Message.create({
      proposalId: req.params.proposalId,
      senderId: req.user.id,
      senderName: req.user.username || req.user.email,
      message: text,
    });

    const normalized = normalizeMessage(msg);

    // emit to room (everyone)
    const io = ioService.getIO();
    if (io) {
      io.to(`proposal_${req.params.proposalId}`).emit('chatMessage', normalized);
    }

    res.status(201).json(normalized);
  } catch (err) {
    console.error('Failed to send message', err);
    res.status(500).json({ error: err.message });
  }
});

// POST file upload(s) and create message with attachments
router.post('/:proposalId/upload', ensureProposalParticipant, (req, res) => {
  upload(req, res, async function(err) {
    if (err) return res.status(500).json({ error: err.message });

    try {
      const files = (req.files || []).map(f => ({
        filename: f.originalname,
        path: f.path,
        url: `/uploads/messages/${path.basename(f.path)}`,
        mimetype: f.mimetype,
        size: f.size
      }));

      if (files.length === 0 && !(req.body.message || '').trim()) {
        return res.status(400).json({ message: 'No files or message content provided.' });
      }

      const msg = await Message.create({
        proposalId: req.params.proposalId,
        senderId: req.user.id,
        senderName: req.user.username || req.user.email,
        message: (req.body.message || '').trim(),
        attachments: files
      });

      const normalized = normalizeMessage(msg);
      const io = ioService.getIO();
      if (io) {
        io.to(`proposal_${req.params.proposalId}`).emit('chatMessage', normalized);
      }

      res.status(201).json(normalized);
    } catch (e) {
      console.error('Failed to upload attachment', e);
      res.status(500).json({ error: e.message });
    }
  });
});

module.exports = router;
