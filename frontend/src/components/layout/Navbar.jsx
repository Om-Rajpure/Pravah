import React, { useState } from 'react';
import { Camera, Cpu, Phone, Menu, X, Shield, Clock, Calculator, MapPin, MessageSquare } from 'lucide-react';

export default function Navbar({ onOpenBooking }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      {/* Top Emergency/Support Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 py-1.5 px-4 text-[11px] font-semibold text-slate-300 flex justify-between items-center border-b border-slate-800">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" /> 24/7 Technician Dispatch Active
            </span>
            <span className="hidden sm:inline text-slate-400">| Doorstep Service in 30 Mins</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+919876543210" className="hover:text-blue-400 flex items-center gap-1 text-white font-bold">
              <Phone className="w-3 h-3 text-blue-400" /> Helpline: +91 98765 43210
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-all">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-black text-white tracking-tight block leading-none">
              PRAVAH <span className="text-blue-500">TECH</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              3D CCTV & Repair Services
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-300">
          <a href="#hero" className="hover:text-blue-400 transition-colors">3D Showcase</a>
          <a href="#services" className="hover:text-blue-400 transition-colors">Services</a>
          <a href="#calculator" className="hover:text-blue-400 transition-colors flex items-center gap-1">
            <Calculator className="w-3.5 h-3.5 text-blue-400" /> Cost Calculator
          </a>
          <a href="#tracker" className="hover:text-blue-400 transition-colors">Track Order</a>
          <a href="#before-after" className="hover:text-blue-400 transition-colors">Before/After</a>
          <a href="#pricing" className="hover:text-blue-400 transition-colors">Packages</a>
          <a href="#faq" className="hover:text-blue-400 transition-colors">FAQs</a>
        </div>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="https://wa.me/919876543210?text=Hi%2C%20I%20need%20CCTV%20or%20Laptop%20Repair%20Service"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
          </a>
          <button
            onClick={() => onOpenBooking && onOpenBooking('cctv', 0)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 transition-all"
          >
            Book Visit
          </button>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-slate-300 hover:text-white p-2"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-3 animate-fadeIn">
          <a href="#hero" onClick={() => setMobileOpen(false)} className="block text-sm font-bold text-slate-300 hover:text-blue-400">3D Showcase</a>
          <a href="#services" onClick={() => setMobileOpen(false)} className="block text-sm font-bold text-slate-300 hover:text-blue-400">Services</a>
          <a href="#calculator" onClick={() => setMobileOpen(false)} className="block text-sm font-bold text-slate-300 hover:text-blue-400">Cost Calculator</a>
          <a href="#tracker" onClick={() => setMobileOpen(false)} className="block text-sm font-bold text-slate-300 hover:text-blue-400">Track Order</a>
          <a href="#pricing" onClick={() => setMobileOpen(false)} className="block text-sm font-bold text-slate-300 hover:text-blue-400">Packages</a>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileOpen(false);
                onOpenBooking && onOpenBooking('cctv', 0);
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Book Service Visit
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
