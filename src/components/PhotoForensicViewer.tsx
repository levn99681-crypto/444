import React, { useState, useRef, useEffect } from 'react';
import { ArchiveEvidenceItem, ARCHIVE_EVIDENCE_ITEMS } from '../data/archiveItems';
import { audioSystem } from '../utils/audioSystem';
import { Sigil444 } from './Sigil444';

interface PhotoForensicViewerProps {
  item: ArchiveEvidenceItem;
  onClose: () => void;
  onClueExtracted?: (clueText: string) => void;
}

export const PhotoForensicViewer: React.FC<PhotoForensicViewerProps> = ({
  item,
  onClose,
  onClueExtracted,
}) => {
  // Modes: ORIGINAL, ENHANCED, NEGATIVE, SIGNAL_LAYER
  const [viewMode, setViewMode] = useState<'ORIGINAL' | 'ENHANCED' | 'NEGATIVE' | 'SIGNAL_LAYER'>('ORIGINAL');

  // Sliders
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [exposure, setExposure] = useState<number>(0);
  const [grainIntensity, setGrainIntensity] = useState<number>(30);
  const [redEmphasis, setRedEmphasis] = useState<number>(0);
  const [freezeFrame, setFreezeFrame] = useState<boolean>(false);

  // Zoom & Pan
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Compare Evidence Mode
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [compareItemId, setCompareItemId] = useState<string>(
    item.crossReferences?.[0] || (item.id === 'arch-007' ? 'arch-003' : 'arch-007')
  );
  const [syncView, setSyncView] = useState<boolean>(true);

  // Detection state
  const [clueRevealed, setClueRevealed] = useState<boolean>(false);

  // Compare item object
  const compareItem = ARCHIVE_EVIDENCE_ITEMS.find((i) => i.id === compareItemId) || ARCHIVE_EVIDENCE_ITEMS[0];

  // Check if clue condition is met
  useEffect(() => {
    if (!item.forensicClue) return;

    let satisfied = false;
    if (item.forensicClue.modeRequired) {
      if (viewMode === item.forensicClue.modeRequired) {
        satisfied = true;
      }
    }

    if (item.forensicClue.sliderThreshold) {
      const th = item.forensicClue.sliderThreshold;
      const bPass = th.brightness ? brightness >= th.brightness : true;
      const cPass = th.contrast ? contrast >= th.contrast : true;
      const rPass = th.redChannel ? redEmphasis >= th.redChannel : true;
      if (bPass && cPass && rPass) satisfied = true;
    }

    if (satisfied && !clueRevealed) {
      audioSystem.playMorseTone(444, 90);
      setClueRevealed(true);
      if (onClueExtracted) {
        onClueExtracted(item.forensicClue.text);
      }
    }
  }, [viewMode, brightness, contrast, exposure, redEmphasis, item, clueRevealed, onClueExtracted]);

  // Handle Drag / Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStartRef.current.x,
      y: e.touches[0].clientY - dragStartRef.current.y,
    });
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Mode changer
  const handleSetMode = (mode: 'ORIGINAL' | 'ENHANCED' | 'NEGATIVE' | 'SIGNAL_LAYER') => {
    audioSystem.playClick();
    setViewMode(mode);
    if (mode === 'ORIGINAL') {
      setBrightness(100);
      setContrast(100);
      setExposure(0);
      setRedEmphasis(0);
    } else if (mode === 'ENHANCED') {
      setBrightness(115);
      setContrast(160);
      setExposure(10);
      setRedEmphasis(20);
    } else if (mode === 'NEGATIVE') {
      setBrightness(90);
      setContrast(180);
      setExposure(-10);
    } else if (mode === 'SIGNAL_LAYER') {
      setBrightness(120);
      setContrast(170);
      setRedEmphasis(70);
    }
  };

  const resetTransform = () => {
    audioSystem.playClick();
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Filter calculation string
  const getFilterStyle = () => {
    let base = `brightness(${brightness}%) contrast(${contrast}%)`;
    if (viewMode === 'NEGATIVE') {
      base += ' invert(100%)';
    }
    if (redEmphasis > 0) {
      base += ` sepia(${redEmphasis}%) hue-rotate(-30deg)`;
    }
    return base;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-4 select-none font-mono">
      <div className="relative w-full max-w-6xl h-[92vh] border border-[#252A2E] bg-[#050608] shadow-[0_0_80px_rgba(0,0,0,0.98)] flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="px-4 py-2.5 border-b border-[#181C20] bg-[#090C0F] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-xs text-white font-bold tracking-wider">
              FORENSIC INSPECTION SUITE // {item.code}
            </span>
            <span className="hidden sm:inline text-[10px] text-[#60676E] border-l border-[#181C20] pl-2">
              CAT: {item.category} · {item.role.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                audioSystem.playClick();
                setCompareMode(!compareMode);
              }}
              className={`px-2.5 py-1 text-[10px] tracking-wider border transition-colors ${
                compareMode
                  ? 'border-red-600 bg-red-950/40 text-white'
                  : 'border-[#181C20] bg-[#050608] text-[#7E858D] hover:text-white'
              }`}
            >
              {compareMode ? 'EXIT COMPARE' : 'COMPARE EVIDENCE'}
            </button>

            <button
              onClick={() => {
                audioSystem.playClick();
                onClose();
              }}
              className="px-3 py-1 text-xs border border-[#252A2E] text-[#9BA1A6] hover:text-white hover:border-[#7E858D] transition-colors"
            >
              ✕ CLOSE
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-4 py-2 border-b border-[#181C20] bg-black flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            {(['ORIGINAL', 'ENHANCED', 'NEGATIVE', 'SIGNAL_LAYER'] as const).map((m) => (
              <button
                key={m}
                onClick={() => handleSetMode(m)}
                className={`px-3 py-1 text-[10px] tracking-widest border transition-all ${
                  viewMode === m
                    ? 'border-[#7E858D] bg-[#111519] text-white font-semibold shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                    : 'border-[#181C20] bg-[#050608] text-[#60676E] hover:text-[#9BA1A6]'
                }`}
              >
                {m.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[10px] text-[#7E858D]">
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.25, 3.5))}
              className="px-2 py-0.5 border border-[#181C20] hover:text-white"
            >
              +
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.25, 0.75))}
              className="px-2 py-0.5 border border-[#181C20] hover:text-white"
            >
              -
            </button>
            <button
              onClick={resetTransform}
              className="px-2 py-0.5 border border-[#181C20] hover:text-white"
            >
              RESET ({Math.round(zoom * 100)}%)
            </button>
            <button
              onClick={() => setFreezeFrame(!freezeFrame)}
              className={`px-2 py-0.5 border ${freezeFrame ? 'border-red-600 text-red-400' : 'border-[#181C20] text-[#7E858D]'}`}
            >
              FREEZE: {freezeFrame ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Main Inspection Viewports Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Main Viewport Container */}
          <div
            className={`relative flex-1 bg-black overflow-hidden flex items-center justify-center cursor-grab ${
              isDragging ? 'cursor-grabbing' : ''
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Split View If Compare Mode Enabled */}
            {compareMode ? (
              <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#181C20]">
                {/* Primary Image */}
                <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-black">
                  <div
                    className="w-full h-full flex items-center justify-center transition-transform duration-75"
                    style={{
                      transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                      filter: getFilterStyle(),
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-full object-contain pointer-events-none"
                    />
                  </div>
                  <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 text-[9px] text-white border border-[#181C20]">
                    PRIMARY: {item.code}
                  </div>
                </div>

                {/* Compare Secondary Image */}
                <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-black">
                  <div
                    className="w-full h-full flex items-center justify-center transition-transform duration-75"
                    style={{
                      transform: syncView
                        ? `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
                        : undefined,
                      filter: getFilterStyle(),
                    }}
                  >
                    <img
                      src={compareItem.image}
                      alt={compareItem.title}
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-full object-contain pointer-events-none"
                    />
                  </div>
                  <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/80 px-2 py-0.5 border border-[#181C20]">
                    <span className="text-[9px] text-red-400 font-bold">CROSS-REF:</span>
                    <select
                      value={compareItemId}
                      onChange={(e) => setCompareItemId(e.target.value)}
                      className="bg-black text-[9px] text-white outline-none"
                    >
                      {ARCHIVE_EVIDENCE_ITEMS.filter((i) => i.id !== item.id).map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.code} — {i.title.slice(0, 24)}...
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              /* Single Focused Image */
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-75"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  filter: getFilterStyle(),
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-full object-contain pointer-events-none"
                />

                {/* Secret Signal Layer Glow Overlay (if active) */}
                {viewMode === 'SIGNAL_LAYER' && item.frequency && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-red-500 font-mono tracking-widest text-center animate-pulse">
                    <Sigil444 size={80} interactive={false} className="text-red-600 opacity-70" />
                    <p className="mt-2 text-xs font-bold text-red-400 bg-black/80 px-3 py-1 border border-red-900">
                      EM CARRIER LOCKED: {item.frequency}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Scanlines & Grain Overlay */}
            <div
              className={`absolute inset-0 scanlines pointer-events-none ${
                freezeFrame ? 'opacity-70 animate-pulse' : 'opacity-40'
              }`}
            />
            {grainIntensity > 0 && (
              <div
                className="absolute inset-0 analog-grain pointer-events-none"
                style={{ opacity: grainIntensity / 100 }}
              />
            )}

            {/* In-viewport Coordinates & Status HUD */}
            <div className="absolute bottom-3 left-3 text-[10px] text-[#7E858D] bg-black/85 px-2.5 py-1 border border-[#181C20] flex items-center gap-3">
              <span>LOC: {item.location}</span>
              <span>·</span>
              <span className="text-white">UTC: {item.time}</span>
              {compareMode && (
                <>
                  <span>·</span>
                  <button
                    onClick={() => setSyncView(!syncView)}
                    className="text-red-400 hover:underline"
                  >
                    SYNC: {syncView ? 'LOCKED' : 'FREE'}
                  </button>
                </>
              )}
            </div>

            {/* Clue extraction alert banner */}
            {clueRevealed && item.forensicClue && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 max-w-md w-full mx-4 p-3 bg-red-950/90 border border-red-600 text-center shadow-[0_0_25px_rgba(185,28,28,0.7)] animate-fade-in z-20">
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest block">
                  FORENSIC CLUE EXTRACTED:
                </span>
                <p className="text-xs text-white font-mono mt-0.5 font-semibold">
                  {item.forensicClue.text}
                </p>
                <span className="text-[9px] text-[#D6D9DC] block mt-1">
                  {item.forensicClue.significance}
                </span >
              </div>
            )}
          </div>

          {/* Right Sidebar: Controls & Metadata */}
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-[#181C20] bg-[#050608] p-4 flex flex-col justify-between overflow-y-auto space-y-4">
            
            <div className="space-y-4">
              <div className="border-b border-[#181C20] pb-2">
                <span className="text-[10px] text-red-500 font-bold tracking-widest uppercase">
                  FORENSIC METADATA
                </span>
                <h4 className="text-sm text-white font-semibold mt-0.5">
                  {item.title}
                </h4>
              </div>

              {/* Sliders Console */}
              <div className="space-y-3 text-[10px] text-[#7E858D] font-mono">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>BRIGHTNESS</span>
                    <span>{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="200"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full accent-white h-1 bg-[#181C20]"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>CONTRAST</span>
                    <span>{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="250"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full accent-white h-1 bg-[#181C20]"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>GRAIN NOISE</span>
                    <span>{grainIntensity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    value={grainIntensity}
                    onChange={(e) => setGrainIntensity(Number(e.target.value))}
                    className="w-full accent-white h-1 bg-[#181C20]"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>RED SPECTRUM BIAS</span>
                    <span>{redEmphasis}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={redEmphasis}
                    onChange={(e) => setRedEmphasis(Number(e.target.value))}
                    className="w-full accent-red-600 h-1 bg-[#181C20]"
                  />
                </div>
              </div>

              {/* Dossier notes */}
              <div className="space-y-1.5 pt-2 border-t border-[#111519] text-xs">
                <span className="text-[10px] text-[#60676E] uppercase tracking-wider block">
                  INVESTIGATOR LOG:
                </span>
                <p className="text-[11px] text-[#9BA1A6] leading-relaxed p-2.5 border border-[#181C20] bg-black">
                  {item.notes}
                </p>
              </div>

              {/* Cross reference links */}
              {item.crossReferences && item.crossReferences.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[9px] text-[#60676E] uppercase">
                    LINKED EVIDENCE ARTIFACTS:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {item.crossReferences.map((refId) => (
                      <button
                        key={refId}
                        onClick={() => {
                          audioSystem.playClick();
                          setCompareItemId(refId);
                          setCompareMode(true);
                        }}
                        className="px-2 py-0.5 text-[9px] border border-[#252A2E] bg-[#090C0F] text-[#9BA1A6] hover:text-white hover:border-[#7E858D]"
                      >
                        {refId.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#181C20] space-y-2">
              <button
                onClick={resetTransform}
                className="w-full py-2 border border-[#252A2E] bg-[#090C0F] text-[10px] text-white uppercase tracking-widest hover:border-[#7E858D] transition-colors"
              >
                RESET CAMERA VIEW
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 border border-[#181C20] text-[10px] text-[#7E858D] uppercase tracking-widest hover:text-white transition-colors"
              >
                RETURN TO GALLERY
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
