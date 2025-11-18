import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { API_BASE_URL, buildApiUrl } from '../../config/api';
import { FiSend, FiArrowLeft, FiFile, FiDownload } from 'react-icons/fi';

const ChatPage = () => {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [connected, setConnected] = useState(false);
  const messagesRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const API_BASE = API_BASE_URL;

  useEffect(() => {
    if (!proposalId) return;

    if (!token) {
      console.error('Missing authentication token. Redirecting to login.');
      navigate('/login');
      return;
    }

    // fetch message history
    (async () => {
      try {
        const res = await fetch(buildApiUrl(`/api/messages/${proposalId}`), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data || []);
        } else {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Failed to load messages');
        }
      } catch (e) {
        console.error('Failed to load messages', e);
      }
    })();

    // connect socket
    const s = io(API_BASE, {
      transports: ['websocket'],
      withCredentials: true,
      auth: { token },
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

    s.on('chatError', (payload) => {
      console.error(payload?.message || 'Chat error');
    });

    s.on('connect_error', (err) => {
      console.error('Socket connection failed', err?.message || err);
      setConnected(false);
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
  }, [proposalId, API_BASE, userId, token, navigate]);

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
    const payload = { room, message: text.trim() };
    socket.emit('chatMessage', payload);
    setText('');
  };

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const fd = new FormData();
      for (let i = 0; i < files.length; i++) fd.append('files', files[i]);

      const res = await fetch(buildApiUrl(`/api/messages/${proposalId}/upload`), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd
      });
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Header with glassmorphism effect */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-white to-gray-50 backdrop-blur-sm">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Go back"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">Project Chat</h3>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">Proposal #{proposalId.slice(-8)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className={`text-xs sm:text-sm font-medium ${connected ? 'text-green-600' : 'text-gray-500'}`}>
              {connected ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Messages Container with smooth scrolling */}
        <div className="p-4 sm:p-6 h-[60vh] overflow-y-auto bg-gray-50 scroll-smooth" ref={messagesRef}>
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm font-medium">No messages yet</p>
                <p className="text-xs mt-1">Start the conversation!</p>
              </div>
            ) : (
              messages.map((m, idx) => {
                const isOwn = m.sender && m.sender.id === userId;
                const isSystem = m.sender === 'system';

                if (isSystem) {
                  return (
                    <div key={idx} className="flex justify-center my-4">
                      <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-medium">
                        {m.message}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                    <div className={`group flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[80%] sm:max-w-[70%]`}>
                      <div className="text-xs font-medium text-gray-500 mb-1 px-1">
                        {m.sender && m.sender.name ? m.sender.name : 'Unknown'}
                      </div>
                      <div className={`relative px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 ${
                        isOwn
                          ? 'bg-gradient-to-br from-[#FC427B] to-[#e03a6d] text-white rounded-tr-sm'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm'
                      }`}>
                        {m.message && (
                          <div className="text-sm leading-relaxed break-words">{m.message}</div>
                        )}
                        {m.attachments && m.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {m.attachments.map((file, fileIdx) => {
                              const isImage = file?.mimetype?.startsWith('image/');
                              const relativeUrl = file?.url || file?.path || '';
                              const fileUrl = relativeUrl.startsWith('http')
                                ? relativeUrl
                                : `${API_BASE}${relativeUrl}`;

                              if (isImage) {
                                return (
                                  <div key={fileIdx} className="rounded-xl overflow-hidden border border-white/20">
                                    <img
                                      src={fileUrl}
                                      alt={file?.filename || 'attachment'}
                                      className="max-h-64 w-full object-cover"
                                      loading="lazy"
                                    />
                                  </div>
                                );
                              }

                              return (
                                <a
                                  key={fileIdx}
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition ${
                                    isOwn ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                  }`}
                                >
                                  <FiFile className="text-current" />
                                  <span className="truncate max-w-[160px]">{file?.filename || 'Attachment'}</span>
                                  <FiDownload className="text-current ml-auto" />
                                </a>
                              );
                            })}
                          </div>
                        )}
                        <div className={`text-[10px] mt-1.5 ${isOwn ? 'text-pink-100' : 'text-gray-400'} text-right`}>
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Input Area with modern styling */}
        <form onSubmit={handleSend} className="flex items-end gap-2 sm:gap-3 p-4 sm:p-5 bg-white border-t border-gray-200">
          <div className="flex-1 relative">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message..."
              disabled={!connected}
              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-[#FC427B] focus:border-transparent focus:bg-white
                transition-all duration-200 placeholder:text-gray-400 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className={`relative group px-4 py-3 border-2 border-gray-300 bg-white rounded-xl cursor-pointer
              transition-all duration-200 hover:border-[#FC427B] hover:bg-pink-50 ${
                uploading ? 'opacity-60 cursor-wait' : 'hover:scale-105 active:scale-95'
              }`}>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleUpload(e.target.files)}
                disabled={uploading || !connected}
              />
              <svg className="w-5 h-5 text-gray-600 group-hover:text-[#FC427B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </label>
            <button
              type="submit"
              disabled={!text.trim() || !connected}
              className="px-5 py-3 bg-gradient-to-r from-[#FC427B] to-[#e03a6d] text-white rounded-xl font-medium
                flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200
                hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <FiSend className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
