import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const MessagesPage = () => {
  const { conversationId } = useParams(); // Get conversation ID from the URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const token = localStorage.getItem('token'); // Assume token is stored in localStorage
  const userId = localStorage.getItem('userId'); // Assume userId is stored in localStorage

  // Fetch messages when the component is mounted
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/messaging/messages/${conversationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          console.error('Failed to fetch messages');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [conversationId, token]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      conversationId,
      senderId: userId,
      content: newMessage.trim(),
    };

    try {
      const response = await fetch('http://localhost:5000/api/messaging/message', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        const newMessageFromServer = await response.json();
        setMessages((prevMessages) => [...prevMessages, newMessageFromServer]);
        setNewMessage('');
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Messages</h2>
      <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px', border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
        {messages.map((message) => (
          <div key={message._id} style={{ marginBottom: '10px' }}>
            <strong>{message.sender.username === userId ? 'You' : message.sender.username}</strong>: {message.content}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessagesPage;