import React, { useState, useEffect, useRef } from 'react';
import { audioSystem } from '../utils/audioSystem';
import { Sigil444 } from './Sigil444';

interface LoreFragment {
  id: number;
  code: string;
  excerpt: string;
  source: string;
}

const LORE_FRAGMENTS: LoreFragment[] = [
  {
    id: 1,
    code: 'RECOVERED FRAGMENT // 07',
    excerpt: '“THE FIRST SIGNAL WAS NOT THE FIRST TIME. WE FOUND RECORDINGS DATING BEFORE THE EXCLUSION PERIMETER WAS FENCED.”',
    source: 'RESEARCHER NOTEBOOK // REDACTED'
  },
  {
    id: 2,
    code: 'RECOVERED FRAGMENT // 14',
    excerpt: '“THE NEEDLE OSCILLATES AT 04:44:12 EVEN WHEN THE BATTERIES ARE REMOVED. THE CAVITY BENEATH VAULT 12 IS RESONATING.”',
    source: 'LABORATORY MEMO // SECTOR B-4'
  },
  {
    id: 3,
    code: 'RECOVERED FRAGMENT // 21',
    excerpt: '“SOMETHING WAS ANSWERING FROM ACROSS THE BOREAL RIDGE. DO NOT TRANSMIT. WAIT FOR THE SECOND SIGNAL.”',
    source: 'SURVEILLANCE UNIT LOG'
  },
  {
    id: 4,
    code: 'RECOVERED FRAGMENT // 28',
    excerpt: '“I DON\'T THINK WE FOUND THE SIGNAL. THE SIGNAL FOUND US.”',
    source: 'FIELD OBSERVER FINAL ENTRY'
  },
  {
    id: 5,
    code: 'RECOVERED FRAGMENT // 33',
    excerpt: '“THE FOURTEEN PIECES WERE SCATTERED PURPOSEFULLY. ONLY CONVERGENCE OPENS THE CARRIER WAVE.”',
    source: 'MINISTRY ARCHIVE SUMMARY'
  }
];

interface SignalHuntProps {
  onClose: () => void;
}

export const SignalHuntGame: React.FC<SignalHuntProps> = ({ onClose }) => {
  // Player Position in a 1000x1000 coordinate grid
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 200, y: 800 });
  // Target Signal Anomaly Position
  const [targetPos, setTargetPos] = useState<{ x: number; y: number }>({ x: 500, y: 500 });
  const [signalLocked, setSignalLocked] = useState<boolean>(false);
  const [foundFragment, setFoundFragment] = useState<LoreFragment | null>(null);
  const [discoveredHistory, setDiscoveredHistory] = useState<LoreFragment[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Initialize target randomly away from player
  const initRound = () => {
    const rx = Math.floor(200 + Math.random() * 600);
    const ry = Math.floor(200 + Math.random() * 600);
    setTargetPos({ x: rx, y: ry });
    setSignalLocked(false);
    setFoundFragment(null);
  };

  useEffect(() => {
    initRound();
  }, []);

  // Distance calculation
  const dx = targetPos.x - playerPos.x;
  const dy = targetPos.y - playerPos.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const maxDist = 900;

  // Signal Strength: 0% to 100%
  const signalStrength = Math.max(0, Math.min(100, Math.round((1 - distance / maxDist) * 100)));
  // Noise: 100 dB down to 12 dB as you get close
  const noiseLevel = Math.max(12, Math.round((distance / maxDist) * 90 + (Math.random() * 8)));
  // Angle / Bearing in degrees
  const bearingAngle = Math.round((Math.atan2(dy, dx) * 180) / Math.PI + 90);

  // Check victory lock
  useEffect(() => {
    if (distance < 55 && !signalLocked) {
      setSignalLocked(true);
      audioSystem.playSignalUnlocked();

      // Pick a lore fragment
      const available = LORE_FRAGMENTS.filter((f) => !discoveredHistory.some((d) => d.id === f.id));
      const chosen = available.length > 0
        ? available[Math.floor(Math.random() * available.length)]
        : LORE_FRAGMENTS[Math.floor(Math.random() * LORE_FRAGMENTS.length)];

      setFoundFragment(chosen);
      setDiscoveredHistory((prev) => [...prev, chosen]);
    }
  }, [distance, signalLocked, discoveredHistory]);

  // Movement handler
  const movePlayer = (deltaX: number, deltaY: number) => {
    if (signalLocked) return;
    audioSystem.playClick();
    setPlayerPos((prev) => ({
      x: Math.max(40, Math.min(960, prev.x + deltaX)),
      y: Math.max(40, Math.min(960, prev.y + deltaY)),
    }));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const step = 28;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        movePlayer(0, -step);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        movePlayer(0, step);
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        movePlayer(-step, 0);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        movePlayer(step, 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [signalLocked]);

  // Canvas radar animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let scanAngle = 0;

    const render = () => {
      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = Math.min(cx, cy) - 20;

      // Draw faint concentric rings
      ctx.strokeStyle = '#181C20';
      ctx.lineWidth = 1;
      [0.25, 0.5, 0.75, 1].forEach((r) => {
        ctx.beginPath();
        ctx.arc(cx, cy, radius * r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Axis crosshairs
      ctx.beginPath();
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.stroke();

      // Sweeping radar beam
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, scanAngle - 0.25, scanAngle);
      ctx.fillStyle = 'rgba(185, 28, 28, 0.12)';
      ctx.fill();
      ctx.restore();

      // Player marker at center
      ctx.fillStyle = '#D6D9DC';
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();

      // Relative anomaly blip calculation
      const relX = (targetPos.x - playerPos.x) / 3;
      const relY = (targetPos.y - playerPos.y) / 3;
      const blipDist = Math.sqrt(relX * relX + relY * relY);

      if (blipDist < radius) {
        // Red glowing target signal
        ctx.fillStyle = distance < 80 ? '#FF2222' : 'rgba(255, 60, 60, 0.6)';
        ctx.beginPath();
        ctx.arc(cx + relX, cy + relY, distance < 80 ? 6 : 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Random phosphor static particles
      for (let i = 0; i < 20; i++) {
        const sx = Math.random() * canvas.width;
        const sy = Math.random() * canvas.height;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      scanAngle += 0.04;
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [playerPos, targetPos, distance]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-3 sm:p-6 backdrop-blur-md font-mono select-none">
      <div className="relative w-full max-w-4xl border border-[#252A2E] bg-[#050608] shadow-[0_0_80px_rgba(0,0,0,0.98)] p-6 space-y-6">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#181C20] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="text-[10px] text-red-500 uppercase tracking-widest font-bold">
                TACTICAL RADAR EXPERIMENT // OPTIONAL RECONNAISSANCE
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-wider text-white phosphor-text">
              SIGNAL HUNT
            </h3>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1 text-xs border border-[#252A2E] text-[#9BA1A6] hover:text-white hover:border-[#7E858D] transition-colors"
          >
            ✕ EXIT HUNT
          </button>
        </div>

        {/* Telemetry Readout Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 border border-[#181C20] bg-black">
            <span className="text-[9px] text-[#7E858D] uppercase block">SIGNAL STRENGTH:</span>
            <span className="text-sm font-bold text-white tracking-widest">
              {signalStrength}% &nbsp;
              <span className="text-red-500 font-normal">
                {signalStrength > 80 ? '[LOCKED]' : signalStrength > 50 ? '[CLOSE]' : '[FAINT]'}
              </span>
            </span>
          </div>

          <div className="p-3 border border-[#181C20] bg-black">
            <span className="text-[9px] text-[#7E858D] uppercase block">ATMOSPHERIC NOISE:</span>
            <span className="text-sm font-bold text-[#9BA1A6] tracking-widest">
              {noiseLevel} dB
            </span>
          </div>

          <div className="p-3 border border-[#181C20] bg-black">
            <span className="text-[9px] text-[#7E858D] uppercase block">BEARING COMPASS:</span>
            <span className="text-sm font-bold text-white tracking-widest">
              {bearingAngle}°
            </span>
          </div>

          <div className="p-3 border border-[#181C20] bg-black">
            <span className="text-[9px] text-[#7E858D] uppercase block">CURRENT GRID:</span>
            <span className="text-sm font-bold text-red-400 font-mono tracking-widest">
              {Math.round(playerPos.x)}, {Math.round(playerPos.y)}
            </span>
          </div>
        </div>

        {/* Radar Viewport */}
        <div className="relative aspect-[16/9] max-h-80 w-full border border-[#181C20] bg-[#050608] overflow-hidden flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={640}
            height={360}
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 scanlines opacity-50 pointer-events-none" />

          {/* Radar target lock banner */}
          {signalLocked && foundFragment && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-in z-20">
              <Sigil444 size={54} interactive={false} className="text-red-600 animate-pulse" />
              <div className="space-y-1">
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-[0.25em]">
                  {foundFragment.code}
                </span>
                <p className="text-sm sm:text-base font-bold text-white phosphor-text max-w-lg">
                  {foundFragment.excerpt}
                </p>
                <p className="text-[10px] text-[#7E858D] pt-1">
                  SOURCE: {foundFragment.source}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={initRound}
                  className="px-5 py-2 border border-red-700 bg-red-950/40 text-xs text-white hover:bg-red-950"
                >
                  [ HUNT NEXT ANOMALY ]
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 border border-[#252A2E] text-xs text-[#9BA1A6] hover:text-white"
                >
                  RETURN TO BASE
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Directional Controls (Touch D-Pad for Mobile / Click for Desktop) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#181C20]">
          <div className="text-[11px] text-[#60676E] space-y-1">
            <p>CONTROLS: Use <span className="text-white">W A S D</span> or <span className="text-white">Arrow Keys</span> on desktop.</p>
            <p>On mobile / tablet, tap the directional D-Pad below to sweep the sector.</p>
          </div>

          {/* D-Pad Buttons */}
          <div className="grid grid-cols-3 gap-1.5 w-36">
            <div />
            <button
              onClick={() => movePlayer(0, -32)}
              className="h-10 border border-[#252A2E] bg-[#090C0F] text-white hover:border-[#7E858D] text-xs font-bold"
            >
              ▲
            </button>
            <div />
            <button
              onClick={() => movePlayer(-32, 0)}
              className="h-10 border border-[#252A2E] bg-[#090C0F] text-white hover:border-[#7E858D] text-xs font-bold"
            >
              ◄
            </button>
            <button
              onClick={() => movePlayer(0, 32)}
              className="h-10 border border-[#252A2E] bg-[#090C0F] text-white hover:border-[#7E858D] text-xs font-bold"
            >
              ▼
            </button>
            <button
              onClick={() => movePlayer(32, 0)}
              className="h-10 border border-[#252A2E] bg-[#090C0F] text-white hover:border-[#7E858D] text-xs font-bold"
            >
              ►
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
