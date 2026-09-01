import React, { useState } from 'react';
import { Sparkles, MoveHorizontal, CheckCircle2 } from 'lucide-react';

export default function BeforeAfterSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const [mode, setMode] = useState('laptop'); // 'laptop' | 'cctv'

  return (
    <div className="w-full py-12 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-full inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Work Precision Showcase
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-3">
          See The Difference: Before & After Repairs
        </h2>
        <p className="text-slate-400 text-xs mt-2">
          Drag the interactive slider below to inspect our chip-level soldering and clean cable management.
        </p>

        {/* Mode Selector */}
        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={() => setMode('laptop')}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
              mode === 'laptop'
                ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/20'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
            }`}
          >
            Motherboard Chip Repair
          </button>
          <button
            onClick={() => setMode('cctv')}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
              mode === 'cctv'
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
            }`}
          >
            Structured CCTV Cable Rack
          </button>
        </div>
      </div>

      {/* Interactive Split View Box */}
      <div className="relative w-full h-[380px] md:h-[420px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl select-none bg-slate-950">
        {/* AFTER Side (Background Layer) */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 p-8 flex flex-col justify-between">
          <span className="self-end px-3 py-1 text-xs font-extrabold bg-emerald-500 text-slate-950 rounded-full flex items-center gap-1 shadow-lg">
            <CheckCircle2 className="w-3.5 h-3.5" /> REPAIRED & RESTORED
          </span>

          <div className="max-w-xs bg-slate-900/90 border border-emerald-500/40 p-4 rounded-2xl backdrop-blur-md">
            <h4 className="text-sm font-bold text-white mb-1">
              {mode === 'laptop' ? 'Restored Motherboard' : 'Structured Server Rack'}
            </h4>
            <p className="text-xs text-slate-300">
              {mode === 'laptop'
                ? 'Micro-soldered IC, thermal paste applied, full conductivity restored.'
                : 'Neat Ethernet labeling, zero crosstalk interference, clean airflow.'}
            </p>
          </div>
        </div>

        {/* BEFORE Side (Clipped Top Layer) */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-br from-red-950 via-slate-900 to-slate-950 p-8 flex flex-col justify-between overflow-hidden border-r-2 border-white"
          style={{ width: `${sliderPos}%` }}
        >
          <span className="self-start px-3 py-1 text-xs font-extrabold bg-red-500 text-white rounded-full shadow-lg">
            BEFORE (DAMAGED)
          </span>

          <div className="max-w-xs bg-slate-900/90 border border-red-500/40 p-4 rounded-2xl backdrop-blur-md">
            <h4 className="text-sm font-bold text-white mb-1">
              {mode === 'laptop' ? 'Corroded Chipset' : 'Messy Cable Clutter'}
            </h4>
            <p className="text-xs text-slate-300">
              {mode === 'laptop'
                ? 'Burnt IC power chip, liquid oxidation, zero power boot.'
                : 'Tangled wires, signal loss, unorganized CCTV connections.'}
            </p>
          </div>
        </div>

        {/* Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="w-10 h-10 rounded-full bg-white text-slate-950 shadow-2xl flex items-center justify-center border-2 border-blue-500 -ml-5">
            <MoveHorizontal className="w-5 h-5" />
          </div>
        </div>

        {/* Hidden Range Input overlay */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={(e) => setSliderPos(parseInt(e.target.value))}
          className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
        />
      </div>
    </div>
  );
}
