import React, { useState } from 'react';
import { Calculator, Camera, HardDrive, ShieldCheck, Cpu, CheckCircle, ArrowRight, PhoneCall } from 'lucide-react';

export default function ServiceCalculator({ onOpenBooking }) {
  const [serviceType, setServiceType] = useState('cctv'); // 'cctv' | 'laptop'

  // CCTV State
  const [cameraCount, setCameraCount] = useState(4);
  const [resolution, setResolution] = useState('1080p'); // '1080p', '2K', '4K'
  const [hddStorage, setHddStorage] = useState('1TB'); // '500GB', '1TB', '2TB', '4TB'
  const [siteType, setSiteType] = useState('Residential'); // 'Residential', 'Shop/Store', 'Office/Factory'
  const [includeAMC, setIncludeAMC] = useState(true);

  // Laptop State
  const [laptopIssue, setLaptopIssue] = useState('display'); // 'display', 'motherboard', 'ssd', 'battery', 'cleaning'
  const [urgency, setUrgency] = useState('standard'); // 'standard', 'express'

  // Calculations
  const calculateCctvTotal = () => {
    let cameraPrice = resolution === '4K' ? 2400 : resolution === '2K' ? 1800 : 1300;
    let dvrPrice = cameraCount > 8 ? 6500 : cameraCount > 4 ? 4200 : 2800;
    let hddPrice = hddStorage === '4TB' ? 7800 : hddStorage === '2TB' ? 4500 : hddStorage === '1TB' ? 3100 : 2200;
    let installPerCam = siteType === 'Office/Factory' ? 450 : 350;
    let amcPrice = includeAMC ? 1500 : 0;

    let subtotal = (cameraCount * cameraPrice) + dvrPrice + hddPrice + (cameraCount * installPerCam) + amcPrice;
    let discount = Math.round(subtotal * 0.10); // 10% instant package discount
    return {
      subtotal,
      discount,
      total: subtotal - discount
    };
  };

  const calculateLaptopTotal = () => {
    const prices = {
      display: 3400,
      motherboard: 2200,
      ssd: 2800,
      battery: 1900,
      cleaning: 700
    };
    let base = prices[laptopIssue] || 1500;
    let expressFee = urgency === 'express' ? 500 : 0;
    let subtotal = base + expressFee;
    let discount = 200;
    return {
      subtotal,
      discount,
      total: subtotal - discount
    };
  };

  const cctvCalc = calculateCctvTotal();
  const laptopCalc = calculateLaptopTotal();
  const activeTotal = serviceType === 'cctv' ? cctvCalc : laptopCalc;

  return (
    <div id="calculator" className="w-full py-12 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded-full inline-flex items-center gap-1.5">
          <Calculator className="w-3.5 h-3.5" /> Instant Cost Estimator
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-3">
          Calculate Your Service Estimate in Seconds
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm mt-2">
          Transparent pricing with zero hidden fees. Select your requirements below for an instant quote.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Service Switcher */}
          <div className="flex bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
            <button
              onClick={() => setServiceType('cctv')}
              className={`flex-1 py-3 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                serviceType === 'cctv'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4" /> CCTV Camera System
            </button>
            <button
              onClick={() => setServiceType('laptop')}
              className={`flex-1 py-3 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                serviceType === 'laptop'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4" /> Laptop & Computer Repair
            </button>
          </div>

          {serviceType === 'cctv' ? (
            <div className="space-y-5">
              {/* Camera Count */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide flex justify-between">
                  <span>Number of Cameras</span>
                  <span className="text-blue-400 font-extrabold text-sm">{cameraCount} Cameras</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="16"
                  step="2"
                  value={cameraCount}
                  onChange={(e) => setCameraCount(parseInt(e.target.value))}
                  className="w-full mt-2 accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>2 Cams (Home)</span>
                  <span>8 Cams (Shop)</span>
                  <span>16 Cams (Factory)</span>
                </div>
              </div>

              {/* Camera Resolution */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-2">
                  Camera Resolution
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['1080p', '2K', '4K'].map((res) => (
                    <button
                      key={res}
                      onClick={() => setResolution(res)}
                      className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        resolution === res
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                      }`}
                    >
                      {res} {res === '4K' ? 'Ultra HD' : 'Full HD'}
                    </button>
                  ))}
                </div>
              </div>

              {/* HDD Storage */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-2">
                  HDD Storage Capacity
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['500GB', '1TB', '2TB', '4TB'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setHddStorage(st)}
                      className={`py-2 rounded-lg border text-xs font-semibold transition-all ${
                        hddStorage === st
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* AMC Checkbox */}
              <div className="flex items-center justify-between p-3.5 bg-slate-800/60 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Include 1-Year AMC Maintenance Plan</h4>
                    <p className="text-[11px] text-slate-400">Quarterly servicing, cleaning & priority support</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={includeAMC}
                  onChange={(e) => setIncludeAMC(e.target.checked)}
                  className="w-5 h-5 accent-blue-600 cursor-pointer rounded"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Laptop Issue */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-2">
                  Select Repair Service
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { id: 'display', label: 'Screen / Display Replacement (15.6" IPS)', price: '₹3,400' },
                    { id: 'motherboard', label: 'Motherboard Micro-Soldering & IC Repair', price: '₹2,200' },
                    { id: 'ssd', label: '1TB NVMe High Speed SSD + OS Installation', price: '₹2,800' },
                    { id: 'battery', label: 'OEM Battery & Charger Replacement', price: '₹1,900' },
                    { id: 'cleaning', label: 'Thermal Paste Refresh & Internal Dust Cleaning', price: '₹700' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setLaptopIssue(item.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                        laptopIssue === item.id
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-indigo-400">{item.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Urgency */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-2">
                  Service Speed
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setUrgency('standard')}
                    className={`py-2.5 rounded-xl border text-xs font-bold ${urgency === 'standard' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                  >
                    Standard (24-48 Hours)
                  </button>
                  <button
                    onClick={() => setUrgency('express')}
                    className={`py-2.5 rounded-xl border text-xs font-bold ${urgency === 'express' ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                  >
                    Express Same-Day (+₹500)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Price Summary Card */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-800 to-slate-850 p-6 rounded-2xl border border-slate-700 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-700 pb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              {serviceType === 'cctv' ? 'CCTV Package Summary' : 'Repair Estimate Breakdown'}
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              {serviceType === 'cctv' ? (
                <>
                  <div className="flex justify-between">
                    <span>{cameraCount}x {resolution} Cameras & DVR</span>
                    <span className="font-semibold">Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{hddStorage} Surveillance Hard Disk</span>
                    <span className="font-semibold">Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span>On-Site Wiring & Installation</span>
                    <span className="font-semibold">Included</span>
                  </div>
                  {includeAMC && (
                    <div className="flex justify-between text-emerald-400">
                      <span>1-Year Maintenance & Servicing</span>
                      <span className="font-semibold">₹1,500</span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span>Selected Service Fee</span>
                    <span className="font-semibold">Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Free Doorstep Pickup / Drop</span>
                    <span className="font-semibold text-emerald-400">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>90-Day Warranty On Parts</span>
                    <span className="font-semibold text-emerald-400">FREE</span>
                  </div>
                </>
              )}

              <div className="border-t border-slate-700/80 pt-3 flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>₹{activeTotal.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Instant Online Discount</span>
                <span>-₹{activeTotal.discount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700">
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-sm font-bold text-slate-300">Estimated Total:</span>
              <div className="text-right">
                <span className="text-3xl font-extrabold text-white">₹{activeTotal.total.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 block">+ GST (where applicable)</span>
              </div>
            </div>

            <button
              onClick={() => onOpenBooking && onOpenBooking(serviceType, activeTotal.total)}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
            >
              Book Service & Lock Quote <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
