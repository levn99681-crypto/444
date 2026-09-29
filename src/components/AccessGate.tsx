import React, { useState, useEffect, useRef } from 'react';
import { audioSystem } from '../utils/audioSystem';
import { CENTRAL_CONFIG } from '../config/centralConfig';

interface AccessGateProps {
  onSuccess: () => void;
}

export const AccessGate: React.FC<AccessGateProps> = ({ onSuccess }) => {
  const [digits, setDigits] = useState<string[]>(['', '', '']);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isRejected, setIsRejected] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus keyboard input automatically
    containerRef.current?.focus();
  }, []);

  const handleDigitInput = (digit: string) => {
    if (isVerifying) return;
    if (!/^[0-9]$/.test(digit)) return;

    audioSystem.playClick();
    setIsRejected(false);
    setStatusMessage(null);

    const newDigits = [...digits];
    newDigits[currentIndex] = digit;
    setDigits(newDigits);

    if (currentIndex < 2) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // 3 digits entered - verify
      const fullInput = newDigits.join('');
      verifyInput(fullInput);
    }
  };

  const handleBackspace = () => {
    if (isVerifying) return;
    audioSystem.playClick();
    setIsRejected(false);
    setStatusMessage(null);

    const newDigits = [...digits];
    if (newDigits[currentIndex] !== '') {
      newDigits[currentIndex] = '';
      setDigits(newDigits);
    } else if (currentIndex > 0) {
      newDigits[currentIndex - 1] = '';
      setDigits(newDigits);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const verifyInput = async (inputCode: string) => {
    setIsVerifying(true);

    if (inputCode === CENTRAL_CONFIG.ACCESS_PASSWORD) {
      // Correct password: 444
      audioSystem.playMorseTone(444, 120);
      setStatusMessage('INPUT RECEIVED');
      await new Promise((r) => setTimeout(r, 600));

      setStatusMessage('VERIFYING SIGNAL…');
      await new Promise((r) => setTimeout(r, 700));

      setStatusMessage('SIGNAL MATCH');
      audioSystem.playMorseTone(888, 140);
      await new Promise((r) => setTimeout(r, 600));

      setStatusMessage('FREQUENCY LOCKED');
      await new Promise((r) => setTimeout(r, 600));

      setStatusMessage('SIGNAL ACCEPTED');
      audioSystem.playSignalUnlocked();
      await new Promise((r) => setTimeout(r, 900));

      // Persist auth
      localStorage.setItem('444_SIGNAL_AUTH', 'authenticated');
      onSuccess();
    } else {
      // Rejected
      audioSystem.playStaticBurst(0.3, 0.08);
      setIsRejected(true);
      setStatusMessage('SIGNAL REJECTED');
      await new Promise((r) => setTimeout(r, 1200));

      // Reset
      setDigits(['', '', '']);
      setCurrentIndex(0);
      setIsVerifying(false);
      setIsRejected(false);
      setStatusMessage(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key >= '0' && e.key <= '9') {
      handleDigitInput(e.key);
    } else if (e.key === 'Backspace') {
      handleBackspace();
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-[#D6D9DC] font-mono outline-none select-none cursor-default"
    >
      {/* Subtle Scanlines & CRT Noise */}
      <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />
      <div className="absolute inset-0 analog-grain opacity-25 pointer-events-none" />

      {/* Main Terminal Gate Frame */}
      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center space-y-8">
        
        {/* Header telemetry */}
        <div className="space-y-1">
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#7E858D]">
            SIGNAL DETECTED
          </p>
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#60676E]">
            IDENTITY UNKNOWN
          </p>
        </div>

        {/* Instructions */}
        <p className="text-xs tracking-[0.25em] uppercase text-[#9BA1A6]">
          THREE DIGITS REQUIRED
        </p>

        {/* 3-Digit Display: [ _ _ _ ] */}
        <div className="flex items-center justify-center gap-4 my-2">
          {digits.map((digit, idx) => {
            const isActive = currentIndex === idx && !isVerifying;
            return (
              <div
                key={idx}
                onClick={() => {
                  if (!isVerifying) setCurrentIndex(idx);
                }}
                className={`w-14 h-16 sm:w-16 sm:h-20 flex items-center justify-center border text-2xl sm:text-3xl font-bold transition-all duration-200 cursor-pointer ${
                  isRejected
                    ? 'border-red-900/80 text-red-500 bg-red-950/20'
                    : isActive
                    ? 'border-[#7E858D] text-white shadow-[0_0_15px_rgba(255,255,255,0.15)] bg-[#090C0F]'
                    : 'border-[#181C20] text-[#D6D9DC] bg-[#050608]'
                }`}
              >
                {digit !== '' ? (
                  <span>{digit}</span>
                ) : (
                  <span className={`text-[#3A4048] ${isActive ? 'animate-pulse' : ''}`}>
                    _
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Status Messages / ENTER THE FREQUENCY */}
        <div className="min-h-[2.5rem] flex items-center justify-center">
          {statusMessage ? (
            <p
              className={`text-xs tracking-[0.25em] uppercase font-semibold transition-all ${
                isRejected
                  ? 'text-red-500'
                  : 'text-white phosphor-text animate-pulse'
              }`}
            >
              {statusMessage}
            </p>
          ) : (
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#60676E]">
              ENTER THE FREQUENCY
            </p>
          )}
        </div>

        {/* Onscreen Keypad for Mobile / Mouse users */}
        <div className="w-full max-w-[240px] pt-4 border-t border-[#111519]">
          <div className="grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLR', '0', 'DEL'].map((val) => {
              const isAction = val === 'CLR' || val === 'DEL';
              return (
                <button
                  key={val}
                  type="button"
                  disabled={isVerifying}
                  onClick={() => {
                    if (val === 'CLR') {
                      audioSystem.playClick();
                      setDigits(['', '', '']);
                      setCurrentIndex(0);
                    } else if (val === 'DEL') {
                      handleBackspace();
                    } else {
                      handleDigitInput(val);
                    }
                  }}
                  className={`h-11 flex items-center justify-center border text-xs tracking-wider transition-colors disabled:opacity-30 ${
                    isAction
                      ? 'border-[#181C20] bg-[#090C0F] text-[#7E858D] hover:bg-[#111519] hover:text-[#D6D9DC]'
                      : 'border-[#181C20] bg-[#050608] text-[#D6D9DC] hover:border-[#252A2E] hover:bg-[#111519]'
                  }`}
                >
                  {val}
                </button>
              );
            })}
          </div>
        </div>

        {/* Subtle sound toggle on access gate */}
        <div className="pt-2">
          <button
            onClick={() => audioSystem.toggleMute()}
            className="text-[10px] tracking-widest text-[#60676E] hover:text-[#9BA1A6] uppercase transition-colors"
          >
            SOUND: {audioSystem.getMuted() ? 'OFF' : 'ON'}
          </button>
        </div>

      </div>
    </div>
  );
};
