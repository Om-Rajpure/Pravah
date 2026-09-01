import React from 'react';
import { Shield, Phone, Mail, MapPin, Clock, Camera, Cpu, Wifi, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Col 1: Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-white">
              PRAVAH <span className="text-blue-500">TECH</span>
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Premium 3D WebGL Security & Electronics Repair Platform. We deliver 4K CCTV Installations, Motherboard Chip-Level Repair, Enterprise Networking, and Biometric Access Control for homes and commercial businesses.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" /> ISO 9001:2026 Certified Service Engineers
          </div>
        </div>

        {/* Col 2: Services */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Our Core Services</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#services" className="hover:text-blue-400">4K Dome & Bullet CCTV Installation</a></li>
            <li><a href="#services" className="hover:text-blue-400">PTZ 360° Smart Auto-Tracking Cameras</a></li>
            <li><a href="#services" className="hover:text-blue-400">Laptop Screen & Hinge Replacement</a></li>
            <li><a href="#services" className="hover:text-blue-400">Motherboard Micro-Soldering & IC Repair</a></li>
            <li><a href="#services" className="hover:text-blue-400">NVMe High Speed SSD & RAM Speed Upgrades</a></li>
            <li><a href="#services" className="hover:text-blue-400">Enterprise Mesh Wi-Fi & LAN Cabling</a></li>
            <li><a href="#services" className="hover:text-blue-400">Fingerprint & FaceID Access Control</a></li>
          </ul>
        </div>

        {/* Col 3: Service Coverage & Hours */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Operating Hours & Visit</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Mon - Sat: 9:00 AM - 9:00 PM</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Sunday: Emergency On-Call Visit</span>
            </div>
            <div className="flex items-start gap-2 text-slate-300 pt-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Serving Mumbai, Navi Mumbai, Thane & Surrounding Regions</span>
            </div>
          </div>
        </div>

        {/* Col 4: Contact Us */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Contact</h4>
          <div className="space-y-2 text-xs">
            <a href="tel:+919876543210" className="flex items-center gap-2 text-slate-200 hover:text-blue-400">
              <Phone className="w-4 h-4 text-blue-400" /> +91 98765 43210
            </a>
            <a href="mailto:support@pravahtech.com" className="flex items-center gap-2 text-slate-200 hover:text-blue-400">
              <Mail className="w-4 h-4 text-blue-400" /> support@pravahtech.com
            </a>
            <p className="text-[11px] text-slate-500 pt-2">
              Doorstep pick & drop available for laptop repairs across all major pincodes.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© 2026 PRAVAH TECH. All rights reserved. Built with 3D WebGL Technology.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-400">Privacy Policy</a>
          <a href="#" className="hover:text-slate-400">Terms of Service</a>
          <a href="#" className="hover:text-slate-400">Warranty Terms</a>
        </div>
      </div>
    </footer>
  );
}
