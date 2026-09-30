import React, { useState, useRef } from 'react';
import { audioSystem } from '../../utils/audioSystem';
import { CENTRAL_CONFIG } from '../../config/centralConfig';
import { Sigil444 } from '../Sigil444';
import { validatePuzzleAnswer } from '../../utils/progressStore';
import bunkerImg from '../../assets/images/archive_abandoned_facility_1790568772474.jpg';
import radarImg from '../../assets/images/archive_radar_sigil_1790568781921.jpg';

interface PuzzleComponentProps {
  puzzleId?: number;
  onSolve: (puzzleId: number) => void;
  isSolved: boolean;
}

// -------------------------------------------------------------
// PUZZLE 01: THE FIRST SIGNAL (Pattern Recognition: 4 44 444 4444)
// -------------------------------------------------------------
export const Puzzle01FirstSignal: React.FC<PuzzleComponentProps> = ({ onSolve, isSolved }) => {
  const [inputVal, setInputVal] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePuzzleAnswer(1, inputVal)) {
      audioSystem.playSignalUnlocked();
      onSolve(1);
    } else {
      audioSystem.playStaticBurst(0.2, 0.05);
      setError(true);
      setTimeout(() => setError(false), 1200);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border border-[#181C20] bg-black/60 font-mono text-xs space-y-2">
        <p className="text-[#7E858D]">TRANSMISSION FRAGMENT // OBSERVATION:</p>
        <p className="text-xl sm:text-2xl text-white tracking-[0.3em] phosphor-text">
          4 &nbsp; 44 &nbsp; 444 &nbsp; <span className="text-red-500 animate-pulse">[ ? ]</span>
        </p>
        <p className="text-[11px] text-[#60676E] pt-2">
          &quot;The harmonic series expands by iteration. Follow the cadence of the broadcast.&quot;
        </p>
      </div>

      {!isSolved ? (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="ENTER THE SEQUENCE..."
            className={`flex-1 bg-black border p-2.5 text-xs text-white uppercase tracking-wider outline-none ${
              error ? 'border-red-600 bg-red-950/20' : 'border-[#181C20] focus:border-[#7E858D]'
            }`}
          />
          <button
            type="submit"
            className="px-5 py-2.5 border border-[#252A2E] bg-[#090C0F] text-xs text-white hover:border-[#7E858D] cursor-pointer"
          >
            CONFIRM CADENCE
          </button>
        </form>
      ) : (
        <div className="p-3 border border-red-900/60 bg-red-950/20 text-xs text-white font-mono flex items-center justify-between">
          <span>SIGNAL 01 RECOVERED: 4444 (SEQUENCE LOCKED)</span>
          <span className="text-red-400 font-bold">SOLVED</span>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// PUZZLE 02: MORSE TRANSMISSION
// -------------------------------------------------------------
export const Puzzle02Morse: React.FC<PuzzleComponentProps> = ({ onSolve, isSolved }) => {
  const [inputVal, setInputVal] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<'NORMAL' | 'SLOW'>('NORMAL');
  const [activeChar, setActiveChar] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Morse for "SIGNAL": ··· ·· --· -. ·- ·-··
  const morsePattern = '... .. --. -. .- .-..';

  const playMorse = async () => {
    setIsPlaying(true);
    const speedMult = playbackSpeed === 'SLOW' ? 1.8 : 1.0;
    const chars = morsePattern.split('');

    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      setActiveChar(ch);
      if (ch === '.') {
        await audioSystem.playMorseTone(720, Math.round(80 * speedMult));
        await new Promise((r) => setTimeout(r, Math.round(60 * speedMult)));
      } else if (ch === '-') {
        await audioSystem.playMorseTone(720, Math.round(220 * speedMult));
        await new Promise((r) => setTimeout(r, Math.round(60 * speedMult)));
      } else {
        await new Promise((r) => setTimeout(r, Math.round(200 * speedMult)));
      }
      setActiveChar(null);
    }
    setIsPlaying(false);
  };

  const handleCopyMorse = () => {
    navigator.clipboard?.writeText('··· ·· --· -. ·- ·-··');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePuzzleAnswer(2, inputVal)) {
      audioSystem.playSignalUnlocked();
      onSolve(2);
    } else {
      audioSystem.playStaticBurst(0.2, 0.05);
      setError(true);
      setTimeout(() => setError(false), 1200);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border border-[#181C20] bg-black/60 font-mono text-xs space-y-3">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[#7E858D]">SHORTWAVE INTERCEPT:</span>
            {activeChar && (
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPlaybackSpeed((s) => (s === 'NORMAL' ? 'SLOW' : 'NORMAL'))}
              className="px-2 py-1 border border-[#181C20] text-[10px] text-[#7E858D] hover:text-white"
            >
              SPEED: {playbackSpeed}
            </button>
            <button
              onClick={playMorse}
              disabled={isPlaying}
              className="px-3 py-1 border border-[#252A2E] bg-[#090C0F] text-[10px] text-white hover:border-[#7E858D]"
            >
              {isPlaying ? 'TRANSMITTING...' : 'PLAY MORSE AUDIO'}
            </button>
          </div>
        </div>

        <div className="p-3 border border-[#181C20] bg-black text-center flex flex-col items-center justify-center space-y-2">
          <p className="text-lg tracking-[0.4em] text-white phosphor-text">
            ··· &nbsp; ·· &nbsp; --· &nbsp; -. &nbsp; ·- &nbsp; ·-··
          </p>
          <button
            onClick={handleCopyMorse}
            className="text-[9px] text-[#60676E] hover:text-white"
          >
            {copied ? '[ COPIED MORSE TO CLIPBOARD ]' : '[ COPY MORSE STRING ]'}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowKey(!showKey)}
          className="text-[10px] text-[#60676E] hover:text-[#9BA1A6] underline"
        >
          {showKey ? 'HIDE MORSE CHART' : 'VIEW MORSE REFERENCE CHART'}
        </button>

        {showKey && (
          <div className="p-2 border border-[#111519] bg-[#050608] text-[10px] text-[#7E858D] grid grid-cols-4 gap-1">
            <span>S: ···</span>
            <span>I: ··</span>
            <span>G: --·</span>
            <span>N: -.</span>
            <span>A: ·-</span>
            <span>L: ·-··</span>
            <span>4: ····-</span>
            <span>E: ·</span>
          </div>
        )}
      </div>

      {!isSolved ? (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="DECODED MESSAGE (e.g. WORD)..."
            className={`flex-1 bg-black border p-2.5 text-xs text-white uppercase tracking-wider outline-none ${
              error ? 'border-red-600 bg-red-950/20' : 'border-[#181C20] focus:border-[#7E858D]'
            }`}
          />
          <button
            type="submit"
            className="px-5 py-2.5 border border-[#252A2E] bg-[#090C0F] text-xs text-white hover:border-[#7E858D]"
          >
            VERIFY DECODE
          </button>
        </form>
      ) : (
        <div className="p-3 border border-red-900/60 bg-red-950/20 text-xs text-white font-mono flex items-center justify-between">
          <span>SIGNAL 02 RECOVERED: &quot;SIGNAL&quot; DECODED</span>
          <span className="text-red-400 font-bold">SOLVED</span>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// PUZZLE 03: THE PHOTOGRAPH (Inspect Archive 017 to find SECTOR B-4)
// -------------------------------------------------------------
export const Puzzle03Photograph: React.FC<PuzzleComponentProps> = ({ onSolve, isSolved }) => {
  const [inputVal, setInputVal] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePuzzleAnswer(3, inputVal)) {
      audioSystem.playSignalUnlocked();
      onSolve(3);
    } else {
      audioSystem.playStaticBurst(0.2, 0.05);
      setError(true);
      setTimeout(() => setError(false), 1200);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border border-[#181C20] bg-black/60 font-mono text-xs space-y-3">
        <p className="text-[#7E858D]">
          ARCHIVAL RECONNAISSANCE REQUIRED:
        </p>
        <p className="text-[#D6D9DC] leading-relaxed">
          Examine the classified photographs inside the <span className="text-white font-bold">ARCHIVE</span> section. Specifically inspect <span className="text-white font-semibold">ARCHIVE // 017</span> (The Research Facility Complex at 62.4835° N). What sector designation is inscribed upon the concrete cornerstone?
        </p>

        <div className="relative aspect-video max-w-sm mx-auto border border-[#181C20] overflow-hidden">
          <img
            src={bunkerImg}
            alt="Research Facility Bunker Archive 017"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover grayscale contrast-125"
          />
          <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />
          <div className="absolute bottom-2 right-2 text-[9px] bg-black/80 px-2 py-0.5 text-[#D6D9DC]">
            ARCHIVE // 017
          </div>
        </div>
      </div>

      {!isSolved ? (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="SECTOR DESIGNATION (e.g. SECTOR ...)..."
            className={`flex-1 bg-black border p-2.5 text-xs text-white uppercase tracking-wider outline-none ${
              error ? 'border-red-600 bg-red-950/20' : 'border-[#181C20] focus:border-[#7E858D]'
            }`}
          />
          <button
            type="submit"
            className="px-5 py-2.5 border border-[#252A2E] bg-[#090C0F] text-xs text-white hover:border-[#7E858D]"
          >
            CONFIRM SECTOR
          </button>
        </form>
      ) : (
        <div className="p-3 border border-red-900/60 bg-red-950/20 text-xs text-white font-mono flex items-center justify-between">
          <span>SIGNAL 03 RECOVERED: SECTOR B-4 IDENTIFIED</span>
          <span className="text-red-400 font-bold">SOLVED</span>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// PUZZLE 04: CAESAR CIPHER (Shift 4 for 444)
// Cipher: "JVIUYIRGC" -> "FREQUENCY" or "WKLUG VLJQDO" -> "THIRD SIGNAL"
// -------------------------------------------------------------
export const Puzzle04Caesar: React.FC<PuzzleComponentProps> = ({ onSolve, isSolved }) => {
  const [inputVal, setInputVal] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePuzzleAnswer(4, inputVal)) {
      audioSystem.playSignalUnlocked();
      onSolve(4);
    } else {
      audioSystem.playStaticBurst(0.2, 0.05);
      setError(true);
      setTimeout(() => setError(false), 1200);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border border-[#181C20] bg-black/60 font-mono text-xs space-y-3">
        <p className="text-[#7E858D]">INTERCEPTED CIPHERTEXT (SHIFT KEY = 4):</p>
        <div className="p-3 border border-[#181C20] bg-black text-center">
          <p className="text-xl tracking-[0.3em] text-white phosphor-text">
            J V I U Y I R G C
          </p>
        </div>
        <p className="text-[11px] text-[#60676E]">
          &quot;Shifted backwards by 4 positions in the classical Latin alphabet. What was the intercepted transmission?&quot;
        </p>
      </div>

      {!isSolved ? (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="DECRYPTED WORD..."
            className={`flex-1 bg-black border p-2.5 text-xs text-white uppercase tracking-wider outline-none ${
              error ? 'border-red-600 bg-red-950/20' : 'border-[#181C20] focus:border-[#7E858D]'
            }`}
          />
          <button
            type="submit"
            className="px-5 py-2.5 border border-[#252A2E] bg-[#090C0F] text-xs text-white hover:border-[#7E858D]"
          >
            SUBMIT PLAINTEXT
          </button>
        </form>
      ) : (
        <div className="p-3 border border-red-900/60 bg-red-950/20 text-xs text-white font-mono flex items-center justify-between">
          <span>SIGNAL 04 RECOVERED: &quot;FREQUENCY&quot; CIPHER BROKEN</span>
          <span className="text-red-400 font-bold">SOLVED</span>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// PUZZLE 05: THE MISSING ANSWER (Manual Verification Puzzle)
// -------------------------------------------------------------
export const Puzzle05MissingAnswer: React.FC<PuzzleComponentProps> = ({ onSolve, isSolved }) => {
  const [inputVal, setInputVal] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePuzzleAnswer(5, inputVal)) {
      audioSystem.playSignalUnlocked();
      onSolve(5);
    } else {
      audioSystem.playStaticBurst(0.2, 0.05);
      setError(true);
      setTimeout(() => setError(false), 1200);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border border-[#181C20] bg-black/60 font-mono text-xs space-y-3">
        <div className="p-3 border-l-2 border-red-800 bg-[#090C0F]">
          <p className="text-xs text-white font-semibold tracking-wider">
            THIS ANSWER WAS NEVER ARCHIVED.
          </p>
          <p className="text-[11px] text-[#9BA1A6] mt-1">
            YOU WILL NEED TO FIND SOMEONE WHO KNOWS IT.
          </p>
        </div>
        <p className="text-[11px] text-[#60676E] leading-relaxed">
          The administrator or project observers transmit this authorization key to select contacts through the official communication channels.
        </p>
      </div>

      {!isSolved ? (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="ENTER OBSERVER CLEARANCE KEY..."
            className={`flex-1 bg-black border p-2.5 text-xs text-white uppercase tracking-wider outline-none ${
              error ? 'border-red-600 bg-red-950/20' : 'border-[#181C20] focus:border-[#7E858D]'
            }`}
          />
          <button
            type="submit"
            className="px-5 py-2.5 border border-[#252A2E] bg-[#090C0F] text-xs text-white hover:border-[#7E858D]"
          >
            AUTHENTICATE KEY
          </button>
        </form>
      ) : (
        <div className="p-3 border border-red-900/60 bg-red-950/20 text-xs text-white font-mono flex items-center justify-between">
          <span>SIGNAL 05 RECOVERED: OBSERVER CLEARANCE CONFIRMED</span>
          <span className="text-red-400 font-bold">SOLVED</span>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// PUZZLE 06: AUDIO TRANSMISSION
// -------------------------------------------------------------
export const Puzzle06AudioTransmission: React.FC<PuzzleComponentProps> = ({ onSolve, isSolved }) => {
  const [inputVal, setInputVal] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSlow, setIsSlow] = useState(false);
  const [isReverse, setIsReverse] = useState(false);
  const [activeFreq, setActiveFreq] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const isCancelledRef = useRef<boolean>(false);

  const baseTones = [444, 444, 444, 888];

  const playAudioSequence = async () => {
    if (isPlaying) {
      isCancelledRef.current = true;
      setIsPlaying(false);
      setActiveFreq(null);
      return;
    }

    isCancelledRef.current = false;
    setIsPlaying(true);

    const tonesToPlay = isReverse ? [...baseTones].reverse() : [...baseTones];
    const duration = isSlow ? 440 : 220;
    const gap = isSlow ? 200 : 120;

    for (const freq of tonesToPlay) {
      if (isCancelledRef.current) break;
      setActiveFreq(freq);
      await audioSystem.playMorseTone(freq, duration);
      await new Promise((r) => setTimeout(r, gap));
      setActiveFreq(null);
    }

    setIsPlaying(false);
  };

  const handleReplay = () => {
    isCancelledRef.current = true;
    setTimeout(() => {
      playAudioSequence();
    }, 150);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePuzzleAnswer(6, inputVal)) {
      audioSystem.playSignalUnlocked();
      onSolve(6);
    } else {
      audioSystem.playStaticBurst(0.2, 0.05);
      setError(true);
      setTimeout(() => setError(false), 1200);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border border-[#181C20] bg-black/60 font-mono text-xs space-y-4">
        
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#181C20] pb-2">
          <span className="text-[#7E858D] flex items-center gap-2">
            <span>SHORTWAVE AUDIO LABORATORY:</span>
            {activeFreq && (
              <span className="text-red-500 font-bold animate-pulse">
                TONE: {activeFreq} Hz
              </span>
            )}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsSlow(!isSlow)}
              className={`px-2 py-0.5 text-[9px] border transition-colors ${
                isSlow ? 'border-red-600 text-white bg-red-950/40' : 'border-[#181C20] text-[#7E858D]'
              }`}
            >
              SLOW: {isSlow ? '0.5x' : '1.0x'}
            </button>
            <button
              onClick={() => setIsReverse(!isReverse)}
              className={`px-2 py-0.5 text-[9px] border transition-colors ${
                isReverse ? 'border-red-600 text-white bg-red-950/40' : 'border-[#181C20] text-[#7E858D]'
              }`}
            >
              REVERSE: {isReverse ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={handleReplay}
              className="px-2.5 py-1 text-[10px] border border-[#252A2E] text-[#9BA1A6] hover:text-white"
            >
              REPLAY
            </button>
            <button
              onClick={playAudioSequence}
              className="px-3 py-1 border border-[#252A2E] bg-[#090C0F] text-[10px] text-white hover:border-[#7E858D]"
            >
              {isPlaying ? 'PAUSE' : 'PLAY'}
            </button>
          </div>
        </div>

        {/* Visual Frequency Level Meter */}
        <div className="p-3 border border-[#181C20] bg-black flex items-center justify-center gap-3">
          {baseTones.map((t, idx) => (
            <div
              key={idx}
              className={`w-12 h-16 border flex flex-col items-center justify-end p-1 transition-all ${
                activeFreq === t
                  ? 'border-red-600 bg-red-950/40 shadow-[0_0_15px_rgba(255,0,0,0.4)]'
                  : 'border-[#181C20] bg-[#050608]'
              }`}
            >
              <div
                className={`w-full bg-red-600 transition-all ${
                  activeFreq === t ? 'h-full' : 'h-1.5 opacity-30'
                }`}
              />
              <span className="text-[8px] text-[#60676E] mt-1">{t} Hz</span>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-[#60676E] leading-relaxed">
          Listen closely to the audio transmission tone bursts. At what base resonance frequency (in MHz or Hz) does the carrier pulse oscillate?
        </p>
      </div>

      {!isSolved ? (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="FREQUENCY (e.g. 444.4 MHz)..."
            className={`flex-1 bg-black border p-2.5 text-xs text-white uppercase tracking-wider outline-none ${
              error ? 'border-red-600 bg-red-950/20' : 'border-[#181C20] focus:border-[#7E858D]'
            }`}
          />
          <button
            type="submit"
            className="px-5 py-2.5 border border-[#252A2E] bg-[#090C0F] text-xs text-white hover:border-[#7E858D]"
          >
            VERIFY HARMONIC
          </button>
        </form>
      ) : (
        <div className="p-3 border border-red-900/60 bg-red-950/20 text-xs text-white font-mono flex items-center justify-between">
          <span>SIGNAL 06 RECOVERED: 444.40 MHz LOCKED</span>
          <span className="text-red-400 font-bold">SOLVED</span>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// PUZZLE 07: THE MAP (62.4835 N, 34.2567 E)
// -------------------------------------------------------------
export const Puzzle07MapPuzzle: React.FC<PuzzleComponentProps> = ({ onSolve, isSolved }) => {
  const [inputVal, setInputVal] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePuzzleAnswer(7, inputVal)) {
      audioSystem.playSignalUnlocked();
      onSolve(7);
    } else {
      audioSystem.playStaticBurst(0.2, 0.05);
      setError(true);
      setTimeout(() => setError(false), 1200);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border border-[#181C20] bg-black/60 font-mono text-xs space-y-3">
        <p className="text-[#7E858D]">CARTOGRAPHIC VECTOR ANOMALY:</p>
        <p className="text-[#D6D9DC]">
          Navigate the <span className="text-white font-bold">MAP</span> section to locate the facility epicenter. Enter the coordinates of the anomalous broadcast bunker:
        </p>
      </div>

      {!isSolved ? (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="COORDINATES (e.g. 62.4835 N, 34.2567 E)..."
            className={`flex-1 bg-black border p-2.5 text-xs text-white uppercase tracking-wider outline-none ${
              error ? 'border-red-600 bg-red-950/20' : 'border-[#181C20] focus:border-[#7E858D]'
            }`}
          />
          <button
            type="submit"
            className="px-5 py-2.5 border border-[#252A2E] bg-[#090C0F] text-xs text-white hover:border-[#7E858D]"
          >
            CONFIRM VECTOR
          </button>
        </form>
      ) : (
        <div className="p-3 border border-red-900/60 bg-red-950/20 text-xs text-white font-mono flex items-center justify-between">
          <span>SIGNAL 07 RECOVERED: 62.4835° N, 34.2567° E VERIFIED</span>
          <span className="text-red-400 font-bold">SOLVED</span>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// PUZZLE 08: IMAGE MANIPULATION (Forensic Contrast Sliders)
// -------------------------------------------------------------
export const Puzzle08ImageForensics: React.FC<PuzzleComponentProps> = ({ onSolve, isSolved }) => {
  const [brightness, setBrightness] = useState<number>(10);
  const [contrast, setContrast] = useState<number>(40);
  const [exposure, setExposure] = useState<number>(0);
  const [inputVal, setInputVal] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  // Hidden text revealed when brightness > 70 and contrast > 140
  const isRevealed = brightness >= 75 && contrast >= 140;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePuzzleAnswer(8, inputVal)) {
      audioSystem.playSignalUnlocked();
      onSolve(8);
    } else {
      audioSystem.playStaticBurst(0.2, 0.05);
      setError(true);
      setTimeout(() => setError(false), 1200);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border border-[#181C20] bg-black/60 font-mono text-xs space-y-4">
        <p className="text-[#7E858D]">FORENSIC IMAGE ENHANCEMENT SUITE:</p>
        
        {/* Dark viewport */}
        <div className="relative aspect-[16/8] border border-[#181C20] bg-black flex items-center justify-center overflow-hidden">
          <div
            className="w-full h-full flex items-center justify-center transition-all duration-150"
            style={{
              filter: `brightness(${brightness}%) contrast(${contrast}%)`,
              opacity: (brightness + exposure) / 100,
            }}
          >
            <div className="text-center space-y-2 select-none">
              <Sigil444 size={48} interactive={false} className="mx-auto text-white/90" />
              <p className="text-sm sm:text-base font-bold tracking-[0.3em] text-white phosphor-text">
                SHADOW TRANSMITTER
              </p>
              <p className="text-[10px] text-[#9BA1A6] tracking-widest">
                ARCHIVE RECOVERY // 04:44:12
              </p>
            </div>
          </div>

          <div className="absolute inset-0 scanlines opacity-50 pointer-events-none" />
          
          <div className="absolute top-2 left-2 text-[9px] bg-black/70 px-1.5 py-0.5 text-[#7E858D]">
            NEG-SCAN // 008
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-[10px] text-[#7E858D]">
          <div>
            <label className="flex justify-between">
              <span>BRIGHTNESS:</span>
              <span>{brightness}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="150"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full accent-white"
            />
          </div>

          <div>
            <label className="flex justify-between">
              <span>CONTRAST:</span>
              <span>{contrast}%</span>
            </label>
            <input
              type="range"
              min="20"
              max="250"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-full accent-white"
            />
          </div>

          <div>
            <label className="flex justify-between">
              <span>EXPOSURE:</span>
              <span>{exposure}</span>
            </label>
            <input
              type="range"
              min="-50"
              max="50"
              value={exposure}
              onChange={(e) => setExposure(Number(e.target.value))}
              className="w-full accent-white"
            />
          </div>
        </div>

        {isRevealed && (
          <p className="text-[11px] text-red-400 font-semibold animate-pulse">
            INSCRIPTION DETECTED IN FILM LAYER: &quot;SHADOW TRANSMITTER&quot;
          </p>
        )}
      </div>

      {!isSolved ? (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="REVEALED TEXT PHRASE..."
            className={`flex-1 bg-black border p-2.5 text-xs text-white uppercase tracking-wider outline-none ${
              error ? 'border-red-600 bg-red-950/20' : 'border-[#181C20] focus:border-[#7E858D]'
            }`}
          />
          <button
            type="submit"
            className="px-5 py-2.5 border border-[#252A2E] bg-[#090C0F] text-xs text-white hover:border-[#7E858D]"
          >
            CONFIRM REVELATION
          </button>
        </form>
      ) : (
        <div className="p-3 border border-red-900/60 bg-red-950/20 text-xs text-white font-mono flex items-center justify-between">
          <span>SIGNAL 08 RECOVERED: SHADOW TRANSMITTER UNCOVERED</span>
          <span className="text-red-400 font-bold">SOLVED</span>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// PUZZLE 09: SEQUENCE (Chronological Order: 04:10, 04:30, 04:44, 04:58)
// -------------------------------------------------------------
export const Puzzle09Sequence: React.FC<PuzzleComponentProps> = ({ onSolve, isSolved }) => {
  const [items, setItems] = useState([
    { id: '3', label: 'ARCHIVE 017: Bunker Intercept', time: '04:44:12 UTC', rank: 3 },
    { id: '1', label: 'ARCHIVE 008: Degraded Polaroid', time: '04:10:00 UTC', rank: 1 },
    { id: '4', label: 'ARCHIVE 020: Canopy Beacon', time: '04:58:00 UTC', rank: 4 },
    { id: '2', label: 'ARCHIVE 001: Access Road Dashcam', time: '04:30:00 UTC', rank: 2 },
  ]);

  const moveItem = (index: number, direction: 'UP' | 'DOWN') => {
    audioSystem.playClick();
    const newItems = [...items];
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    setItems(newItems);
  };

  const handleVerify = () => {
    // Check if sorted 1, 2, 3, 4
    const isCorrect = items.every((item, i) => item.rank === i + 1);
    if (isCorrect) {
      audioSystem.playSignalUnlocked();
      onSolve(9);
    } else {
      audioSystem.playStaticBurst(0.2, 0.05);
      window.dispatchEvent(
        new CustomEvent('444_SIGNAL_INTERRUPT', {
          detail: { message: 'TEMPORAL MISALIGNMENT // CHECK ARCHIVE TIMESTAMPS' },
        })
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border border-[#181C20] bg-black/60 font-mono text-xs space-y-3">
        <p className="text-[#7E858D]">CHRONOLOGICAL FORENSICS:</p>
        <p className="text-[#D6D9DC]">
          Reconstruct the true temporal progression of recovered surveillance records (from earliest morning to latest):
        </p>

        <div className="space-y-2 pt-2">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="p-3 border border-[#181C20] bg-[#050608] flex items-center justify-between"
            >
              <div>
                <span className="text-white font-medium">{item.label}</span>
                <span className="block text-[10px] text-red-400 font-mono">{item.time}</span>
              </div>
              {!isSolved && (
                <div className="flex gap-1">
                  <button
                    onClick={() => moveItem(idx, 'UP')}
                    disabled={idx === 0}
                    className="px-2 py-1 border border-[#252A2E] text-[10px] text-[#7E858D] hover:text-white disabled:opacity-30"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveItem(idx, 'DOWN')}
                    disabled={idx === items.length - 1}
                    className="px-2 py-1 border border-[#252A2E] text-[10px] text-[#7E858D] hover:text-white disabled:opacity-30"
                  >
                    ▼
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {!isSolved ? (
        <button
          onClick={handleVerify}
          className="w-full py-3 border border-[#252A2E] bg-[#090C0F] text-xs uppercase tracking-widest text-white hover:border-[#7E858D]"
        >
          LOCK TEMPORAL ORDER
        </button>
      ) : (
        <div className="p-3 border border-red-900/60 bg-red-950/20 text-xs text-white font-mono flex items-center justify-between">
          <span>SIGNAL 09 RECOVERED: TIMELINE COHERENCE ESTABLISHED</span>
          <span className="text-red-400 font-bold">SOLVED</span>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// PUZZLE 10: SYMBOL DECONSTRUCTION (Assemble 4 rotating glyph pieces)
// -------------------------------------------------------------
export const Puzzle10SymbolDeconstruction: React.FC<PuzzleComponentProps> = ({ onSolve, isSolved }) => {
  // Rotations for 4 quadrants (target is 0 degrees for all)
  const [rotations, setRotations] = useState<number[]>([90, 180, 270, 90]);

  const rotatePiece = (idx: number) => {
    audioSystem.playClick();
    const updated = [...rotations];
    updated[idx] = (updated[idx] + 90) % 360;
    setRotations(updated);

    if (updated.every((r) => r === 0)) {
      audioSystem.playSignalUnlocked();
      onSolve(10);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border border-[#181C20] bg-black/60 font-mono text-xs space-y-4 text-center">
        <p className="text-[#7E858D]">GEOMETRIC ALIGNMENT MATRIX:</p>
        <p className="text-[#60676E]">
          Rotate each quadrant until the sacred 444 sigil forms unbroken alignment.
        </p>

        {/* 4 Quadrants Matrix */}
        <div className="w-56 h-56 mx-auto grid grid-cols-2 grid-rows-2 gap-1 p-2 border border-[#252A2E] bg-black">
          {[0, 1, 2, 3].map((idx) => {
            const isTarget = isSolved || rotations[idx] === 0;
            return (
              <div
                key={idx}
                onClick={() => !isSolved && rotatePiece(idx)}
                className={`relative flex items-center justify-center border transition-all duration-300 cursor-pointer ${
                  isTarget ? 'border-red-900/60 bg-[#090C0F]' : 'border-[#181C20] bg-[#050608] hover:border-[#3A4048]'
                }`}
              >
                <div
                  className="transition-transform duration-300"
                  style={{ transform: `rotate(${isSolved ? 0 : rotations[idx]}deg)` }}
                >
                  <Sigil444 size={44} interactive={false} />
                </div>
                {!isSolved && (
                  <span className="absolute bottom-1 right-1 text-[8px] text-[#4A5057]">
                    {rotations[idx]}°
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {isSolved ? (
        <div className="p-3 border border-red-900/60 bg-red-950/20 text-xs text-white font-mono flex items-center justify-between">
          <span>SIGNAL 10 RECOVERED: PATTERN RECOGNIZED</span>
          <span className="text-red-400 font-bold">SOLVED</span>
        </div>
      ) : (
        <p className="text-center text-[10px] text-[#7E858D]">
          [ TAP EACH QUADRANT TO ROTATE 90° ]
        </p>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// PUZZLE 11: HIDDEN TEXT (Steganography: Every 4th word)
// Text: "The signal was SEEK hidden under deep THE soil where the DEEP broadcast echoed through FREQUENCY"
// Words: SEEK THE DEEP FREQUENCY
// -------------------------------------------------------------
export const Puzzle11HiddenText: React.FC<PuzzleComponentProps> = ({ onSolve, isSolved }) => {
  const [inputVal, setInputVal] = useState('');
  const [error, setError] = useState(false);

  const rawDocument = "Initial surveillance confirms SEEK anomalous audio across THE northern sector through DEEP coniferous pines with FREQUENCY stability.";
  // Every 4th word: SEEK · THE · DEEP · FREQUENCY

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePuzzleAnswer(11, inputVal)) {
      audioSystem.playSignalUnlocked();
      onSolve(11);
    } else {
      audioSystem.playStaticBurst(0.2, 0.05);
      setError(true);
      setTimeout(() => setError(false), 1200);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border border-[#181C20] bg-black/60 font-mono text-xs space-y-3">
        <p className="text-[#7E858D]">RECOVERED FIELD MEMO (STEGANOGRAPHIC CADENCE):</p>
        <div className="p-4 border border-[#181C20] bg-black text-[#D6D9DC] leading-relaxed text-sm">
          &quot;{rawDocument}&quot;
        </div>
        <p className="text-[11px] text-[#60676E]">
          &quot;In this archive, the sacred interval is always four. Extract the hidden directive.&quot;
        </p>
      </div>

      {!isSolved ? (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="ENTER EXTRACTED DIRECTIVE..."
            className={`flex-1 bg-black border p-2.5 text-xs text-white uppercase tracking-wider outline-none ${
              error ? 'border-red-600 bg-red-950/20' : 'border-[#181C20] focus:border-[#7E858D]'
            }`}
          />
          <button
            type="submit"
            className="px-5 py-2.5 border border-[#252A2E] bg-[#090C0F] text-xs text-white hover:border-[#7E858D]"
          >
            VALIDATE DIRECTIVE
          </button>
        </form>
      ) : (
        <div className="p-3 border border-red-900/60 bg-red-950/20 text-xs text-white font-mono flex items-center justify-between">
          <span>SIGNAL 11 RECOVERED: &quot;SEEK THE DEEP FREQUENCY&quot;</span>
          <span className="text-red-400 font-bold">SOLVED</span>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// PUZZLE 12: MINI GAME (Analog Frequency Tuning Device)
// User adjusts tuning dial until frequency = 444.4 MHz
// -------------------------------------------------------------
export const Puzzle12MiniGame: React.FC<PuzzleComponentProps> = ({ onSolve, isSolved }) => {
  const [freqDial, setFreqDial] = useState<number>(420.0);
  const isLocked = Math.abs(freqDial - 444.4) < 0.3;

  const handleTune = (val: number) => {
    setFreqDial(val);
    if (Math.abs(val - 444.4) < 0.3 && !isSolved) {
      audioSystem.playSignalUnlocked();
      onSolve(12);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-5 border border-[#181C20] bg-black/60 font-mono text-xs space-y-4 text-center">
        <p className="text-[#7E858D]">ANALOG FREQUENCY TUNER // STATION RX-44:</p>
        
        {/* Needle Display */}
        <div className="relative w-full max-w-md mx-auto h-24 border border-[#252A2E] bg-[#050608] flex flex-col justify-between p-3 overflow-hidden">
          <div className="flex justify-between text-[10px] text-[#60676E] border-b border-[#111519] pb-1">
            <span>400.0 MHz</span>
            <span>444.4 MHz</span>
            <span>480.0 MHz</span>
          </div>

          {/* Tuner dial scale */}
          <div className="relative w-full h-8 flex items-center">
            {/* Target line */}
            <div className="absolute left-[55.5%] top-0 bottom-0 w-[2px] bg-red-700/80" />

            {/* Current Needle */}
            <div
              className={`absolute top-0 bottom-0 w-[3px] transition-all duration-75 ${
                isLocked ? 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]' : 'bg-[#7E858D]'
              }`}
              style={{
                left: `${((freqDial - 400) / 80) * 100}%`,
              }}
            />
          </div>

          <div className="text-center font-bold tracking-widest text-sm text-white">
            {freqDial.toFixed(1)} MHz &nbsp;
            {isLocked ? <span className="text-red-500 animate-pulse">[ SIGNAL LOCKED ]</span> : <span className="text-[#60676E]">[ STATIC NOISE ]</span>}
          </div>
        </div>

        {/* Dial Slider */}
        <div className="max-w-md mx-auto space-y-2">
          <input
            type="range"
            min="400"
            max="480"
            step="0.1"
            value={freqDial}
            disabled={isSolved}
            onChange={(e) => handleTune(Number(e.target.value))}
            className="w-full accent-white h-2 bg-[#181C20] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#60676E]">
            <span>◄ LOWER</span>
            <span>TUNE TO HARMONIC</span>
            <span>HIGHER ►</span>
          </div>
        </div>
      </div>

      {isSolved && (
        <div className="p-3 border border-red-900/60 bg-red-950/20 text-xs text-white font-mono flex items-center justify-between">
          <span>SIGNAL 12 RECOVERED: HARMONIC 444.4 MHz LOCKED</span>
          <span className="text-red-400 font-bold">SOLVED</span>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// PUZZLE 13: THE UNLISTED SIGNAL (Cross-Archive Synthesis)
// Requires combining: 04:44 + 444.40 + B-4 + 62.4835
// -------------------------------------------------------------
export const Puzzle13UnlistedSignal: React.FC<PuzzleComponentProps> = ({ onSolve, isSolved }) => {
  const [inputVal, setInputVal] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePuzzleAnswer(13, inputVal)) {
      audioSystem.playSignalUnlocked();
      onSolve(13);
    } else {
      audioSystem.playStaticBurst(0.2, 0.05);
      setError(true);
      setTimeout(() => setError(false), 1200);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border border-[#181C20] bg-black/60 font-mono text-xs space-y-3">
        <p className="text-[#7E858D]">CROSS-ARCHIVE SYNTHESIS:</p>
        <p className="text-[#D6D9DC] leading-relaxed">
          Combine the anchors recovered across the investigation:
        </p>
        <div className="p-3 border border-[#181C20] bg-black text-[11px] text-[#9BA1A6] space-y-1">
          <p>• TIME: 04:44:12 UTC</p>
          <p>• SECTOR: B-4</p>
          <p>• VECTOR: 62.4835° N, 34.2567° E</p>
          <p>• CARRIER: 444.40 MHz</p>
        </div>
        <p className="text-[11px] text-[#60676E]">
          What event are all fourteen transmissions preparing the observer for?
        </p>
      </div>

      {!isSolved ? (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="SYNTHESIZED PHRASE (e.g. SECOND SIGNAL)..."
            className={`flex-1 bg-black border p-2.5 text-xs text-white uppercase tracking-wider outline-none ${
              error ? 'border-red-600 bg-red-950/20' : 'border-[#181C20] focus:border-[#7E858D]'
            }`}
          />
          <button
            type="submit"
            className="px-5 py-2.5 border border-[#252A2E] bg-[#090C0F] text-xs text-white hover:border-[#7E858D]"
          >
            SYNTHESIZE KEY
          </button>
        </form>
      ) : (
        <div className="p-3 border border-red-900/60 bg-red-950/20 text-xs text-white font-mono flex items-center justify-between">
          <span>SIGNAL 13 RECOVERED: SYNTHESIS CONVERGENCE ACHIEVED</span>
          <span className="text-red-400 font-bold">SOLVED</span>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// PUZZLE 14: SECOND SIGNAL (The Final Master Puzzle)
// -------------------------------------------------------------
export const Puzzle14SecondSignal: React.FC<PuzzleComponentProps> = ({ onSolve, isSolved }) => {
  const [transmitting, setTransmitting] = useState(false);

  const handleInitiate = async () => {
    setTransmitting(true);
    audioSystem.playStaticBurst(0.8, 0.08);

    await new Promise((r) => setTimeout(r, 1200));
    audioSystem.playMorseTone(444, 250);

    await new Promise((r) => setTimeout(r, 1200));
    audioSystem.playSignalUnlocked();

    onSolve(14);
    setTransmitting(false);

    window.dispatchEvent(
      new CustomEvent('444_SIGNAL_INTERRUPT', {
        detail: {
          message:
            '14 SIGNALS RECOVERED // SOURCE: UNKNOWN // SIGNAL: COMPLETE // SECOND SIGNAL DETECTED // WAIT.',
        },
      })
    );
  };

  return (
    <div className="space-y-4">
      <div className="p-6 border border-[#252A2E] bg-black font-mono text-xs space-y-4 text-center">
        <Sigil444 size={80} interactive={true} className="mx-auto text-white" />

        <div className="space-y-2">
          <p className="text-sm font-semibold text-white tracking-widest phosphor-text">
            THE FOURTEENTH PIECE
          </p>
          <p className="text-xs text-[#9BA1A6] max-w-md mx-auto leading-relaxed">
            The previous 13 pieces were fragments of one cosmic carrier. The circle closes. The archive is ready to breach.
          </p>
        </div>

        {!isSolved ? (
          <button
            onClick={handleInitiate}
            disabled={transmitting}
            className="px-8 py-3.5 border border-red-900 bg-red-950/40 text-xs font-bold tracking-[0.3em] uppercase text-white hover:border-red-600 hover:bg-red-950 transition-all cursor-pointer shadow-[0_0_25px_rgba(185,28,28,0.5)]"
          >
            {transmitting ? 'CONVERGING MASTER SIGNAL...' : '[ TRANSMIT THE 14TH SIGNAL ]'}
          </button>
        ) : (
          <div className="p-4 border border-red-600 bg-red-950/30 text-white font-mono space-y-1">
            <p className="text-sm font-bold tracking-widest text-red-400">
              14 / 14 SIGNALS RECOVERED
            </p>
            <p className="text-xs text-[#D6D9DC]">
              SECOND SIGNAL DETECTED. THE ARCHIVE VAULT HAS BEEN UNSEALED.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
