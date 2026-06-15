import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlassCard from '../components/ui/GlassCard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null); // { type: 'success' | 'error', text: '' }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/contact`, formData);
      if (response.data && response.data.status === 'success') {
        setStatusMsg({
          type: 'success',
          text: 'Thank you for reaching out! We have received your message and will get back to you shortly.'
        });
        setFormData({
          name: '',
          email: '',
          subject: 'General Inquiry',
          message: ''
        });
      } else {
        throw new Error(response.data?.message || 'Failed to submit form');
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({
        type: 'error',
        text: err.response?.data?.message || err.message || 'An error occurred while sending your message. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-24 px-6">
      {/* Title */}
      <div className="text-center mb-16">
        <span className="text-xs font-semibold tracking-widest text-amber-brand uppercase mb-2 block">
          Get In Touch
        </span>
        <h1
          className="text-4xl md:text-5xl font-bold text-[#F5F0E8] mb-4"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Contact Silvertip Cafe
        </h1>
        <p className="text-sm md:text-base text-[#8A8070] max-w-xl mx-auto">
          We’d love to hear from you. Drop us a line regarding reservations, private events, feedback, or general questions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Info Column */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full">
          {/* Hour Card */}
          <GlassCard className="p-6">
            <h3 className="text-amber-brand font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
              🕒 Timings
            </h3>
            <p className="text-sm text-[#F5F0E8] font-medium">Monday - Saturday</p>
            <p className="text-xs text-[#8A8070] mb-3">8:00 AM - 10:00 PM</p>
            <p className="text-sm text-[#F5F0E8] font-medium">Sunday</p>
            <p className="text-xs text-[#8A8070]">9:00 AM - 8:00 PM</p>
          </GlassCard>

          {/* Location Card */}
          <GlassCard className="p-6">
            <h3 className="text-amber-brand font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
              📍 Location & Contact
            </h3>
            <p className="text-sm text-[#F5F0E8] font-medium">Address</p>
            <p className="text-xs text-[#8A8070] mb-3">12 Roast Lane, Coimbatore, India</p>
            <p className="text-sm text-[#F5F0E8] font-medium">Phone</p>
            <p className="text-xs text-[#8A8070] mb-3">+91 98765 43210</p>
            <p className="text-sm text-[#F5F0E8] font-medium">Email</p>
            <p className="text-xs text-[#8A8070]">hello@silvertipcafe.com</p>
          </GlassCard>

          {/* Map Placeholder Card */}
          <GlassCard className="p-6 overflow-hidden flex flex-col items-center justify-center text-center relative group min-h-[200px]">
            <div className="absolute inset-0 bg-black/40 bg-radial-hero opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none" />
            <span className="text-3xl mb-3 z-10" role="img" aria-label="Map Icon">🗺️</span>
            <h4 className="text-[#F5F0E8] font-semibold text-sm mb-1 z-10">Map View (Fictional Location)</h4>
            <p className="text-[#8A8070] text-xs max-w-xs mb-4 z-10">Located in the tranquil lanes of Coimbatore, near coffee plantations.</p>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white/5 border border-white/10 hover:border-amber-brand/40 text-xs font-semibold text-[#F5F0E8] hover:text-amber-brand rounded-lg transition-all z-10"
            >
              Get Directions
            </a>
          </GlassCard>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7 w-full">
          <GlassCard className="p-8 md:p-10">
            <h3 className="text-[#F5F0E8] text-xl font-bold mb-6">Send a Message</h3>

            {statusMsg && (
              <div
                className={`p-4 rounded-xl text-xs mb-6 border transition-all ${
                  statusMsg.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-[#52C99A]'
                    : 'bg-red-500/10 border-red-500/20 text-[#E05252]'
                }`}
                role="alert"
              >
                {statusMsg.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Name */}
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-xs uppercase tracking-wider text-[#8A8070] font-semibold">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Meera"
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-amber-brand/40 focus:ring-1 focus:ring-amber-brand/35 rounded-xl text-sm text-[#F5F0E8] placeholder-white/20 transition-all outline-none"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-xs uppercase tracking-wider text-[#8A8070] font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="e.g. meera@example.com"
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-amber-brand/40 focus:ring-1 focus:ring-amber-brand/35 rounded-xl text-sm text-[#F5F0E8] placeholder-white/20 transition-all outline-none"
                />
              </div>

              {/* Subject Dropdown */}
              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-xs uppercase tracking-wider text-[#8A8070] font-semibold">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 focus:border-amber-brand/40 focus:ring-1 focus:ring-amber-brand/35 rounded-xl text-sm text-[#F5F0E8] transition-all outline-none cursor-pointer"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Reservation">Reservation</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Event Booking">Event Booking</option>
                </select>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-xs uppercase tracking-wider text-[#8A8070] font-semibold">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Type your query or reservation request details here..."
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-amber-brand/40 focus:ring-1 focus:ring-amber-brand/35 rounded-xl text-sm text-[#F5F0E8] placeholder-white/20 transition-all outline-none resize-none"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 bg-amber-brand hover:bg-amber-400 disabled:bg-amber-brand/50 text-black text-sm uppercase font-bold tracking-widest rounded-xl transition-all shadow-lg shadow-amber-brand/10 hover:shadow-amber-brand/30 active:scale-[0.98]"
              >
                {loading ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
