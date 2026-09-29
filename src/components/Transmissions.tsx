import React, { useState, useEffect, useRef } from 'react';
import { audioSystem } from '../utils/audioSystem';
import { CENTRAL_CONFIG } from '../config/centralConfig';

interface TransmissionTrack {
  id: string;
  frequency: string;
  label: string;
  status: string;
  transcript: string;
  timestamp: string;
  morsePattern?: string;
  toneSequence?: number[];
}

const TRACKS: TransmissionTrack[] = [
  {
    id: 'tr-01',
    frequency: '444.40 MHz',
    label: 'PRIMARY BOREAL CARRIER (SECTOR B-4)',
    status: 'ACTIVE LOOP',
    timestamp: '04:44:12 UTC',
    transcript: '“...THREE DIGITS REQUIRED. CARRIER LOCKED ON 444.40 MHZ. DO NOT TRANSMIT. WAIT FOR THE SECOND SIGNAL...”',
    toneSequence: [444, 444, 444, 888]
  },
  {
    id: 'tr-02',
    frequency: '044.40 MHz',
    label: 'SHORTWAVE MORSE BEACON',
    status: 'CONTINUOUS PULSE',
    timestamp: 'RECURRENT',
    transcript: 'MORSE SEQUENCE INTERCEPT: ··· ·· --· -. ·- ·-·· (S-I-G-N-A-L)',
    morsePattern: '... .. --. -. .- .-..'
  },
  {
    id: 'tr-03',
    frequency: '444.00 MHz',
    label: 'NUMBER STATION INTERCEPT',
    status: 'FRAGMENTED AUDIO',
    timestamp: '04:10:00 UTC',
    transcript: '“...ZERO FOUR... FOUR FOUR... CARRIER RESUMES IN THREE HUNDRED SECONDS... SEQUENCE COMMENCES...”',
    toneSequence: [222, 444, 666, 888]
  },
  {
    id: 'tr-04',
    frequency: '1444.00 MHz',
    label: 'HIGH FREQUENCY HARMONIC BEACON',
    status: 'SPECTRAL ANOMALY',
    timestamp: '04:58:00 UTC',
    transcript: '“...THE SECOND SIGNAL IS NOT YET DETECTED. ALL ARCHIVE UNITS TO REMAIN SEALED UNTIL 14 PIECES CONVERGE...”',
    toneSequence: [888, 444, 888, 1332]
  }
];

export const Transmissions: React.FC = () => {
  const [selectedTrack, setSelectedTrack] = useState<TransmissionTrack>(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Canvas visualizer loop (oscilloscope / waveform)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw faint CRT grid lines
      ctx.strokeStyle = '#111519';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw center crosshair
      ctx.strokeStyle = '#181C20';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();

      // Oscilloscope wave
      ctx.beginPath();
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = isPlaying ? '#D6D9DC' : '#4A5057';

      const amplitude = isPlaying ? 35 : 6;
      const freqMultiplier = selectedTrack.id === 'tr-01' ? 0.05 : 0.08;

      for (let x = 0; x < canvas.width; x++) {
        const noise = (Math.random() - 0.5) * (isPlaying ? 8 : 2);
        const y = canvas.height / 2 + Math.sin(x * freqMultiplier + phase) * amplitude + noise;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += isPlaying ? 0.12 : 0.02;
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, selectedTrack]);

  const handlePlayTransmission = async (track: TransmissionTrack) => {
    setSelectedTrack(track);
    setIsPlaying(true);

    if (track.morsePattern) {
      // Play morse code tones
      const chars = track.morsePattern.split('');
      for (const char of chars) {
        if (char === '.') {
          await audioSystem.playMorseTone(720, 80);
          await new Promise((r) => setTimeout(r, 60));
        } else if (char === '-') {
          await audioSystem.playMorseTone(720, 220);
          await new Promise((r) => setTimeout(r, 60));
        } else {
          await new Promise((r) => setTimeout(r, 180));
        }
      }
    } else if (track.toneSequence) {
      for (const tone of track.toneSequence) {
        await audioSystem.playMorseTone(tone, 180);
        await new Promise((r) => setTimeout(r, 100));
      }
    } else {
      audioSystem.playStaticBurst(0.8, 0.08);
      await new Promise((r) => setTimeout(r, 800));
    }

    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-black text-[#D6D9DC] font-mono pb-24">
      
      {/* Header Bar */}
      <div className="w-full border-b border-[#181C20] bg-[#050608] px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-red-500 uppercase tracking-[0.25em]">
                SHORTWAVE RECEIVER
              </span>
              <span className="text-[#60676E]">·</span>
              <span className="text-[10px] text-[#7E858D] tracking-widest">
                BANDWIDTH: 044.40 - 1444.00 MHz
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-wider text-white phosphor-text">
              TRANSMISSION INTERCEPTS
            </h2>
          </div>

          <div className="text-right text-xs text-[#7E858D]">
            <span>COORDINATES: {CENTRAL_CONFIG.PRIMARY_COORDINATES}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Oscilloscope Station Viewport */}
        <div className="p-6 border border-[#181C20] bg-[#050608] space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#181C20] pb-4">
            <div>
              <span className="text-[10px] text-[#7E858D] uppercase tracking-widest block">
                TUNED FREQUENCY:
              </span>
              <span className="text-xl sm:text-2xl text-white font-bold tracking-widest phosphor-text">
                {selectedTrack.frequency}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-[#9BA1A6]">
                STATUS: {isPlaying ? <span className="text-red-500 animate-pulse font-bold">RECEIVING AUDIO STREAM</span> : selectedTrack.status}
              </span>

              <button
                onClick={() => handlePlayTransmission(selectedTrack)}
                disabled={isPlaying}
                className="px-5 py-2 border border-[#252A2E] bg-[#111519] text-xs uppercase tracking-widest text-white hover:border-[#7E858D] transition-colors disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                {isPlaying ? '[ DECODING... ]' : '[ PLAY TRANSMISSION ]'}
              </button>
            </div>
          </div>

          {/* CRT Canvas Screen */}
          <div className="relative w-full aspect-[21/9] max-h-72 border border-[#181C20] overflow-hidden bg-[#050608]">
            <canvas
              ref={canvasRef}
              width={800}
              height={300}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 scanlines opacity-50 pointer-events-none" />
            
            <div className="absolute top-3 left-3 text-[10px] text-[#7E858D] tracking-widest bg-black/70 px-2 py-1 border border-[#181C20]">
              RF OSCILLOGRAM // HARMONIC 444
            </div>

            <div className="absolute bottom-3 right-3 text-[10px] text-red-500 font-mono tracking-widest bg-black/70 px-2 py-1 border border-[#181C20]">
              {selectedTrack.timestamp}
            </div>
          </div>

          {/* Decoded Transcript Readout */}
          <div className="p-4 border border-[#181C20] bg-black">
            <span className="text-[10px] text-[#60676E] uppercase tracking-widest block mb-1">
              DECODED TRANSCRIPT LOG:
            </span>
            <p className="text-xs sm:text-sm text-white font-mono leading-relaxed">
              {selectedTrack.transcript}
            </p>
          </div>

        </div>

        {/* Frequencies List */}
        <div className="mt-8 space-y-4">
          <h3 className="text-xs text-[#7E858D] uppercase tracking-widest">
            INTERCEPTED FREQUENCIES (SELECT CHANNEL)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TRACKS.map((t) => (
              <div
                key={t.id}
                onClick={() => {
                  audioSystem.playClick();
                  setSelectedTrack(t);
                }}
                className={`p-4 border transition-all cursor-pointer ${
                  selectedTrack.id === t.id
                    ? 'border-[#7E858D] bg-[#090C0F]'
                    : 'border-[#181C20] bg-[#050608] hover:border-[#252A2E]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-white font-semibold tracking-wider">
                      {t.frequency}
                    </span>
                    <p className="text-[11px] text-[#9BA1A6] mt-0.5">{t.label}</p>
                  </div>
                  <span className="text-[10px] text-red-500 font-mono">{t.status}</span>
                </div>

                <div className="mt-3 flex justify-between items-center text-[10px] text-[#60676E] border-t border-[#111519] pt-2">
                  <span>RECORDED: {t.timestamp}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayTransmission(t);
                    }}
                    className="text-white hover:text-red-400"
                  >
                    [TUNE &amp; LISTEN]
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
