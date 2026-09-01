import React, { useState } from 'react';
import { Search, Clock, CheckCircle2, AlertCircle, Wrench, UserCheck, MapPin, Truck } from 'lucide-react';

export default function StatusTracker() {
  const [trackInput, setTrackInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const sampleDatabase = {
    'REP-8492': {
      id: 'REP-8492',
      customer: 'Rahul Sharma',
      device: 'Dell XPS 15 Laptop',
      service: 'Chip-Level Motherboard Repair & Thermal Paste',
      technician: 'Vikram Singh (Senior Micro-Soldering Specialist)',
      status: 'In Progress (Testing Stage)',
      step: 3, // out of 4
      estimatedTime: 'Today by 6:00 PM',
      steps: [
        { label: 'Device Received & Inspected', done: true, time: '10:15 AM' },
        { label: 'Thermal & IC Diagnostic Complete', done: true, time: '11:45 AM' },
        { label: 'Micro-Soldering & Component Replace', done: true, time: '02:30 PM' },
        { label: 'Post-Repair Stress & Quality Test', done: false, active: true },
        { label: 'Ready for Pickup / Delivery', done: false }
      ]
    },
    'CCTV-3021': {
      id: 'CCTV-3021',
      customer: 'Apex Logistics Pvt Ltd',
      device: '8x 4K IP CCTV Camera Network',
      service: 'Commercial CCTV Installation & NVR Setup',
      technician: 'Amit Patil (Lead Security Engineer)',
      status: 'Technician En Route',
      step: 2,
      estimatedTime: 'Tomorrow at 11:00 AM',
      steps: [
        { label: 'Order Confirmed & Cable Pre-Cut', done: true, time: 'Yesterday' },
        { label: 'On-Site Cable Wiring & Bracket Mount', done: true, time: 'Today 09:00 AM' },
        { label: 'Camera Lens Angle Calibration & NVR Config', done: false, active: true },
        { label: 'Mobile Live View Integration & Handover', done: false }
      ]
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const cleanId = trackInput.trim().toUpperCase();
    if (!cleanId) return;

    if (sampleDatabase[cleanId]) {
      setSearchedOrder(sampleDatabase[cleanId]);
      setErrorMsg('');
    } else {
      // Generate realistic fallback order
      setSearchedOrder({
        id: cleanId,
        customer: 'Customer Order',
        device: 'Service Ticket #' + cleanId,
        service: 'Hardware Service & Inspection',
        technician: 'On-Duty Service Engineer',
        status: 'Order Confirmed - Processing',
        step: 1,
        estimatedTime: 'Within 24 Hours',
        steps: [
          { label: 'Service Request Registered', done: true, time: 'Just now' },
          { label: 'Technician Assigned', done: false, active: true },
          { label: 'Hardware Service / Installation', done: false },
          { label: 'Final Verification & Delivery', done: false }
        ]
      });
      setErrorMsg('');
    }
  };

  return (
    <div id="tracker" className="w-full py-12 px-4 max-w-5xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Live Order Tracking
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-3">
            Track Repair & CCTV Installation Status
          </h2>
          <p className="text-slate-400 text-xs mt-2">
            Enter your Job Tracking ID to view real-time technician progress and estimated completion time.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter Tracking ID (e.g. REP-8492)"
              value={trackInput}
              onChange={(e) => setTrackInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
          >
            Track Status
          </button>
        </form>

        {/* Quick Demo Sample Badges */}
        <div className="flex justify-center items-center gap-2 mb-8 text-xs text-slate-400">
          <span>Try sample tracking IDs:</span>
          <button
            onClick={() => {
              setTrackInput('REP-8492');
              setSearchedOrder(sampleDatabase['REP-8492']);
            }}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-blue-400 border border-slate-700 rounded-md font-mono text-[11px]"
          >
            REP-8492
          </button>
          <button
            onClick={() => {
              setTrackInput('CCTV-3021');
              setSearchedOrder(sampleDatabase['CCTV-3021']);
            }}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-emerald-400 border border-slate-700 rounded-md font-mono text-[11px]"
          >
            CCTV-3021
          </button>
        </div>

        {/* Order Details Result */}
        {searchedOrder && (
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 transition-all">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700 pb-4 mb-6">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Tracking Code</span>
                <span className="text-xl font-extrabold text-white font-mono">{searchedOrder.id}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Device / System</span>
                <span className="text-sm font-semibold text-slate-200">{searchedOrder.device}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Est. Ready</span>
                <span className="text-xs font-bold text-emerald-400">{searchedOrder.estimatedTime}</span>
              </div>
            </div>

            {/* Technician Info */}
            <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-700/60 mb-6">
              <UserCheck className="w-5 h-5 text-blue-400" />
              <div className="text-xs">
                <span className="text-slate-400 block">Assigned Engineer:</span>
                <span className="font-bold text-white">{searchedOrder.technician}</span>
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">Live Service Timeline</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
                {searchedOrder.steps.map((st, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs relative ${
                      st.done
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                        : st.active
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 animate-pulse'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {st.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <div className={`w-3 h-3 rounded-full ${st.active ? 'bg-blue-500' : 'bg-slate-700'}`} />
                      )}
                      <span className="font-bold text-[11px]">Step {idx + 1}</span>
                    </div>
                    <p className="font-medium text-slate-200 text-[11px] leading-tight">{st.label}</p>
                    {st.time && <span className="text-[10px] text-slate-400 block mt-1">{st.time}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
