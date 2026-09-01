import React, { useRef, useEffect, useState } from 'react';
import { Cpu, Flame, Layers, Maximize2, Wrench, CheckCircle } from 'lucide-react';

export default function Laptop3DCanvas() {
  const canvasRef = useRef(null);
  const [explodeFactor, setExplodeFactor] = useState(0);
  const [thermalMode, setThermalMode] = useState(false);
  const [rotationY, setRotationY] = useState(-0.4);
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeComponent, setActiveComponent] = useState('motherboard');

  const componentsData = {
    motherboard: {
      name: 'Chip-Level Motherboard',
      status: 'Fully Diagnosed',
      health: '98%',
      details: 'Micro-soldering repair, IC power management controller replacement, & liquid corrosion cleaning.'
    },
    display: {
      name: '15.6" 144Hz IPS Panel',
      status: 'Screen Replacement',
      health: '100%',
      details: 'Original OEM anti-glare display replacement with 1-year warranty.'
    },
    ram: {
      name: '32GB DDR5 RAM Upgrade',
      status: 'High Speed Dual Channel',
      health: '100%',
      details: 'Boost performance by 3.5x for video editing, CAD software & heavy multitasking.'
    },
    ssd: {
      name: '1TB NVMe PCIe Gen4 SSD',
      status: 'High Speed Storage',
      health: '100%',
      details: 'Lightning-fast 7000 MB/s read speeds with complete data recovery & OS migration.'
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let angleY = rotationY;

    const resizeCanvas = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height || 450;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2 + 20;

      ctx.clearRect(0, 0, w, h);

      if (autoRotate) {
        angleY += 0.005;
      } else {
        angleY = rotationY;
      }

      const rotY = angleY;
      const rotX = 0.35; // fixed perspective tilt

      const project = (x, y, z) => {
        let x1 = x * Math.cos(rotY) - z * Math.sin(rotY);
        let z1 = x * Math.sin(rotY) + z * Math.cos(rotY);

        let y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
        let z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);

        const fov = 380;
        const dist = 380;
        const scale = fov / (dist + z2);
        return {
          px: cx + x1 * scale,
          py: cy + y2 * scale,
          scale,
          z: z2
        };
      };

      // Draw Laptop Base Chassis
      const baseOffsetY = explodeFactor * 40;
      const p1 = project(-110, 10 + baseOffsetY, -70);
      const p2 = project(110, 10 + baseOffsetY, -70);
      const p3 = project(110, 25 + baseOffsetY, 80);
      const p4 = project(-110, 25 + baseOffsetY, 80);

      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(p1.px, p1.py);
      ctx.lineTo(p2.px, p2.py);
      ctx.lineTo(p3.px, p3.py);
      ctx.lineTo(p4.px, p4.py);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Motherboard Layer
      const mbOffsetY = explodeFactor * 0;
      const m1 = project(-95, -5 + mbOffsetY, -55);
      const m2 = project(95, -5 + mbOffsetY, -55);
      const m3 = project(95, 5 + mbOffsetY, 45);
      const m4 = project(-95, 5 + mbOffsetY, 45);

      ctx.fillStyle = thermalMode ? 'rgba(239, 68, 68, 0.4)' : '#064e3b';
      ctx.strokeStyle = thermalMode ? '#ef4444' : '#10b981';
      ctx.lineWidth = activeComponent === 'motherboard' ? 3 : 1.5;

      ctx.beginPath();
      ctx.moveTo(m1.px, m1.py);
      ctx.lineTo(m2.px, m2.py);
      ctx.lineTo(m3.px, m3.py);
      ctx.lineTo(m4.px, m4.py);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Draw Micro-Chips & CPU Socket
      const cpuPt = project(0, -8 + mbOffsetY, -10);
      ctx.beginPath();
      ctx.arc(cpuPt.px, cpuPt.py, 18 * cpuPt.scale, 0, Math.PI * 2);
      if (thermalMode) {
        const heatGrad = ctx.createRadialGradient(cpuPt.px, cpuPt.py, 2, cpuPt.px, cpuPt.py, 25);
        heatGrad.addColorStop(0, '#ef4444');
        heatGrad.addColorStop(0.5, '#f59e0b');
        heatGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.fillStyle = heatGrad;
      } else {
        ctx.fillStyle = '#1e293b';
      }
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.stroke();

      // RAM Modules Layer
      const ramOffsetY = explodeFactor * -35;
      const r1 = project(-70, -20 + ramOffsetY, 10);
      const r2 = project(-20, -20 + ramOffsetY, 10);
      const r3 = project(-20, -10 + ramOffsetY, 35);
      const r4 = project(-70, -10 + ramOffsetY, 35);

      ctx.fillStyle = activeComponent === 'ram' ? '#3b82f6' : '#1e3a8a';
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = activeComponent === 'ram' ? 3 : 1;
      ctx.beginPath();
      ctx.moveTo(r1.px, r1.py);
      ctx.lineTo(r2.px, r2.py);
      ctx.lineTo(r3.px, r3.py);
      ctx.lineTo(r4.px, r4.py);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // SSD Module Layer
      const ssdOffsetY = explodeFactor * -35;
      const s1 = project(20, -20 + ssdOffsetY, 10);
      const s2 = project(70, -20 + ssdOffsetY, 10);
      const s3 = project(70, -10 + ssdOffsetY, 35);
      const s4 = project(20, -10 + ssdOffsetY, 35);

      ctx.fillStyle = activeComponent === 'ssd' ? '#8b5cf6' : '#581c87';
      ctx.strokeStyle = '#a78bfa';
      ctx.lineWidth = activeComponent === 'ssd' ? 3 : 1;
      ctx.beginPath();
      ctx.moveTo(s1.px, s1.py);
      ctx.lineTo(s2.px, s2.py);
      ctx.lineTo(s3.px, s3.py);
      ctx.lineTo(s4.px, s4.py);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Keyboard Top Cover Layer
      const kbOffsetY = explodeFactor * -60;
      const k1 = project(-110, -35 + kbOffsetY, -70);
      const k2 = project(110, -35 + kbOffsetY, -70);
      const k3 = project(110, -25 + kbOffsetY, 80);
      const k4 = project(-110, -25 + kbOffsetY, 80);

      ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(k1.px, k1.py);
      ctx.lineTo(k2.px, k2.py);
      ctx.lineTo(k3.px, k3.py);
      ctx.lineTo(k4.px, k4.py);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Display Screen Lid Layer (Hinged at back -70)
      const scrOffsetY = explodeFactor * -100;
      const sc1 = project(-110, -160 + scrOffsetY, -75);
      const sc2 = project(110, -160 + scrOffsetY, -75);
      const sc3 = project(110, -35 + scrOffsetY, -65);
      const sc4 = project(-110, -35 + scrOffsetY, -65);

      ctx.fillStyle = activeComponent === 'display' ? '#0284c7' : 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = activeComponent === 'display' ? '#38bdf8' : '#38bdf8';
      ctx.lineWidth = activeComponent === 'display' ? 3 : 2;

      ctx.beginPath();
      ctx.moveTo(sc1.px, sc1.py);
      ctx.lineTo(sc2.px, sc2.py);
      ctx.lineTo(sc3.px, sc3.py);
      ctx.lineTo(sc4.px, sc4.py);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Display Screen Content Graphic
      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 12px sans-serif';
      const scrTextPt = project(0, -100 + scrOffsetY, -70);
      ctx.fillStyle = '#e0f2fe';
      ctx.textAlign = 'center';
      ctx.fillText('PRAVAH CHIP DIAGNOSTICS', scrTextPt.px, scrTextPt.py);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [explodeFactor, thermalMode, rotationY, autoRotate, activeComponent]);

  const activeData = componentsData[activeComponent];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
      <div className="relative w-full h-[420px] select-none">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Top Header Tag */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" /> 3D Hardware Repair Station
          </span>
        </div>

        {/* Explode View Slider Bar */}
        <div className="absolute top-4 right-4 bg-slate-800/90 border border-slate-700 p-2.5 rounded-xl backdrop-blur-md flex items-center gap-3">
          <Layers className="w-4 h-4 text-slate-300" />
          <span className="text-xs font-medium text-slate-300">Explode View</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={explodeFactor}
            onChange={(e) => setExplodeFactor(parseFloat(e.target.value))}
            className="w-24 accent-blue-500 cursor-pointer"
          />
        </div>

        {/* Component Selector Buttons */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap justify-center items-center gap-2">
          {Object.keys(componentsData).map((key) => (
            <button
              key={key}
              onClick={() => setActiveComponent(key)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                activeComponent === key
                  ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {key.toUpperCase()}
            </button>
          ))}
          <button
            onClick={() => setThermalMode(!thermalMode)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border flex items-center gap-1 transition-all ${
              thermalMode
                ? 'bg-red-600 border-red-400 text-white shadow-lg shadow-red-500/30 animate-pulse'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> Thermal Map
          </button>
        </div>
      </div>

      {/* Selected Component Status Banner */}
      <div className="p-4 bg-slate-800/95 border-t border-slate-700 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">{activeData.name}</h4>
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
              Health: {activeData.health}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">{activeData.details}</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Diagnosis State:</span>
          <p className="text-xs font-bold text-blue-400">{activeData.status}</p>
        </div>
      </div>
    </div>
  );
}
