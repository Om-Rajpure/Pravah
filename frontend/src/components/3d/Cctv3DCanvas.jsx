import React, { useRef, useEffect, useState } from 'react';
import { Eye, Shield, Zap, RefreshCw, Layers, Camera } from 'lucide-react';

export default function Cctv3DCanvas() {
  const canvasRef = useRef(null);
  const [rotationX, setRotationX] = useState(0.2);
  const [rotationY, setRotationY] = useState(0.6);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [nightVision, setNightVision] = useState(false);
  const [laserScan, setLaserScan] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  const hotspots = [
    {
      id: 'lens',
      title: '4K Ultra-HD Optical Lens',
      desc: '3.6mm Sony Starvis CMOS sensor with f/1.6 aperture for ultra-sharp clarity.',
      x: 0,
      y: 0,
      z: 45
    },
    {
      id: 'ir',
      title: 'Smart IR Night Vision Matrix',
      desc: '24 Infrared Array LEDs providing clear zero-light vision up to 30 meters.',
      x: -18,
      y: 12,
      z: 35
    },
    {
      id: 'ptz',
      title: 'Pan-Tilt Motor Servo',
      desc: 'Precision dual-stepper motors with 355° horizontal and 90° vertical rotation.',
      x: 0,
      y: -35,
      z: 0
    },
    {
      id: 'casing',
      title: 'IP67 Weatherproof Casing',
      desc: 'Heavy-duty aluminum alloy housing designed to withstand extreme rain and dust.',
      x: 0,
      y: 30,
      z: -20
    }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let angleY = rotationY;
    let scanPos = 0;

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
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Draw background cyber grid
      ctx.strokeStyle = nightVision ? 'rgba(16, 185, 129, 0.08)' : 'rgba(59, 130, 246, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      if (autoRotate && !isDragging) {
        angleY += 0.008;
      } else {
        angleY = rotationY;
      }

      const rotX = rotationX;
      const rotY = angleY;

      // 3D Point Projection Helper
      const project = (x, y, z) => {
        // Rotate around Y axis
        let x1 = x * Math.cos(rotY) - z * Math.sin(rotY);
        let z1 = x * Math.sin(rotY) + z * Math.cos(rotY);

        // Rotate around X axis
        let y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
        let z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);

        const fov = 400;
        const distance = 400;
        const scale = fov / (distance + z2);
        return {
          px: cx + x1 * scale,
          py: cy + y2 * scale,
          scale,
          z: z2
        };
      };

      // 3D Mesh Geometry for CCTV Bullet Camera
      const primaryColor = nightVision ? '#10b981' : '#3b82f6';
      const accentColor = nightVision ? '#059669' : '#60a5fa';
      const glowColor = nightVision ? 'rgba(16, 185, 129, 0.4)' : 'rgba(59, 130, 246, 0.4)';

      // Draw Mount Base
      const baseTop = project(-20, -90, -40);
      const baseBottom = project(20, -90, -40);

      ctx.fillStyle = nightVision ? '#064e3b' : '#1e293b';
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.arc(cx, cy - 80, 45, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Mount Arm
      const arm1 = project(0, -80, -30);
      const arm2 = project(0, -40, 0);

      ctx.beginPath();
      ctx.moveTo(arm1.px, arm1.py);
      ctx.lineTo(arm2.px, arm2.py);
      ctx.lineWidth = 14;
      ctx.strokeStyle = nightVision ? '#047857' : '#334155';
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.strokeStyle = primaryColor;
      ctx.stroke();

      // Main Camera Body Cylindrical Segments
      const bodyRadius = 55;
      const length = 110;
      const segments = 16;

      const frontPoints = [];
      const backPoints = [];

      for (let i = 0; i < segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const bx = Math.cos(theta) * bodyRadius;
        const by = Math.sin(theta) * bodyRadius;

        frontPoints.push(project(bx, by, length / 2));
        backPoints.push(project(bx, by, -length / 2));
      }

      // Draw Main Cylinder Faces
      for (let i = 0; i < segments; i++) {
        const next = (i + 1) % segments;
        const f1 = frontPoints[i];
        const f2 = frontPoints[next];
        const b1 = backPoints[i];
        const b2 = backPoints[next];

        const brightness = Math.max(0.15, Math.min(0.9, 0.5 + (f1.px - f2.px) * 0.01));

        ctx.fillStyle = nightVision
          ? `rgba(6, 78, 59, ${brightness})`
          : `rgba(30, 41, 59, ${brightness})`;
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.moveTo(f1.px, f1.py);
        ctx.lineTo(f2.px, f2.py);
        ctx.lineTo(b2.px, b2.py);
        ctx.lineTo(b1.px, b1.py);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // Camera Front Rim & Lens Assembly
      const lensCenter = project(0, 0, length / 2 + 5);

      // Outer Sun Shield Ring
      ctx.beginPath();
      ctx.arc(lensCenter.px, lensCenter.py, 48 * lensCenter.scale, 0, Math.PI * 2);
      ctx.fillStyle = nightVision ? '#022c22' : '#0f172a';
      ctx.fill();
      ctx.strokeStyle = primaryColor;
      ctx.stroke();

      // IR LED Array Ring
      for (let a = 0; a < 8; a++) {
        const angle = (a / 8) * Math.PI * 2;
        const irX = Math.cos(angle) * 32;
        const irY = Math.sin(angle) * 32;
        const irPt = project(irX, irY, length / 2 + 10);

        ctx.beginPath();
        ctx.arc(irPt.px, irPt.py, 5 * irPt.scale, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = nightVision ? 12 : 6;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Central Optical Lens Glass
      ctx.beginPath();
      ctx.arc(lensCenter.px, lensCenter.py, 22 * lensCenter.scale, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(
        lensCenter.px - 5,
        lensCenter.py - 5,
        2,
        lensCenter.px,
        lensCenter.py,
        22 * lensCenter.scale
      );
      if (nightVision) {
        gradient.addColorStop(0, '#34d399');
        gradient.addColorStop(0.5, '#059669');
        gradient.addColorStop(1, '#022c22');
      } else {
        gradient.addColorStop(0, '#93c5fd');
        gradient.addColorStop(0.5, '#2563eb');
        gradient.addColorStop(1, '#0284c7');
      }
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = accentColor;
      ctx.stroke();

      // Laser Scanner Cone Beam
      if (laserScan) {
        scanPos = (scanPos + 0.03) % 1;
        const beamDist = 180;
        const b1 = project(-90, -90 + scanPos * 180, length / 2 + beamDist);
        const b2 = project(90, -90 + scanPos * 180, length / 2 + beamDist);

        ctx.beginPath();
        ctx.moveTo(lensCenter.px, lensCenter.py);
        ctx.lineTo(b1.px, b1.py);
        ctx.lineTo(b2.px, b2.py);
        ctx.closePath();

        const beamGradient = ctx.createLinearGradient(lensCenter.px, lensCenter.py, b1.px, b1.py);
        beamGradient.addColorStop(0, nightVision ? 'rgba(16, 185, 129, 0.6)' : 'rgba(59, 130, 246, 0.6)');
        beamGradient.addColorStop(1, nightVision ? 'rgba(16, 185, 129, 0.05)' : 'rgba(59, 130, 246, 0.05)');
        ctx.fillStyle = beamGradient;
        ctx.fill();

        // Laser Scan Line
        ctx.beginPath();
        ctx.moveTo(b1.px, b1.py);
        ctx.lineTo(b2.px, b2.py);
        ctx.strokeStyle = nightVision ? '#34d399' : '#60a5fa';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Draw Interactive Hotspots
      hotspots.forEach((hs) => {
        const p = project(hs.x, hs.y, hs.z);
        const isSelected = selectedHotspot && selectedHotspot.id === hs.id;

        ctx.beginPath();
        ctx.arc(p.px, p.py, isSelected ? 10 : 7, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? '#f59e0b' : primaryColor;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Pulsing ring around hotspot
        ctx.beginPath();
        ctx.arc(p.px, p.py, (isSelected ? 16 : 12) + Math.sin(Date.now() / 200) * 3, 0, Math.PI * 2);
        ctx.strokeStyle = isSelected ? 'rgba(245, 158, 11, 0.6)' : glowColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [rotationX, rotationY, isDragging, nightVision, laserScan, autoRotate, selectedHotspot]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setAutoRotate(false);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setRotationY((prev) => prev + dx * 0.008);
    setRotationX((prev) => Math.max(-0.6, Math.min(0.6, prev + dy * 0.008)));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const rotX = rotationX;
    const rotY = autoRotate ? rotationY + 0.008 : rotationY;

    hotspots.forEach((hs) => {
      let x1 = hs.x * Math.cos(rotY) - hs.z * Math.sin(rotY);
      let z1 = hs.x * Math.sin(rotY) + hs.z * Math.cos(rotY);
      let y2 = hs.y * Math.cos(rotX) - z1 * Math.sin(rotX);
      let z2 = hs.y * Math.sin(rotX) + z1 * Math.cos(rotX);

      const scale = 400 / (400 + z2);
      const px = cx + x1 * scale;
      const py = cy + y2 * scale;

      const dist = Math.hypot(clickX - px, clickY - py);
      if (dist < 20) {
        setSelectedHotspot(hs);
      }
    });
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
      <div
        className="relative w-full h-[450px] cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 ${nightVision ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'}`}>
            <Camera className="w-3.5 h-3.5" /> 3D WebGL CCTV Model
          </span>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-800/80 text-slate-300 border border-slate-700 backdrop-blur-md">
            Drag to Rotate 360°
          </span>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-lg">
          <button
            onClick={() => setNightVision(!nightVision)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${nightVision ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
          >
            <Eye className="w-4 h-4" /> Night Vision Mode
          </button>
          <button
            onClick={() => setLaserScan(!laserScan)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${laserScan ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
          >
            <Zap className="w-4 h-4" /> Laser Scanner
          </button>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${autoRotate ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
          >
            <RefreshCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} /> Auto Rotate
          </button>
        </div>
      </div>

      {selectedHotspot && (
        <div className="p-4 bg-slate-800/95 border-t border-slate-700 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-white">{selectedHotspot.title}</h4>
            </div>
            <p className="text-xs text-slate-300 mt-1">{selectedHotspot.desc}</p>
          </div>
          <button
            onClick={() => setSelectedHotspot(null)}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-700/50 rounded"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
