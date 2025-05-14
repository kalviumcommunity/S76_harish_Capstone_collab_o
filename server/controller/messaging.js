const express = require('express');
const router = express.Router();
const Conversation = require('../model/conversation');
const Message = require('../model/message');

// Create or Get Conversation
router.post('/conversation', async (req, res) => {
  const { clientId, freelancerId } = req.body;

  try {
    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [clientId, freelancerId] },
    });

    if (!conversation) {
      // Create a new conversation
      conversation = new Conversation({ participants: [clientId, freelancerId] });
      await conversation.save();
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Message
router.post('/message', async (req, res) => {
  const { conversationId, senderId, content } = req.body;

  try {
    const message = new Message({ conversationId, sender: senderId, content });
    await message.save();
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Messages for a Conversation
router.get('/messages/:conversationId', async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversationId }).populate('sender', 'username');
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;