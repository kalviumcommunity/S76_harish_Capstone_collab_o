const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const auth = require('../middleware/auth');

// Get messages for a conversation
router.get('/:conversationId/messages', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    // Verify the user is a participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    const isParticipant = conversation.participants.some(
      (participantId) => participantId.toString() === req.user.id
    );
    
    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to access this conversation' });
    }
    
    // Fetch messages
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .limit(100); // Limit to prevent loading too many messages
      
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;