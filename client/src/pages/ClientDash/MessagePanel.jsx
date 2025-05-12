import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000'; // Backend URL

const MessagePage = () => {
  const { proposalId } = useParams();
  const [socket, setSocket] = useState(null); // Socket.IO instance
  const [messages, setMessages] = useState([]); // Stores all messages
  const [newMessage, setNewMessage] = useState(''); // Stores the new message input

  useEffect(() => {
    // Connect to Socket.IO server
    const socketInstance = io(SOCKET_SERVER_URL);
    setSocket(socketInstance);

    // Join the specific room for the proposal
    socketInstance.emit('joinRoom', { roomId: proposalId });
    console.log(`Joined room: ${proposalId}`);

    // Listen for incoming messages
    socketInstance.on('message', (message) => {
      console.log('New message received:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on component unmount
    return () => {
      socketInstance.disconnect();
      console.log('Disconnected from Socket.IO server');
    };
  }, [proposalId]);

  const sendMessage = () => {
    if (newMessage.trim() === '') {
      console.log('Empty message, not sending');
      return;
    }

    // Emit the message to the backend
    socket.emit('message', { roomId: proposalId, message: newMessage });
    console.log(`Message sent to room ${proposalId}: ${newMessage}`);

    // Clear the input field
    setNewMessage('');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl text-white font-bold mb-6">Messages</h1>

      {/* Messages Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6 h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-gray-400">No messages yet. Start the conversation!</p>
        ) : (
          <ul className="space-y-4">
            {messages.map((msg, index) => (
              <li
                key={index}
                className={`p-4 rounded-md ${
                  msg.isSender ? 'bg-purple-600 text-white self-end' : 'bg-gray-700 text-gray-200 self-start'
                }`}
              >
                <p>{msg.message}</p>
                <small className="text-gray-400 text-sm">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Message Input */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessagePage;