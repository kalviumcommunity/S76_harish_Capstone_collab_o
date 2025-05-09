import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';

const MessagePanel = ({ proposal, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  
  // Get userId and token from localStorage
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000); // Poll for new messages
    return () => clearInterval(interval);
  }, [proposal]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    setLoading(true);
    
    // For demo purposes, use mock data
    // In production, fetch from API
    setTimeout(() => {
      const mockMessages = [
        {
          _id: 'msg1',
          content: 'Hi, I wanted to discuss the project timeline.',
          senderId: 'freelancer1',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          _id: 'msg2',
          content: 'Sure, I was thinking we could start next week. What do you think?',
          senderId: userId,
          createdAt: new Date(Date.now() - 3500000).toISOString(),
        },
        {
          _id: 'msg3',
          content: 'That works for me. I will prepare the initial designs by Wednesday.',
          senderId: 'freelancer1',
          createdAt: new Date(Date.now() - 3400000).toISOString(),
        },
      ];
      
      setMessages(mockMessages);
      setLoading(false);
    }, 1000);

    // In production, use API call instead
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    // For demo purposes
    const newMsg = {
      _id: `msg${messages.length + 1}`,
      content: newMessage,
      senderId: userId,
      createdAt: new Date().toISOString(),
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');

    // In production, use API call
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const recipient = proposal?.freelancer || {
    name: 'Freelancer',
    title: 'Professional',
    avatar: 'https://via.placeholder.com/40'
  };

  return (
    <div className="bg-[#2a2a2a] rounded-lg h-[600px] flex flex-col border border-[#3a3a3a] shadow-lg">
      {/* Header */}
      <div className="p-3 border-b border-[#3a3a3a] flex justify-between items-center bg-[#222222]">
        <div className="flex items-center gap-2">
          <img
            src={recipient.avatar || 'https://via.placeholder.com/40'}
            alt={recipient.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <h3 className="text-white font-medium text-sm">{recipient.name}</h3>
            <p className="text-gray-400 text-xs">{recipient.title}</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#222222]">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin h-6 w-6 border-2 border-[#AB00EA] rounded-full border-t-transparent"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    message.senderId === userId 
                      ? 'bg-[#AB00EA] text-white' 
                      : 'bg-[#333333] text-white border border-[#3a3a3a]'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Message input */}
      <form onSubmit={sendMessage} className="p-3 border-t border-[#3a3a3a] flex gap-2 bg-[#222222]">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-[#333333] rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#AB00EA] border border-[#3a3a3a]"
        />
        <button
          type="submit"
          className="bg-[#AB00EA] hover:bg-[#9500ca] text-white p-2 rounded-md"
          disabled={!newMessage.trim()}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default MessagePanel;