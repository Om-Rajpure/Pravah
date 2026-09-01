import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Phone, User, CheckCircle2, MessageSquare } from 'lucide-react';

export default function BookingModal({ isOpen, onClose, initialService = 'cctv', estimatedPrice = 0 }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: initialService === 'cctv' ? 'CCTV Camera Installation' : 'Laptop Repair Service',
    address: '',
    date: '',
    timeSlot: 'Morning (10 AM - 1 PM)',
    notes: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [trackId, setTrackId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const generatedId = (formData.service.includes('CCTV') ? 'CCTV-' : 'REP-') + Math.floor(1000 + Math.random() * 9000);
    setTrackId(generatedId);
    setIsSubmitted(true);
  };

  const generateWhatsAppUrl = () => {
    const text = `Hi, I want to book a service!%0A*Name:* ${encodeURIComponent(formData.name)}%0A*Phone:* ${encodeURIComponent(formData.phone)}%0A*Service:* ${encodeURIComponent(formData.service)}%0A*Date & Slot:* ${encodeURIComponent(formData.date)} (${encodeURIComponent(formData.timeSlot)})%0A*Address:* ${encodeURIComponent(formData.address)}%0A*Est Quote:* ₹${estimatedPrice}`;
    return `https://wa.me/919876543210?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full bg-slate-800/60 hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="mb-6">
              <h3 className="text-2xl font-extrabold text-white">Schedule Service Visit</h3>
              <p className="text-xs text-slate-400 mt-1">
                Book a technician home visit or free hardware pickup.
              </p>
              {estimatedPrice > 0 && (
                <div className="mt-3 px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Estimated Quote Locked:</span>
                  <span className="font-extrabold text-blue-400 text-sm">₹{estimatedPrice.toLocaleString()}</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Your Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Mobile / WhatsApp Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Time Slot</label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option>Morning (10 AM - 1 PM)</option>
                    <option>Afternoon (1 PM - 4 PM)</option>
                    <option>Evening (4 PM - 7 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Full Service Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    required
                    rows="2"
                    placeholder="House/Shop No, Street, City, Pincode"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all mt-2"
              >
                Confirm Booking & Generate Ticket
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/40 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-white">Booking Confirmed!</h3>
            <p className="text-xs text-slate-300 mt-2">
              Your service ticket has been created successfully.
            </p>

            <div className="my-6 p-4 bg-slate-800/80 rounded-2xl border border-slate-700 font-mono">
              <span className="text-[10px] text-slate-400 block uppercase">Tracking ID</span>
              <span className="text-2xl font-extrabold text-emerald-400">{trackId}</span>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <MessageSquare className="w-4 h-4" /> Send Confirmation on WhatsApp
              </a>
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
              >
                Close Modal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
