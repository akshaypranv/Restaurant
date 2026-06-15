import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import GlassCard from '../ui/GlassCard';

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
        <GlassCard className="w-[320px] sm:w-[360px] h-[450px] flex flex-col rounded-2xl border border-white/10 shadow-2xl bg-black/90 backdrop-blur-xl mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <span className="text-xl" role="img" aria-label="Coffee cup emoji">☕</span>
              <div className="text-left">
                <h3 className="text-sm font-bold text-white leading-none">Brewed</h3>
                <span className="text-[10px] text-amber-brand font-medium">Silvertip Assistant</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/40 hover:text-white text-xs p-1"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages Body */}
          <div
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 scrollbar-thin scrollbar-thumb-white/15"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'self-end bg-amber-brand/10 border border-amber-brand/20 text-[#F5F0E8] rounded-tr-none'
                    : 'self-start bg-white/5 border border-white/10 text-[#F5F0E8] rounded-tl-none'
                }`}
              >
                {msg.content}
              </div>
            ))}

            {/* Loading / Typing State */}
            {loading && (
              <div className="self-start bg-white/5 border border-white/10 text-white p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-white/60 dot-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-white/60 dot-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-white/60 dot-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-white/5 bg-white/[0.01] flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Brewed a question..."
              className="flex-1 bg-black/60 border border-white/10 focus:border-amber-brand/40 rounded-xl px-3 py-2 text-xs text-[#F5F0E8] placeholder-white/20 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="px-3.5 bg-amber-brand hover:bg-amber-400 disabled:opacity-40 text-black text-xs font-bold rounded-xl transition-all flex items-center justify-center active:scale-95"
            >
              Send
            </button>
          </form>
        </GlassCard>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-amber-brand hover:bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-brand/20 hover:shadow-amber-brand/40 active:scale-95 transition-all duration-300 border border-white/10 relative overflow-hidden group"
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
