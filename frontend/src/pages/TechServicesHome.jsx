import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Cctv3DCanvas from '../components/3d/Cctv3DCanvas';
import Laptop3DCanvas from '../components/3d/Laptop3DCanvas';
import Network3DCanvas from '../components/3d/Network3DCanvas';
import ServiceCalculator from '../components/services/ServiceCalculator';
import StatusTracker from '../components/services/StatusTracker';
import CctvStorageCalculator from '../components/services/CctvStorageCalculator';
import BeforeAfterSlider from '../components/services/BeforeAfterSlider';
import BookingModal from '../components/services/BookingModal';

import {
  Camera,
  Cpu,
  Wifi,
  Lock,
  Printer,
  ShieldCheck,
  Zap,
  Star,
  CheckCircle,
  PhoneCall,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Layers,
  HardDrive
} from 'lucide-react';

export default function TechServicesHome() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingInitialService, setBookingInitialService] = useState('cctv');
  const [bookingEstPrice, setBookingEstPrice] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  const handleOpenBooking = (serviceType = 'cctv', price = 0) => {
    setBookingInitialService(serviceType);
    setBookingEstPrice(price);
    setBookingModalOpen(true);
  };

  const servicesList = [
    {
      id: 'cctv',
      icon: Camera,
      title: '4K CCTV Camera Systems',
      desc: 'High-definition Dome, Bullet & PTZ 360° cameras with night vision and remote phone monitoring.',
      tags: ['4K Ultra HD', 'Night Vision', 'Mobile Live View'],
      gradient: 'from-blue-600 to-cyan-500'
    },
    {
      id: 'laptop',
      icon: Cpu,
      title: 'Laptop & Computer Repair',
      desc: 'Motherboard chip-level micro-soldering, display replacement, battery swap & liquid damage recovery.',
      tags: ['Chip-Level', 'Display Swap', 'RAM/SSD Upgrade'],
      gradient: 'from-indigo-600 to-purple-500'
    },
    {
      id: 'network',
      icon: Wifi,
      title: 'Enterprise Mesh Wi-Fi & LAN',
      desc: 'High-speed structured LAN cabling, router configuration, server racks, and firewall setup.',
      tags: ['Seamless Mesh', 'Gigabit Speeds', 'Rack Wiring'],
      gradient: 'from-emerald-600 to-teal-500'
    },
    {
      id: 'access',
      icon: Lock,
      title: 'Biometrics & Smart Locks',
      desc: 'Fingerprint & FaceID attendance devices, RFID gate barriers, and Video Door Phones (VDP).',
      tags: ['FaceID Access', 'Smart Locks', 'Attendance Sync'],
      gradient: 'from-amber-600 to-orange-500'
    },
    {
      id: 'automation',
      icon: Zap,
      title: 'Smart Home & Security Alarms',
      desc: 'Motion sensor intruder alarms, automated lighting switches, and smart siren integration.',
      tags: ['Motion Detect', 'Smart Switches', 'Auto Alarm'],
      gradient: 'from-rose-600 to-pink-500'
    },
    {
      id: 'printer',
      icon: Printer,
      title: 'Printers & Peripherals',
      desc: 'Laserjet printer toner refilling, scanner setup, barcode reader, and POS hardware service.',
      tags: ['Toner Refill', 'Laserjet Repair', 'POS Setup'],
      gradient: 'from-blue-600 to-indigo-500'
    }
  ];

  const packagesList = [
    {
      name: 'Residential Smart Package',
      target: 'Ideal for Apartments & Villas',
      price: '₹9,999',
      features: [
        '4x 1080p Full HD IR Night-Vision Cameras',
        '4-Channel HD DVR with 1TB HDD Storage',
        'Mobile App Remote Live Streaming Setup',
        'Free Doorstep Wiring & Installation',
        '1-Year On-Site Replacement Warranty'
      ],
      popular: false
    },
    {
      name: 'Commercial Store Package',
      target: 'Best for Shops, Offices & Supermarkets',
      price: '₹18,499',
      features: [
        '8x 2K High-Clarity Audio/Video Cameras',
        '8-Channel Smart DVR + 2TB HDD (30 Days Rec)',
        'Biometric Fingerprint Attendance Device',
        'Router Mesh Wi-Fi Optimization',
        '1-Year Free AMC Maintenance Included'
      ],
      popular: true
    },
    {
      name: 'Industrial / Factory Package',
      target: 'For Warehouses, Factories & Tech Hubs',
      price: 'Custom Quote',
      features: [
        '16x/32x 4K PTZ 360° Auto-Tracking Cameras',
        'Enterprise NVR Server + 8TB RAID Storage',
        'FaceID Access Control & Smart Gate Lock',
        'Structured Server Rack & Fiber Cabling',
        '24/7 Priority Emergency Technician Visit'
      ],
      popular: false
    }
  ];

  const faqsList = [
    {
      q: 'How long does a CCTV installation or laptop repair usually take?',
      a: 'Standard CCTV installation for 4 to 8 cameras takes around 4-6 hours. Laptop repairs (screen swap, battery, RAM upgrade) are completed within 2-4 hours. Chip-level motherboard micro-soldering takes 24-48 hours.'
    },
    {
      q: 'Do you offer doorstep pick and drop for laptop repairs?',
      a: 'Yes! We provide free doorstep pick-up and delivery for laptop & computer repairs. Our technician inspects the device at your home/office and provides a physical job receipt.'
    },
    {
      q: 'Can I view my CCTV camera feed on my smartphone when I am away?',
      a: 'Absolutely! Every CCTV package includes free mobile application setup (Android & iOS) allowing you to view live streams, playback recordings, and receive motion alerts anywhere in the world.'
    },
    {
      q: 'What warranty is provided on parts and services?',
      a: 'All new CCTV cameras and DVRs come with a 1 to 2-year manufacturer warranty. Laptop repair parts (displays, batteries, SSDs) carry a 90-day to 1-year replacement warranty.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Navigation */}
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* HERO SECTION WITH 3D CANVAS */}
      <section id="hero" className="relative pt-10 pb-20 px-4 overflow-hidden">
        {/* Glowing Background Radial Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-bold text-blue-400">
              <Sparkles className="w-3.5 h-3.5" /> Next-Gen 3D Interactive Tech Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
              4K CCTV Systems & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">Laptop Chip Repairs</span>
            </h1>

            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
              Complete security installation, chip-level micro-soldering, high-speed mesh networking, and smart automation. Built with precision, transparency, and sub-second 3D diagnostics.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => handleOpenBooking('cctv', 0)}
                className="px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-blue-500/30 flex items-center gap-2 transition-all hover:scale-105"
              >
                Book Service Visit <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#calculator"
                className="px-6 py-4 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-200 font-extrabold text-sm flex items-center gap-2 transition-all"
              >
                Calculate Cost <ChevronDown className="w-4 h-4 text-blue-400" />
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
              <div>
                <span className="text-2xl font-black text-white">4,800+</span>
                <span className="text-[11px] text-slate-400 block">CCTVs Installed</span>
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-400">99.4%</span>
                <span className="text-[11px] text-slate-400 block">Repair Success</span>
              </div>
              <div>
                <span className="text-2xl font-black text-amber-400">30 Min</span>
                <span className="text-[11px] text-slate-400 block">Fast Visit</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D CCTV Interactive WebGL Model */}
          <div className="lg:col-span-6">
            <Cctv3DCanvas />
          </div>
        </div>
      </section>

      {/* 3D HARDWARE DIAGNOSTICS SECTION */}
      <section className="py-16 px-4 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <Laptop3DCanvas />
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 rounded-full inline-flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> Chip-Level Hardware Station
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Advanced Micro-Soldering & Thermal Repair
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              We fix dead motherboards, short circuits, liquid damage, display glitches, and GPU overheating issues using state-of-the-art BGA reballing stations and thermal imaging diagnostics.
            </p>

            <div className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Microscopic BGA Chip & IC Replacement (Power IC, Super IO, Charging IC)</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Original OEM Screen Panels (120Hz/144Hz IPS, OLED & Touch Displays)</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>High Speed NVMe PCIe Gen4 SSD & DDR5 RAM Speed Upgrades</span>
              </div>
            </div>

            <button
              onClick={() => handleOpenBooking('laptop', 0)}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/20"
            >
              Book Laptop Repair Pickup
            </button>
          </div>
        </div>
      </section>

      {/* SERVICE CATALOG GRID */}
      <section id="services" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded-full inline-flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Full Service Catalog
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-3">
            Comprehensive Tech & Security Solutions
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-2">
            From residential CCTV cameras to commercial server racks and chip repair, we cover all your technical needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className="group relative bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-3xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${srv.gradient} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{srv.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{srv.desc}</p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {srv.tags.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 rounded-md">
                      {t}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleOpenBooking(srv.id, 0)}
                  className="w-full py-2.5 bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-extrabold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  Book Service <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* COST CALCULATOR */}
      <ServiceCalculator onOpenBooking={handleOpenBooking} />

      {/* 3D NETWORK MESH SHOWCASE */}
      <section className="py-12 px-4 max-w-5xl mx-auto">
        <Network3DCanvas />
      </section>

      {/* ORDER TRACKER */}
      <StatusTracker />

      {/* CCTV STORAGE & LENS CALCULATOR */}
      <CctvStorageCalculator />

      {/* BEFORE / AFTER COMPARISON */}
      <div id="before-after">
        <BeforeAfterSlider />
      </div>

      {/* PRICING PACKAGES */}
      <section id="pricing" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-full inline-flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5" /> Transparent Pricing
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-3">
            Popular Security & Service Packages
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-2">
            Complete turnkey solutions with zero hidden costs. All packages include hardware, cabling & warranty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packagesList.map((pkg, idx) => (
            <div
              key={idx}
              className={`relative bg-slate-900 rounded-3xl p-8 border flex flex-col justify-between transition-all ${
                pkg.popular
                  ? 'border-blue-500 shadow-2xl shadow-blue-500/10 scale-105'
                  : 'border-slate-800'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white font-extrabold text-[11px] rounded-full uppercase tracking-wider shadow-lg">
                  Most Popular Choice
                </span>
              )}

              <div>
                <h3 className="text-xl font-bold text-white mb-1">{pkg.name}</h3>
                <p className="text-xs text-slate-400 mb-4">{pkg.target}</p>

                <div className="mb-6">
                  <span className="text-4xl font-black text-white">{pkg.price}</span>
                  {pkg.price !== 'Custom Quote' && <span className="text-xs text-slate-400 font-normal"> / turnkey setup</span>}
                </div>

                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  {pkg.features.map((feat, fidx) => (
                    <li key={fidx} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleOpenBooking('cctv', 0)}
                className={`w-full py-3.5 rounded-xl font-extrabold text-xs transition-all ${
                  pkg.popular
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-200'
                }`}
              >
                Select Package & Schedule
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQS */}
      <section id="faq" className="py-16 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-800 rounded-full inline-flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-3">Got Questions? We Have Answers</h2>
        </div>

        <div className="space-y-4">
          {faqsList.map((faq, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left font-bold text-sm text-white flex justify-between items-center"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-blue-400' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-400 border-t border-slate-800/60 pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FLOATING QUICK CONTACT BUTTONS */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <a
          href="https://wa.me/919876543210?text=Hi%2C%20I%20want%20a%20free%20CCTV%20or%20Laptop%20repair%20quote"
          target="_blank"
          rel="noopener noreferrer"
          className="w-13 h-13 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110"
          title="Direct WhatsApp Chat"
        >
          <MessageSquare className="w-6 h-6" />
        </a>
        <a
          href="tel:+919876543210"
          className="w-13 h-13 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110"
          title="Direct Call Helpline"
        >
          <PhoneCall className="w-6 h-6" />
        </a>
      </div>

      {/* BOOKING MODAL */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialService={bookingInitialService}
        estimatedPrice={bookingEstPrice}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
