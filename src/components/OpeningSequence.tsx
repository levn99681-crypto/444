import React, { useEffect, useState } from 'react';
import { audioSystem } from '../utils/audioSystem';
import { Sigil444 } from './Sigil444';

interface OpeningSequenceProps {
  onComplete: () => void;
}

export const OpeningSequence: React.FC<OpeningSequenceProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    // Step timings
    const timers = [
      setTimeout(() => {
        setStep(1); // SIGNAL DETECTED
        audioSystem.playMorseTone(444, 80);
      }, 500),
      setTimeout(() => {
        setStep(2); // 444
        audioSystem.playMorseTone(666, 100);
      }, 1600),
      setTimeout(() => {
        setStep(3); // UNKNOWN SOURCE
        audioSystem.playClick();
      }, 2800),
      setTimeout(() => {
        setStep(4); // SECOND SIGNAL: NOT DETECTED
        audioSystem.playStaticBurst(0.2, 0.05);
      }, 4000),
      setTimeout(() => {
        setStep(5); // ARCHIVE CONNECTION ESTABLISHED
        audioSystem.playSignalUnlocked();
      }, 5400),
      setTimeout(() => {
        onComplete();
      }, 6800),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-[#D6D9DC] font-mono select-none">
      {/* Scanline overlay */}
      <div className="absolute inset-0 scanlines opacity-50 pointer-events-none" />
      <div className="absolute inset-0 analog-grain opacity-30 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center space-y-6">
        
        {/* Subtle Sigil Icon appearing at step 2 */}
        {step >= 2 && (
          <div className="animate-fade-in transition-opacity duration-700">
            <Sigil444 size={70} interactive={false} className="text-white/80" />
          </div>
        )}

        <div className="min-h-[140px] flex flex-col items-center justify-center space-y-3">
          {step >= 1 && (
            <p className="text-xs sm:text-sm tracking-[0.35em] uppercase text-[#7E858D] animate-fade-in">
              SIGNAL DETECTED
            </p>
          )}

          {step >= 2 && (
            <h1 className="text-3xl sm:text-5xl font-bold tracking-[0.4em] text-white phosphor-text animate-fade-in">
              444
            </h1>
          )}

          {step >= 3 && (
            <p className="text-xs tracking-[0.3em] uppercase text-[#9BA1A6] animate-fade-in">
              UNKNOWN SOURCE
            </p>
          )}

          {step >= 4 && (
            <p className="text-xs tracking-[0.25em] uppercase text-red-500/80 animate-fade-in">
              SECOND SIGNAL: NOT DETECTED
            </p>
          )}

          {step >= 5 && (
            <div className="pt-2 border-t border-[#181C20] animate-fade-in">
              <p className="text-xs tracking-[0.3em] uppercase text-white phosphor-text">
                ARCHIVE CONNECTION ESTABLISHED
              </p>
            </div>
          )}
        </div>

        {/* Skip button for returning users */}
        <button
          onClick={onComplete}
          className="text-[10px] tracking-widest text-[#4A5057] hover:text-[#7E858D] uppercase transition-colors"
        >
          [ SKIP INITIALIZATION ]
        </button>
      </div>
    </div>
  );
};
