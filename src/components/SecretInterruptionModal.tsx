import React, { useEffect, useState } from 'react';

export const SecretInterruptionModal: React.FC = () => {
  const [interruption, setInterruption] = useState<string | null>(null);
  const [glitchActive, setGlitchActive] = useState<boolean>(false);

  useEffect(() => {
    const handleInterrupt = (e: Event) => {
      const custom = e as CustomEvent<{ message: string }>;
      setInterruption(custom.detail?.message || "SIGNAL INTERRUPTION // SECOND SIGNAL: PENDING // WAIT.");
      setGlitchActive(true);

      const t1 = setTimeout(() => setGlitchActive(false), 300);
      const t2 = setTimeout(() => setInterruption(null), 3500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    };

    window.addEventListener('444_SIGNAL_INTERRUPT', handleInterrupt);
    return () => window.removeEventListener('444_SIGNAL_INTERRUPT', handleInterrupt);
  }, []);

  if (!interruption) return null;

  return (
    <div
      onClick={() => setInterruption(null)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md cursor-pointer select-none transition-opacity duration-300"
    >
      {/* Scanline overlay */}
      <div className="absolute inset-0 scanlines opacity-60 pointer-events-none" />

      {/* Analog noise layer */}
      <div className={`absolute inset-0 bg-white/5 pointer-events-none ${glitchActive ? 'animate-glitch' : ''}`} />

      <div className="relative max-w-lg mx-6 p-8 border border-[#252A2E] bg-[#050608]/95 shadow-[0_0_50px_rgba(0,0,0,0.9)] text-center">
        {/* Red warning indicator */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-red-800 animate-ping" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-red-500/80 font-mono">
            SIGNAL ANOMALY DETECTED
          </span>
        </div>

        <div className="space-y-3 font-mono text-sm tracking-wider text-[#D6D9DC]">
          <p className="text-xs text-[#7E858D] uppercase tracking-widest">
            INTERCEPT // LOG 04:44
          </p>
          <div className="py-2 border-y border-[#181C20] my-3">
            <p className="text-base sm:text-lg text-white font-medium phosphor-text">
              {interruption}
            </p>
          </div>
          <p className="text-[11px] text-[#7E858D] tracking-widest animate-pulse">
            [ TAP TO RE-ESTABLISH CARRIER FREQUENCY ]
          </p>
        </div>
      </div>
    </div>
  );
};
