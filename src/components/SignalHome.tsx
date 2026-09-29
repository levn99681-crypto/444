import React, { useState, useEffect } from 'react';
import { Sigil444 } from './Sigil444';
import { CENTRAL_CONFIG } from '../config/centralConfig';
import { audioSystem } from '../utils/audioSystem';
import forestRoadImg from '../assets/images/archive_forest_road_1790568762549.jpg';
import radarSigilImg from '../assets/images/archive_radar_sigil_1790568781921.jpg';

interface SignalHomeProps {
  onNavigate: (section: 'ARCHIVE' | 'EVIDENCE' | 'TRANSMISSIONS' | 'MAP' | 'PUZZLES' | 'THE OBSERVERS' | '444 TOKEN') => void;
  solvedCount: number;
  totalPuzzles: number;
  onOpenSignalHunt?: () => void;
}

export const SignalHome: React.FC<SignalHomeProps> = ({
  onNavigate,
  solvedCount,
  totalPuzzles,
  onOpenSignalHunt,
}) => {
  const [flickerActive, setFlickerActive] = useState<boolean>(false);
  const [hiddenAnomalyRevealed, setHiddenAnomalyRevealed] = useState<boolean>(false);

  useEffect(() => {
    // Random subtle flicker effect
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setFlickerActive(true);
        setTimeout(() => setFlickerActive(false), 150);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleHiddenClueClick = () => {
    audioSystem.playMorseTone(444, 90);
    setHiddenAnomalyRevealed(true);
    window.dispatchEvent(
      new CustomEvent('444_SIGNAL_INTERRUPT', {
        detail: {
          message: "PATTERN DISCOVERED: 4 44 444 4444 // CLUE REGISTERED FOR PUZZLE 01",
        },
      })
    );
  };

  return (
    <div className="min-h-screen bg-black text-[#D6D9DC] font-mono pb-20">
      
      {/* Scanline overlay */}
      <div className="fixed inset-0 scanlines opacity-30 pointer-events-none" />
      <div className="fixed inset-0 analog-grain opacity-20 pointer-events-none" />

      {/* Top Telemetry Strip */}
      <div className="w-full border-b border-[#181C20] bg-[#050608] px-4 py-2 text-[10px] text-[#7E858D] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-white/90">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            LIVE CARRIER: 444.40 MHz
          </span>
          <span className="hidden sm:inline text-[#60676E]">|</span>
          <span className="hidden sm:inline">COORDINATES: {CENTRAL_CONFIG.PRIMARY_COORDINATES}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/80">RECURRENCE: 04:44:12 UTC</span>
          <span className="text-[#60676E]">STATUS: ANOMALOUS</span>
        </div>
      </div>

      {/* Hero Atmosphere Section */}
      <section className="relative px-4 sm:px-6 pt-12 sm:pt-20 pb-16 max-w-5xl mx-auto flex flex-col items-center text-center">
        
        {/* Subtle decorative target reticle */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-64 h-64 border border-[#181C20]/60 rounded-full pointer-events-none -z-0" />
        <div className="absolute top-14 left-1/2 -translate-x-1/2 w-48 h-48 border border-[#111519]/50 rounded-full pointer-events-none -z-0" />

        {/* The Great Sigil */}
        <div className="relative z-10 mb-6 cursor-pointer">
          <Sigil444 size={120} interactive={true} showNumbers={true} />
        </div>

        {/* Main Title & Subtitle */}
        <div className={`space-y-3 z-10 ${flickerActive ? 'opacity-80' : ''}`}>
          <div className="inline-block px-3 py-1 border border-[#181C20] bg-[#050608] text-[10px] tracking-[0.3em] uppercase text-[#7E858D]">
            CLASSIFIED SIGNAL ARCHIVE // RESTRICTED ACCESS
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold tracking-[0.25em] text-white phosphor-text">
            444
          </h1>

          <p className="text-sm sm:text-base tracking-[0.3em] uppercase text-[#9BA1A6] max-w-xl mx-auto">
            SIGNAL DETECTED. IDENTITY UNKNOWN.
          </p>

          <p className="text-xs tracking-wider text-[#60676E] max-w-md mx-auto pt-2">
            You weren&apos;t supposed to find this. Fourteen fragmented transmissions have been scattered across the exclusion zone.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-8 z-10">
          <button
            onClick={() => {
              audioSystem.playClick();
              onNavigate('PUZZLES');
            }}
            className="px-6 py-3 border border-[#252A2E] bg-[#090C0F] text-xs tracking-[0.25em] uppercase text-white hover:border-[#7E858D] hover:bg-[#111519] transition-all cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.8)]"
          >
            [ RECOVER SIGNALS ({solvedCount}/{totalPuzzles}) ]
          </button>

          <button
            onClick={() => {
              audioSystem.playClick();
              onNavigate('ARCHIVE');
            }}
            className="px-6 py-3 border border-[#181C20] bg-[#050608] text-xs tracking-[0.2em] uppercase text-[#9BA1A6] hover:text-white hover:border-[#252A2E] transition-all cursor-pointer"
          >
            EXPLORE ARCHIVE
          </button>

          {onOpenSignalHunt && (
            <button
              onClick={() => {
                audioSystem.playClick();
                onOpenSignalHunt();
              }}
              className="px-6 py-3 border border-red-950/80 bg-red-950/20 text-xs tracking-[0.2em] uppercase text-red-400 hover:text-white hover:border-red-600 hover:bg-red-950/40 transition-all cursor-pointer flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              SIGNAL HUNT (2D EXPEDITION)
            </button>
          )}
        </div>

        {/* Hidden anomaly element on the page for Puzzle 01 */}
        <div className="pt-12 text-center z-10">
          <button
            onClick={handleHiddenClueClick}
            className={`text-[9px] tracking-[0.4em] transition-all duration-300 ${
              hiddenAnomalyRevealed
                ? 'text-red-500 font-bold'
                : 'text-[#181C20] hover:text-[#4A5057] cursor-pointer'
            }`}
            title="???"
          >
            {hiddenAnomalyRevealed ? '4 44 444 4444 [ANOMALY RECORDED]' : '4 44 444 ····'}
          </button>
        </div>

      </section>

      {/* Grid: Transmission Feed & Forensic Visuals */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Intercept Log */}
          <div className="p-5 border border-[#181C20] bg-[#050608] space-y-4">
            <div className="flex items-center justify-between border-b border-[#111519] pb-3">
              <span className="text-[11px] tracking-wider text-white font-semibold">
                INTERCEPT FEED
              </span>
              <span className="text-[9px] text-[#7E858D] uppercase">04:44:12 UTC</span>
            </div>

            <div className="space-y-3 text-xs text-[#9BA1A6] leading-relaxed">
              <div className="p-2 border-l-2 border-red-900 bg-[#090C0F]">
                <p className="text-[10px] text-red-500/90 font-mono tracking-wider">
                  &gt; BROADCAST CAPTURED AT 62.4835° N
                </p>
                <p className="text-[11px] text-[#D6D9DC] mt-1">
                  &quot;The transmission repeats every cycle. They carved the mark into the walls before the facility was abandoned.&quot;
                </p>
              </div>

              <div className="p-2 border-l-2 border-[#252A2E] bg-[#090C0F]/60">
                <p className="text-[10px] text-[#7E858D]">
                  &gt; STATUS NOTICE // PRIORITY 0
                </p>
                <p className="text-[11px] text-[#9BA1A6] mt-1">
                  &quot;DO NOT TRANSMIT. WAIT FOR THE SECOND SIGNAL.&quot;
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('TRANSMISSIONS')}
              className="w-full py-2 border border-[#181C20] bg-[#090C0F] text-[10px] tracking-widest text-[#7E858D] hover:text-white hover:border-[#252A2E] transition-colors text-center"
            >
              [ OPEN SHORTWAVE RECEIVER ]
            </button>
          </div>

          {/* Card 2: Visual Evidence Spotlight */}
          <div className="p-5 border border-[#181C20] bg-[#050608] space-y-4">
            <div className="flex items-center justify-between border-b border-[#111519] pb-3">
              <span className="text-[11px] tracking-wider text-white font-semibold">
                RECOVERED FOOTAGE
              </span>
              <span className="text-[9px] text-[#7E858D]">ARCHIVE // 003</span>
            </div>

            <div className="relative aspect-video border border-[#181C20] overflow-hidden group">
              <img
                src={forestRoadImg}
                alt="Snowy boreal road at night with weathered 444 road marker"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale contrast-125 brightness-75 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />
              <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/80 text-[9px] text-white tracking-widest">
                04:44:12 UTC
              </div>
            </div>

            <div className="text-[11px] text-[#7E858D] flex justify-between items-center">
              <span>LOCATION: UNKNOWN FOREST ROAD</span>
              <button
                onClick={() => onNavigate('ARCHIVE')}
                className="text-white hover:underline text-[10px]"
              >
                VIEW DOSSIER &rarr;
              </button>
            </div>
          </div>

          {/* Card 3: Tactical Exclusion Map Preview */}
          <div className="p-5 border border-[#181C20] bg-[#050608] space-y-4">
            <div className="flex items-center justify-between border-b border-[#111519] pb-3">
              <span className="text-[11px] tracking-wider text-white font-semibold">
                TACTICAL RADAR
              </span>
              <span className="text-[9px] text-red-500 animate-pulse">LOCKED</span>
            </div>

            <div className="relative aspect-video border border-[#181C20] overflow-hidden group">
              <img
                src={radarSigilImg}
                alt="Phosphor CRT oscilloscope displaying 444 sigil reticle"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover contrast-150 brightness-90 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 scanlines opacity-50 pointer-events-none" />
              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-[9px] text-red-400 font-mono">
                {CENTRAL_CONFIG.PRIMARY_COORDINATES}
              </div>
            </div>

            <div className="text-[11px] text-[#7E858D] flex justify-between items-center">
              <span>FACILITY SECTOR B-4</span>
              <button
                onClick={() => onNavigate('MAP')}
                className="text-white hover:underline text-[10px]"
              >
                LAUNCH MAP &rarr;
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Progress Telemetry Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <div className="p-6 border border-[#181C20] bg-[#050608] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-[10px] tracking-[0.25em] text-[#7E858D] uppercase">
              INVESTIGATION PROGRESS
            </p>
            <h3 className="text-lg text-white font-medium">
              SIGNALS RECOVERED: {solvedCount} / {totalPuzzles}
            </h3>
            <p className="text-xs text-[#60676E]">
              {solvedCount === totalPuzzles
                ? 'All 14 signals recovered. The Archive Vault has been unsealed.'
                : 'Decipher the remaining anomalies to unlock the master terminal and token channel.'}
            </p>
          </div>

          <div className="w-full md:w-64 space-y-2">
            <div className="w-full h-2 bg-[#111519] border border-[#181C20] overflow-hidden">
              <div
                className="h-full bg-red-700 transition-all duration-500 shadow-[0_0_8px_rgba(185,28,28,0.8)]"
                style={{ width: `${(solvedCount / totalPuzzles) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#7E858D] font-mono">
              <span>{Math.round((solvedCount / totalPuzzles) * 100)}% COMPLETE</span>
              <span>{totalPuzzles - solvedCount} REMAINING</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('PUZZLES')}
            className="px-5 py-2.5 border border-[#252A2E] bg-[#090C0F] text-xs tracking-wider text-white hover:border-[#7E858D] transition-colors"
          >
            CONTINUE DECRYPTION &rarr;
          </button>
        </div>
      </section>

    </div>
  );
};
