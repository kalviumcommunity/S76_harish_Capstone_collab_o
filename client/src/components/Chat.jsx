import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Adjust path as needed
import socket from '../socket'; // You'll need to create this file

const Chat = ({ conversationId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (conversationId) {
      // Join the conversation room
      socket.emit('joinRoom', { conversationId });
      
      // Fetch previous messages
      fetchMessages();
    }

    // Listen for new messages
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Listen for errors
    socket.on('errorMessage', (errorMsg) => {
      setError(errorMsg);
      setTimeout(() => setError(''), 5000); // Clear error after 5 seconds
    });

    return () => {
      // Clean up listeners when component unmounts
      socket.off('receiveMessage');
      socket.off('errorMessage');
      if (conversationId) {
        socket.emit('leaveRoom', { conversationId });
      }
    };
  }, [conversationId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socket.emit('sendMessage', {
      conversationId,
      senderId: currentUser._id,
      text: newMessage,
    });

    setNewMessage('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="px-4 py-3 bg-gray-100 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">Project Chat</h3>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mx-4 my-2 px-3 py-2 bg-red-100 text-red-800 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {/* Messages container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((message) => (
          <div 
            key={message._id} 
            className={`flex ${message.senderId === currentUser._id ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${
                message.senderId === currentUser._id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <div>{message.text}</div>
              <div className={`text-xs mt-1 ${
                message.senderId === currentUser._id 
                  ? 'text-blue-100' 
                  : 'text-gray-500'
              }`}>
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;