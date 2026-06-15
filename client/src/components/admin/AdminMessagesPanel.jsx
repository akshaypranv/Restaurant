import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ErrorBanner from '../ui/ErrorBanner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const AdminMessagesPanel = ({ adminToken }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/contact`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.data && res.data.status === 'success') {
        setMessages(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchMessages();
    }
  }, [adminToken]);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/v1/contact/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      if (res.data && res.data.status === 'success') {
        setMessages(prev =>
          prev.map(msg => msg.id === id ? { ...msg, read: true } : msg)
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to mark message as read.');
    }
  };

  const handleRowClick = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center">
        <div className="w-16 h-16 border-4 rounded-full border-brand-red/20 border-t-brand-red animate-spin" />
        <p className="text-accent-taupe text-sm mt-4 animate-pulse">Loading messages...</p>
      </div>
    );
  }

  return (
    <div>
      {error && <ErrorBanner message={error} onClose={() => setError(null)} />}

      <div className="w-full overflow-x-auto rounded-xl border border-surface-gray bg-surface-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm text-text-dark">
          <thead className="bg-surface-gray/50 text-xs font-semibold uppercase tracking-wider text-accent-taupe border-b border-surface-gray">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-gray">
            {messages.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-accent-taupe">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl">📭</span>
                    <p className="font-medium">No messages yet</p>
                    <p className="text-xs">Customer messages from the contact form will appear here.</p>
                  </div>
                </td>
              </tr>
            ) : (
              messages.map((msg) => (
                <React.Fragment key={msg.id}>
                  {/* Main row */}
                  <tr
                    onClick={() => handleRowClick(msg.id)}
                    className={`cursor-pointer transition-colors duration-150 ${
                      !msg.read ? 'bg-brand-red/[0.03] hover:bg-brand-red/[0.06]' : 'hover:bg-surface-gray/30'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={`font-medium ${!msg.read ? 'text-text-dark font-semibold' : 'text-text-dark'}`}>
                          {msg.name}
                        </span>
                        <span className="text-[11px] text-accent-taupe mt-0.5">{msg.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={!msg.read ? 'font-semibold text-text-dark' : 'text-accent-taupe'}>
                        {msg.subject}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-accent-taupe text-xs">
                      {formatDate(msg.created_at)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {msg.read ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-surface-gray text-accent-taupe">
                          Read
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-brand-red text-white">
                          Unread
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Expanded message body */}
                  {expandedId === msg.id && (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 bg-surface-gray/20 border-t border-surface-gray">
                        <div className="max-w-3xl">
                          <p className="text-xs font-semibold text-accent-taupe uppercase tracking-wider mb-2">
                            Message
                          </p>
                          <p className="text-sm text-text-dark leading-relaxed whitespace-pre-wrap">
                            {msg.message}
                          </p>
                          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-surface-gray">
                            {!msg.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(msg.id);
                                }}
                                aria-label="Mark as Read"
                                className="text-xs font-semibold uppercase tracking-wider text-accent-taupe hover:text-text-dark hover:bg-surface-gray/50 border border-surface-gray rounded px-3 py-1.5 transition-all"
                              >
                                ✓ Mark as Read
                              </button>
                            )}
                            <span className="text-[11px] text-accent-taupe">
                              From: {msg.email}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMessagesPanel;
