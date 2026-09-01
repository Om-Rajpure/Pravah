import React, { useRef, useEffect } from 'react';
import { Wifi, ShieldCheck, Server, Radio } from 'lucide-react';

export default function Network3DCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const nodes = [
      { x: 0, y: -80, z: 0, type: 'Server NVR', label: 'Central Storage 8TB' },
      { x: -100, y: 30, z: -50, type: 'CCTV Dome 1', label: 'Main Entrance 4K' },
      { x: 100, y: 30, z: -50, type: 'CCTV Bullet 2', label: 'Perimeter Gate' },
      { x: -60, y: 80, z: 60, type: 'Wi-Fi Router', label: 'Mesh Node Alpha' },
      { x: 60, y: 80, z: 60, type: 'Biometric Gate', label: 'FaceID Door Access' },
    ];

    let angleY = 0;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height || 350;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);
      angleY += 0.006;

      const project = (x, y, z) => {
        let x1 = x * Math.cos(angleY) - z * Math.sin(angleY);
        let z1 = x * Math.sin(angleY) + z * Math.cos(angleY);
        const fov = 350;
        const scale = fov / (fov + z1 + 100);
        return {
          px: cx + x1 * scale,
          py: cy + y * scale,
          scale,
          z: z1
        };
      };

      const projectedNodes = nodes.map(n => ({
        ...n,
        p: project(n.x, n.y, n.z)
      }));

      // Draw Connection Lines & Flowing Data Packets
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const n1 = projectedNodes[i];
          const n2 = projectedNodes[j];

          ctx.beginPath();
          ctx.moveTo(n1.p.px, n1.p.py);
          ctx.lineTo(n2.p.px, n2.p.py);
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.25)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Packet Animation
          const progress = (Date.now() / 1500 + i + j) % 1;
          const px = n1.p.px + (n2.p.px - n1.p.px) * progress;
          const py = n1.p.py + (n2.p.py - n1.p.py) * progress;

          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#60a5fa';
          ctx.fill();
        }
      }

      // Draw Node Glyphs
      projectedNodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.p.px, n.p.py, 12 * n.p.scale, 0, Math.PI * 2);
        ctx.fillStyle = '#1e293b';
        ctx.fill();
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#93c5fd';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(n.type, n.p.px, n.p.py + 22 * n.p.scale);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Wifi className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-bold text-white">Smart IoT & CCTV Mesh Architecture</h3>
        </div>
        <span className="px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Live Encrypted Stream
        </span>
      </div>
      <div className="w-full h-[320px]">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </div>
  );
}
