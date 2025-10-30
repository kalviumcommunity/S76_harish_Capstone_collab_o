const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Message = require('../model/Message');
const ioService = require('../services/io');

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

// GET messages for a proposal
router.get('/:proposalId', async (req, res) => {
  try {
    const messages = await Message.find({ proposalId: req.params.proposalId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST text message (alternative to socket)
router.post('/:proposalId', async (req, res) => {
  try {
    const { senderId, senderName, message } = req.body;
    const msg = await Message.create({ proposalId: req.params.proposalId, senderId, senderName, message });

    // emit to room (everyone)
    const io = ioService.getIO();
    if (io) io.to(`proposal_${req.params.proposalId}`).emit('chatMessage', { message: msg.message, sender: { id: senderId, name: senderName }, createdAt: msg.createdAt, _id: msg._id, attachments: msg.attachments });

    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST file upload(s) and create message with attachments
router.post('/:proposalId/upload', (req, res) => {
  upload(req, res, async function(err) {
    if (err) return res.status(500).json({ error: err.message });

    try {
      const { senderId, senderName, message } = req.body;
  const files = (req.files || []).map(f => ({ filename: f.originalname, path: f.path, url: `/uploads/messages/${path.basename(f.path)}`, mimetype: f.mimetype, size: f.size }));

      const msg = await Message.create({
        proposalId: req.params.proposalId,
        senderId,
        senderName,
        message: message || '',
        attachments: files
      });

      const io = ioService.getIO();
  if (io) io.to(`proposal_${req.params.proposalId}`).emit('chatMessage', { message: msg.message, sender: { id: senderId, name: senderName }, createdAt: msg.createdAt, _id: msg._id, attachments: msg.attachments });

      res.status(201).json(msg);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
});

module.exports = router;
