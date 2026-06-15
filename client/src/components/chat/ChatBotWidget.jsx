import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const ChatBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm Brewed, your friendly AI assistant. Ask me anything about our coffee blends, digital menu, location, or opening hours! ☕"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [menuContext, setMenuContext] = useState(null);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Fetch full menu on mount to use as context for Claude chatbot
  useEffect(() => {
    const fetchMenuContext = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/menu`);
        if (response.data && response.data.status === 'success') {
          // Keep a simplified menu context to avoid exceeding token limits
          const simplifiedMenu = response.data.data.map(cat => ({
            category: cat.name,
            items: cat.items.map(item => ({
              name: item.name,
              price: item.price,
              is_veg: item.is_veg,
              is_popular: item.is_popular,
              note: item.note
            }))
          }));
          setMenuContext(simplifiedMenu);
        }
      } catch (err) {
        console.error('[ChatBot] Failed to load menu context:', err);
      }
    };
    fetchMenuContext();
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userMessage = { role: 'user', content: inputText.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInputText('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/chat`, {
        messages: updatedMessages,
        menuContext
      });

      if (response.data && response.data.status === 'success') {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: response.data.data.reply }
        ]);
      } else {
        throw new Error('No reply received');
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I'm experiencing some connectivity issues right now. Could you please try asking again in a bit?"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Inline styles for bouncing dot typing animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounceDots {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .dot-bounce {
          animation: bounceDots 1.2s infinite ease-in-out;
        }
      `}} />

      {/* Slide-Up Chat Window */}
      {isOpen && (
        <div className="chatbot-panel w-[320px] sm:w-[360px] h-[450px] flex flex-col mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="chatbot-header flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl" role="img" aria-label="Coffee cup emoji">☕</span>
              <div className="text-left">
                <h3 className="text-sm font-bold text-[#FAF5F1] leading-none">Brewed</h3>
                <span className="text-[10px] text-[#FAF5F1]/80 font-medium">Silvertip Assistant</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#FAF5F1]/70 hover:text-[#FAF5F1] text-xs p-1"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages Body */}
          <div
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto flex flex-col gap-3"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={msg.role === 'user' ? 'chatbot-message-user' : 'chatbot-message-bot'}
              >
                {msg.content}
              </div>
            ))}

            {/* Loading / Typing State */}
            {loading && (
              <div className="chatbot-message-bot flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-text-dark/60 dot-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-text-dark/60 dot-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-text-dark/60 dot-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-surface-gray bg-surface-white flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Brewed a question..."
              className="input-field flex-1 px-3 py-2 text-xs"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="btn-primary px-3.5 text-xs font-bold active:scale-95 disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chatbot-fab flex items-center justify-center hover:opacity-90 active:scale-95 transition-all duration-300 relative overflow-hidden group"
        aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
      >
        <span className="text-2xl group-hover:scale-110 transition-transform duration-300" role="img" aria-label="Chatbot bubble">
          {isOpen ? '✕' : '💬'}
        </span>
      </button>
    </div>
  );
};

export default ChatBotWidget;
