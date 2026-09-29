import React, { useEffect, useState } from 'react';
import { Sigil444 } from './Sigil444';
import { audioSystem } from '../utils/audioSystem';

interface FinalSignalProps {
  onReturnToArchive: () => void;
}

export const FinalSignal: React.FC<FinalSignalProps> = ({ onReturnToArchive }) => {
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    // Timed cinematic pauses
    const timers = [
      setTimeout(() => {
        setStep(1); // YOU FOUND THE SIGNAL.
        audioSystem.playMorseTone(444, 100);
      }, 1000),
      setTimeout(() => {
        setStep(2); // OR MAYBE
      }, 3000),
      setTimeout(() => {
        setStep(3); // THE SIGNAL FOUND YOU.
        audioSystem.playMorseTone(666, 120);
      }, 5000),
      setTimeout(() => {
        setStep(4); // 14 / 14
      }, 7200),
      setTimeout(() => {
        setStep(5); // SECOND SIGNAL: PENDING
        audioSystem.playStaticBurst(0.3, 0.05);
      }, 9200),
      setTimeout(() => {
        setStep(6); // 444 & Sigil
        audioSystem.playSignalUnlocked();
      }, 11200),
      setTimeout(() => {
        setStep(7); // WAIT.
      }, 13200),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-[#D6D9DC] font-mono select-none px-6 text-center">
      
      {/* Subtle Noise & Scanlines */}
      <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />
      <div className="absolute inset-0 analog-grain opacity-25 pointer-events-none" />

      <div className="relative z-10 max-w-xl space-y-6">
        
        {step >= 1 && (
          <p className="text-sm sm:text-base tracking-[0.3em] uppercase text-white font-medium phosphor-text animate-fade-in">
            YOU FOUND THE SIGNAL.
          </p>
        )}

        {step >= 2 && (
          <p className="text-xs sm:text-sm tracking-[0.35em] uppercase text-[#7E858D] animate-fade-in">
            OR MAYBE
          </p>
        )}

        {step >= 3 && (
          <p className="text-sm sm:text-base tracking-[0.3em] uppercase text-white font-medium phosphor-text animate-fade-in">
            THE SIGNAL FOUND YOU.
          </p>
        )}

        {step >= 4 && (
          <div className="py-2 border-y border-[#181C20] my-4 animate-fade-in">
            <span className="text-xs tracking-[0.4em] text-red-500 font-bold">
              14 / 14 SIGNALS RECOVERED
            </span>
          </div>
        )}

        {step >= 5 && (
          <p className="text-xs tracking-[0.3em] uppercase text-[#9BA1A6] animate-fade-in">
            SECOND SIGNAL: PENDING
          </p>
        )}

        {step >= 6 && (
          <div className="space-y-4 pt-4 animate-fade-in">
            <Sigil444 size={84} interactive={true} className="mx-auto text-white" />
            <h1 className="text-4xl sm:text-6xl font-bold tracking-[0.35em] text-white phosphor-text">
              444
            </h1>
          </div>
        )}

        {step >= 7 && (
          <div className="pt-6 animate-fade-in space-y-8">
            <p className="text-lg sm:text-xl font-bold tracking-[0.5em] text-red-500 animate-pulse">
              WAIT.
            </p>

            <div>
              <button
                onClick={onReturnToArchive}
                className="text-[10px] tracking-widest text-[#60676E] hover:text-[#D6D9DC] uppercase transition-colors"
              >
                [ RETURN TO THE ARCHIVE ]
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
