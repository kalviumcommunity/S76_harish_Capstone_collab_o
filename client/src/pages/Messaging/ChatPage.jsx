import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
// import { buildApiUrl } from '../../config/api';
import { FiSend, FiArrowLeft } from 'react-icons/fi';

const ChatPage = () => {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [connected, setConnected] = useState(false);
  const messagesRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const username = localStorage.getItem('username') || 'Anonymous';
  const userId = localStorage.getItem('userId');
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!proposalId) return;

    // fetch message history
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/messages/${proposalId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data || []);
        }
      } catch (e) {
        console.error('Failed to load messages', e);
      }
    })();

    // connect socket
    const s = io(API_BASE, {
      transports: ['websocket'],
      withCredentials: true,
    });

    setSocket(s);

    s.on('connect', () => {
      setConnected(true);
      // join proposal room and personal user room
      const room = `proposal_${proposalId}`;
      s.emit('joinRoom', { room });
      if (userId) s.emit('joinRoom', { room: `user_${userId}` });
    });

    s.on('chatMessage', (payload) => {
      setMessages((m) => [...m, payload]);
    });

    s.on('proposalAccepted', () => {
      // show system notice
      setMessages((m) => [...m, { sender: 'system', message: 'Proposal was accepted', createdAt: new Date() }]);
    });

    s.on('disconnect', () => setConnected(false));

    return () => {
      if (s) {
        const room = `proposal_${proposalId}`;
        s.emit('leaveRoom', { room });
        if (userId) s.emit('leaveRoom', { room: `user_${userId}` });
        s.disconnect();
      }
    };
  }, [proposalId, API_BASE, userId]);

  useEffect(() => {
    // scroll to bottom
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !socket) return;
    const room = `proposal_${proposalId}`;
    const payload = { room, message: text.trim(), sender: { id: userId, name: username } };
    socket.emit('chatMessage', payload);
    // append locally (server will broadcast to others)
    setMessages((m) => [...m, { message: payload.message, sender: payload.sender, createdAt: new Date() }]);
    setText('');
  };

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const fd = new FormData();
      for (let i = 0; i < files.length; i++) fd.append('files', files[i]);
      fd.append('senderId', userId || '');
      fd.append('senderName', username || '');

      const res = await fetch(`${API_BASE}/api/messages/${proposalId}/upload`, { method: 'POST', body: fd });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Upload failed');
      }
      // server will emit the created message to the room (including sender)
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-md hover:bg-gray-100">
              <FiArrowLeft />
            </button>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Project Chat</h3>
              <p className="text-sm text-gray-500">Chat for proposal ID: {proposalId}</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">{connected ? 'Online' : 'Offline'}</div>
        </div>

        <div className="p-4 h-[60vh] overflow-auto" ref={messagesRef}>
          <div className="space-y-4">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender && m.sender.id === userId ? 'justify-end' : 'justify-start'}`}>
                <div className={`${m.sender && m.sender.id === userId ? 'bg-[#FC427B] text-white' : 'bg-gray-100 text-gray-800'} px-4 py-2 rounded-lg max-w-[70%]` }>
                  <div className="text-xs text-gray-500 mb-1">
                    {m.sender && m.sender.name ? m.sender.name : (m.sender === 'system' ? 'System' : 'Unknown')}
                  </div>
                  <div className="leading-relaxed">{m.message}</div>
                  <div className="text-xs text-gray-400 mt-1 text-right">{new Date(m.createdAt).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSend} className="flex items-center gap-3 p-4 border-t">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#FC427B]"
          />
          <div className="flex items-center gap-2">
            <label className={`px-3 py-2 border rounded-lg cursor-pointer ${uploading ? 'opacity-60' : ''}`}>
              <input type="file" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} disabled={uploading} />
              {uploading ? 'Uploading...' : 'Attach'}
            </label>
            <button type="submit" className="px-4 py-2 bg-[#FC427B] text-white rounded-lg flex items-center gap-2">
              <FiSend /> Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
