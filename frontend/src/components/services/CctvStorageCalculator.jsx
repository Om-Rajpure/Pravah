import React, { useState } from 'react';
import { HardDrive, Eye, Shield, Sliders, Check } from 'lucide-react';

export default function CctvStorageCalculator() {
  const [numCam, setNumCam] = useState(4);
  const [res, setRes] = useState('1080p');
  const [days, setDays] = useState(15);
  const [lensMm, setLensMm] = useState('3.6');

  // Storage Math (approx GB per cam per day)
  // 1080p: ~25GB/day @ 15fps H.265
  // 2K: ~40GB/day @ 15fps
  // 4K: ~75GB/day @ 15fps
  const dailyGbPerCam = res === '4K' ? 75 : res === '2K' ? 40 : 25;
  const totalGb = numCam * days * dailyGbPerCam;
  const totalTb = (totalGb / 1024).toFixed(1);

  // Recommended HDD size
  const recHdd = totalTb <= 1 ? '1 TB HDD' : totalTb <= 2 ? '2 TB HDD' : totalTb <= 4 ? '4 TB HDD' : '8 TB Surveillance HDD';

  // Lens Coverage Math
  const lensInfo = {
    '2.8': { angle: '105° Wide Field', dist: 'Up to 10 Meters', bestFor: 'Small Rooms, Store Entrance, Hallways' },
    '3.6': { angle: '85° Standard View', dist: 'Up to 20 Meters', bestFor: 'Living Rooms, Office Premises, Parking' },
    '6.0': { angle: '55° Narrow Zoom', dist: 'Up to 35 Meters', bestFor: 'Long Corridors, Perimeter Fences, Cash Counters' }
  }[lensMm];

  return (
    <div className="w-full py-8 px-4 max-w-5xl mx-auto">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <HardDrive className="w-5 h-5 text-blue-400" />
          <h3 className="text-xl font-bold text-white">CCTV Storage & Lens Range Calculator</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* HDD Calculator */}
          <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700 space-y-4">
            <h4 className="text-sm font-bold text-slate-200 border-b border-slate-700 pb-2 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" /> Hard Disk Storage Calculator
            </h4>

            <div>
              <label className="text-xs font-semibold text-slate-400 flex justify-between">
                <span>Total Cameras:</span>
                <span className="text-white font-bold">{numCam} Cams</span>
              </label>
              <input
                type="range"
                min="1"
                max="32"
                value={numCam}
                onChange={(e) => setNumCam(parseInt(e.target.value))}
                className="w-full mt-1 accent-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 flex justify-between">
                <span>Recording Retention:</span>
                <span className="text-white font-bold">{days} Days</span>
              </label>
              <input
                type="range"
                min="7"
                max="60"
                step="7"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="w-full mt-1 accent-blue-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {['1080p', '2K', '4K'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRes(r)}
                  className={`py-1.5 rounded text-xs font-bold ${res === r ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="mt-4 p-3 bg-slate-900 rounded-xl border border-slate-700 text-center">
              <span className="text-[11px] text-slate-400 block">Calculated Storage Required:</span>
              <span className="text-2xl font-extrabold text-blue-400">{totalTb} TB</span>
              <span className="text-[11px] text-emerald-400 block font-semibold mt-1">Recommended: {recHdd}</span>
            </div>
          </div>

          {/* Lens Coverage Calculator */}
          <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700 space-y-4">
            <h4 className="text-sm font-bold text-slate-200 border-b border-slate-700 pb-2 flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" /> Lens Focal Length & Distance Calculator
            </h4>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-2">Select Lens Size (mm):</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { mm: '2.8', label: '2.8mm Wide' },
                  { mm: '3.6', label: '3.6mm Std' },
                  { mm: '6.0', label: '6.0mm Zoom' }
                ].map((l) => (
                  <button
                    key={l.mm}
                    onClick={() => setLensMm(l.mm)}
                    className={`py-2 rounded-lg text-xs font-bold ${lensMm === l.mm ? 'bg-emerald-600 text-slate-950' : 'bg-slate-700 text-slate-300'}`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between bg-slate-900/60 p-2.5 rounded-lg border border-slate-700">
                <span className="text-slate-400">Viewing Angle:</span>
                <span className="font-bold text-emerald-400">{lensInfo.angle}</span>
              </div>
              <div className="flex justify-between bg-slate-900/60 p-2.5 rounded-lg border border-slate-700">
                <span className="text-slate-400">Recognition Range:</span>
                <span className="font-bold text-white">{lensInfo.dist}</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-700">
                <span className="text-slate-400 block mb-1">Recommended Deployment:</span>
                <span className="font-semibold text-slate-200">{lensInfo.bestFor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
