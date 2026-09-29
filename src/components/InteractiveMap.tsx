import React, { useState } from 'react';
import { audioSystem } from '../utils/audioSystem';
import { CENTRAL_CONFIG } from '../config/centralConfig';
import { Sigil444 } from './Sigil444';

export type MapLayerType =
  | 'TOPOGRAPHY'
  | 'ROAD'
  | 'SIGNAL'
  | 'ARCHIVE'
  | 'COORDINATES'
  | 'UNKNOWN';

export interface TacticalMarker {
  id: string;
  name: string;
  code: string;
  coords: string;
  xPercent: number; // 0 - 100
  yPercent: number; // 0 - 100
  layer: MapLayerType;
  type: 'FACILITY' | 'ROAD_MARKER' | 'BEACON' | 'VAULT' | 'OUTPOST' | 'DECOY' | 'CORRUPTED';
  description: string;
  isEpicenter?: boolean;
  timeTrigger?: string; // e.g. '04:44'
}

const TACTICAL_MARKERS: TacticalMarker[] = [
  {
    id: 'm-1',
    name: 'Sector B-4 Research Bunker Complex',
    code: 'EPICENTER // 444',
    coords: '62.4835° N, 34.2567° E',
    xPercent: 54,
    yPercent: 44,
    layer: 'SIGNAL',
    type: 'FACILITY',
    description: 'The epicenter of the anomalous 444.40 MHz carrier. Concrete monolith with rooftop transmission antenna. Sub-level 12 contains the sealed iron vault.',
    isEpicenter: true,
    timeTrigger: '04:44',
  },
  {
    id: 'm-2',
    name: 'Access Road 444 Highway Marker',
    code: 'WAYPOINT 01',
    coords: '62.4710° N, 34.2100° E',
    xPercent: 28,
    yPercent: 78,
    layer: 'ROAD',
    type: 'ROAD_MARKER',
    description: 'Weathered sheet-metal sign scorched into the snow. Road leads north into the restricted boreal perimeter.',
  },
  {
    id: 'm-3',
    name: 'Canopy Light Beacon Anomaly',
    code: 'BEACON // 020',
    coords: '62.4980° N, 34.2890° E',
    xPercent: 76,
    yPercent: 22,
    layer: 'SIGNAL',
    type: 'BEACON',
    description: 'Piercing vertical column of luminescent diamond structure hovering over pine crowns recorded at 04:58 UTC.',
    timeTrigger: '04:44',
  },
  {
    id: 'm-4',
    name: 'Sub-Level Vault 12 (Steel Chained Gate)',
    code: 'VAULT // SEALED',
    coords: '62.4842° N, 34.2580° E',
    xPercent: 58,
    yPercent: 48,
    layer: 'ARCHIVE',
    type: 'VAULT',
    description: 'Reinforced iron blast door wrapped in chains. Inscribed with the 444 Sigil. Awaiting full recovery of the 14 signals.',
  },
  {
    id: 'm-5',
    name: 'Perimeter Observation Post Alpha',
    code: 'POST // 002',
    coords: '62.4650° N, 34.2400° E',
    xPercent: 40,
    yPercent: 88,
    layer: 'ROAD',
    type: 'OUTPOST',
    description: 'Abandoned wooden observation watchtower. Recovered journal contains handwritten log notes referencing 04:44.',
  },
  {
    id: 'm-6',
    name: 'Corrupted Signal Repeater Station',
    code: 'REPEATER // DEAD',
    coords: '62.4550° N, 34.2800° E',
    xPercent: 70,
    yPercent: 70,
    layer: 'UNKNOWN',
    type: 'CORRUPTED',
    description: 'Decoy or collapsed radio mast. Receiver picks up only chaotic white noise and intermittent squeals.',
  },
  {
    id: 'm-7',
    name: 'Deep Forest Clearing (Tree with Sigil)',
    code: 'CLEARING // 002',
    coords: '62.4810° N, 34.2510° E',
    xPercent: 48,
    yPercent: 52,
    layer: 'TOPOGRAPHY',
    type: 'OUTPOST',
    description: 'Ancient pine grove where the Sigil is carved into the living bark. Magnetic compasses spin erratically here.',
  }
];

interface CustomPin {
  id: string;
  xPercent: number;
  yPercent: number;
  label: string;
}

interface InteractiveMapProps {
  onSignalFound?: (coords: string) => void;
  showPuzzleAction?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  onSignalFound,
  showPuzzleAction = false,
}) => {
  // Layer Toggles
  const [activeLayers, setActiveLayers] = useState<Record<MapLayerType, boolean>>({
    TOPOGRAPHY: true,
    ROAD: true,
    SIGNAL: true,
    ARCHIVE: true,
    COORDINATES: true,
    UNKNOWN: false,
  });

  // Time Dimension: 04:00, 04:15, 04:30, 04:44, 05:00
  const timeSteps = ['04:00', '04:15', '04:30', '04:44', '05:00'];
  const [currentTimeIndex, setCurrentTimeIndex] = useState<number>(3); // 04:44 by default

  // Frequency Scanner Slider: 400.0 to 480.0 MHz
  const [frequencyScan, setFrequencyScan] = useState<number>(444.4);
  const isFreqLocked = Math.abs(frequencyScan - 444.4) < 0.4;

  // Zoom & Pan
  const [zoom, setZoom] = useState<number>(1);
  const [selectedMarker, setSelectedMarker] = useState<TacticalMarker | null>(null);

  // Investigation Drawing Tool: 'SELECT' | 'MARK' | 'CONNECT'
  const [activeTool, setActiveTool] = useState<'SELECT' | 'MARK' | 'CONNECT'>('SELECT');
  const [userPins, setUserPins] = useState<CustomPin[]>([]);
  const [connections, setConnections] = useState<[string, string][]>([]);
  const [selectedPinForConnect, setSelectedPinForConnect] = useState<string | null>(null);

  // Triangulation Puzzle State
  const [triangulationStep, setTriangulationStep] = useState<{
    latFound: boolean;
    lonFound: boolean;
    timeFound: boolean;
  }>({
    latFound: true,
    lonFound: true,
    timeFound: true,
  });

  const toggleLayer = (layer: MapLayerType) => {
    audioSystem.playClick();
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool !== 'MARK') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    audioSystem.playClick();
    const newPin: CustomPin = {
      id: `pin-${Date.now()}`,
      xPercent: Math.round(x),
      yPercent: Math.round(y),
      label: `PIN // ${userPins.length + 1}`,
    };
    setUserPins((prev) => [...prev, newPin]);
  };

  const handlePinClick = (pinId: string) => {
    if (activeTool === 'CONNECT') {
      audioSystem.playClick();
      if (!selectedPinForConnect) {
        setSelectedPinForConnect(pinId);
      } else if (selectedPinForConnect !== pinId) {
        setConnections((prev) => [...prev, [selectedPinForConnect, pinId]]);
        setSelectedPinForConnect(null);
        audioSystem.playMorseTone(444, 80);
      }
    }
  };

  const handleMarkerSelect = (marker: TacticalMarker) => {
    audioSystem.playClick();
    setSelectedMarker(marker);

    if (marker.isEpicenter) {
      audioSystem.playSignalUnlocked();
      if (onSignalFound) {
        onSignalFound(CENTRAL_CONFIG.PRIMARY_COORDINATES);
      }
    }
  };

  const clearDrawings = () => {
    audioSystem.playClick();
    setUserPins([]);
    setConnections([]);
    setSelectedPinForConnect(null);
  };

  const currentTime = timeSteps[currentTimeIndex];
  const is0444Event = currentTime === '04:44';

  return (
    <div className="min-h-screen bg-black text-[#D6D9DC] font-mono pb-24">
      
      {/* Header Bar */}
      <div className="w-full border-b border-[#181C20] bg-[#050608] px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-red-500 uppercase tracking-[0.25em]">
                CARTOGRAPHIC RECONNAISSANCE 2.0
              </span>
              <span className="text-[#60676E]">·</span>
              <span className="text-[10px] text-[#7E858D] tracking-widest">
                BOREAL EXCLUSION ZONE SECTOR B-4
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-wider text-white phosphor-text">
              THE SIGNAL MAP
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#7E858D]">
              COORDINATES: <span className="text-white font-mono">{CENTRAL_CONFIG.PRIMARY_COORDINATES}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Map Control Consoles Strip */}
        <div className="p-4 border border-[#181C20] bg-[#050608] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          {/* Layer Toggles */}
          <div>
            <span className="text-[10px] text-[#60676E] uppercase tracking-wider block mb-2">
              CARTOGRAPHIC LAYERS:
            </span>
            <div className="flex flex-wrap gap-1">
              {(['TOPOGRAPHY', 'ROAD', 'SIGNAL', 'ARCHIVE', 'COORDINATES', 'UNKNOWN'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => toggleLayer(l)}
                  className={`px-2 py-0.5 text-[9px] border transition-colors cursor-pointer ${
                    activeLayers[l]
                      ? 'border-[#7E858D] bg-[#111519] text-white font-bold'
                      : 'border-[#181C20] bg-black text-[#4A5057]'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Time Scrubber (04:00 to 05:00) */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[10px] text-[#60676E] uppercase">TIME PERSPECTIVE:</span>
              <span className="text-[10px] text-white font-mono font-bold">
                {currentTime} UTC {is0444Event && <span className="text-red-500 animate-pulse">[ANOMALY EVENT]</span>}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {timeSteps.map((step, idx) => (
                <button
                  key={step}
                  onClick={() => {
                    audioSystem.playClick();
                    setCurrentTimeIndex(idx);
                  }}
                  className={`flex-1 py-1 text-[9px] border transition-colors ${
                    currentTimeIndex === idx
                      ? 'border-red-600 bg-red-950/40 text-white font-bold'
                      : 'border-[#181C20] bg-black text-[#60676E] hover:text-[#9BA1A6]'
                  }`}
                >
                  {step}
                </button>
              ))}
            </div>
          </div>

          {/* Map Frequency Scanner Slider */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[10px] text-[#60676E] uppercase">SCAN FREQUENCY:</span>
              <span className="text-[10px] text-white font-mono font-bold">
                {frequencyScan.toFixed(1)} MHz{' '}
                {isFreqLocked ? (
                  <span className="text-red-400 font-bold">[LOCKED]</span>
                ) : (
                  <span className="text-[#60676E]">[STATIC]</span>
                )}
              </span>
            </div>
            <input
              type="range"
              min="400.0"
              max="480.0"
              step="0.1"
              value={frequencyScan}
              onChange={(e) => setFrequencyScan(Number(e.target.value))}
              className="w-full accent-red-600 h-1 bg-[#181C20] cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-[#4A5057] mt-0.5">
              <span>400.0 MHz</span>
              <span className="text-red-500/80">RESONANCE 444.40</span>
              <span>480.0 MHz</span>
            </div>
          </div>

        </div>

        {/* Investigative Drawing & Measurement Tools Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs border border-[#181C20] bg-black px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#60676E] uppercase tracking-wider">
              FIELD TOOLS:
            </span>
            {(['SELECT', 'MARK', 'CONNECT'] as const).map((tool) => (
              <button
                key={tool}
                onClick={() => {
                  audioSystem.playClick();
                  setActiveTool(tool);
                }}
                className={`px-3 py-1 text-[10px] tracking-wider border transition-colors ${
                  activeTool === tool
                    ? 'border-[#7E858D] bg-[#111519] text-white font-semibold'
                    : 'border-[#181C20] text-[#7E858D] hover:text-white'
                }`}
              >
                {tool}
              </button>
            ))}
            {(userPins.length > 0 || connections.length > 0) && (
              <button
                onClick={clearDrawings}
                className="px-2 py-1 text-[10px] border border-red-950 text-red-400 hover:text-red-300"
              >
                CLEAR PINS ({userPins.length})
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.3, 3.2))}
              className="px-2 py-0.5 border border-[#181C20] text-[#7E858D] hover:text-white"
            >
              ZOOM +
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.3, 0.8))}
              className="px-2 py-0.5 border border-[#181C20] text-[#7E858D] hover:text-white"
            >
              ZOOM -
            </button>
            <span className="text-[10px] text-[#60676E]">SCALE: {Math.round(zoom * 100)}%</span>
          </div>
        </div>

        {/* Main Map Viewport */}
        <div
          onClick={handleMapClick}
          className="relative w-full aspect-[16/10] sm:aspect-[16/9] border border-[#181C20] bg-[#050608] overflow-hidden select-none cursor-crosshair shadow-[inset_0_0_80px_rgba(0,0,0,0.95)]"
        >
          {/* Static noise overlay when frequency is NOT locked */}
          {!isFreqLocked && (
            <div className="absolute inset-0 bg-white/5 pointer-events-none animate-pulse" />
          )}

          {/* Topographical Vector Grid Background */}
          <div
            className="absolute inset-0 transition-transform duration-200 origin-center"
            style={{ transform: `scale(${zoom})` }}
          >
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="tacticalGrid2" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#111519" strokeWidth="0.8" />
                  <circle cx="0" cy="0" r="1.2" fill="#252A2E" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#tacticalGrid2)" />

              {/* TOPOGRAPHY LAYER: Elevation Contour Lines */}
              {activeLayers.TOPOGRAPHY && (
                <g stroke="#181C20" fill="none">
                  <ellipse cx="54%" cy="44%" rx="280" ry="190" strokeWidth="1" strokeDasharray="3 3" />
                  <ellipse cx="54%" cy="44%" rx="200" ry="140" strokeWidth="1" />
                  <ellipse cx="54%" cy="44%" rx="120" ry="85" strokeWidth="1.2" stroke="#252A2E" />
                  <ellipse cx="54%" cy="44%" rx="60" ry="40" strokeWidth="1.5" stroke="#3A4048" />
                  {/* Boreal Lake Outline */}
                  <path
                    d="M 120 180 Q 180 140 240 190 T 320 220 T 260 300 T 150 260 Z"
                    fill="#080B0E"
                    stroke="#181C20"
                    strokeWidth="1"
                  />
                </g>
              )}

              {/* ROAD LAYER: Access roads & telephone arteries */}
              {activeLayers.ROAD && (
                <g fill="none">
                  <path
                    d="M 100 800 Q 250 650 350 550 T 540 440"
                    stroke="#3A4048"
                    strokeWidth="2.5"
                    strokeDasharray="6 3"
                  />
                  <path
                    d="M 540 440 L 760 220"
                    stroke="#252A2E"
                    strokeWidth="1.8"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M 400 880 L 540 440"
                    stroke="#1C2126"
                    strokeWidth="1.2"
                  />
                </g>
              )}

              {/* COORDINATES LAYER: Overlay Triangulation Crossings */}
              {activeLayers.COORDINATES && (
                <g stroke="#252A2E" strokeWidth="0.8" strokeDasharray="2 4">
                  {/* Latitude 62.4835 line */}
                  <line x1="0" y1="44%" x2="100%" y2="44%" stroke="#8B1A1A" strokeOpacity="0.4" strokeWidth="1" />
                  {/* Longitude 34.2567 line */}
                  <line x1="54%" y1="0" x2="54%" y2="100%" stroke="#8B1A1A" strokeOpacity="0.4" strokeWidth="1" />
                </g>
              )}

              {/* SIGNAL LAYER: Harmonic Pulse Waves around Epicenter */}
              {activeLayers.SIGNAL && is0444Event && (
                <g>
                  <circle cx="54%" cy="44%" r="48" fill="none" stroke="#B91C1C" strokeWidth="1.5" className="animate-ping" opacity="0.4" />
                  <circle cx="54%" cy="44%" r="80" fill="none" stroke="#B91C1C" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                </g>
              )}

              {/* USER DRAWN CONNECTIONS */}
              {connections.map(([p1Id, p2Id], i) => {
                const p1 = userPins.find((p) => p.id === p1Id);
                const p2 = userPins.find((p) => p.id === p2Id);
                if (!p1 || !p2) return null;
                return (
                  <line
                    key={i}
                    x1={`${p1.xPercent}%`}
                    y1={`${p1.yPercent}%`}
                    x2={`${p2.xPercent}%`}
                    y2={`${p2.yPercent}%`}
                    stroke="#B91C1C"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    className="animate-pulse"
                  />
                );
              })}
            </svg>

            {/* Secret Deep Zoom Anomaly (appears if zoom >= 2.5) */}
            {zoom >= 2.4 && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  audioSystem.playStaticBurst(0.4, 0.08);
                  window.dispatchEvent(
                    new CustomEvent('444_SIGNAL_INTERRUPT', {
                      detail: {
                        message: 'YOU WERE NOT SUPPOSED TO LOOK HERE. WAIT FOR THE SECOND SIGNAL.',
                      },
                    })
                  );
                }}
                style={{ left: '55.5%', top: '42%' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer p-1 bg-red-950/80 border border-red-600 animate-pulse z-30"
                title="CLASSIFIED ANOMALY"
              >
                <Sigil444 size={28} interactive={false} className="text-white" />
              </div>
            )}

            {/* Tactical Markers */}
            {TACTICAL_MARKERS.map((marker) => {
              if (!activeLayers[marker.layer]) return null;
              const isSelected = selectedMarker?.id === marker.id;

              return (
                <div
                  key={marker.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkerSelect(marker);
                  }}
                  style={{ left: `${marker.xPercent}%`, top: `${marker.yPercent}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
                >
                  {marker.isEpicenter && is0444Event && (
                    <span className="absolute -inset-3 rounded-full bg-red-600/30 animate-ping pointer-events-none" />
                  )}

                  <div
                    className={`flex items-center justify-center p-1.5 rounded-full border transition-all ${
                      isSelected
                        ? 'border-white bg-red-950 text-white scale-125 shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                        : marker.isEpicenter
                        ? 'border-red-600 bg-black text-red-500 hover:scale-110'
                        : 'border-[#3A4048] bg-black text-[#9BA1A6] hover:border-white hover:text-white'
                    }`}
                  >
                    {marker.isEpicenter ? (
                      <Sigil444 size={20} interactive={false} />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-current" />
                    )}
                  </div>

                  <div className="absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 border border-[#181C20] px-2 py-0.5 text-[9px] text-[#D6D9DC] opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {marker.code}
                  </div>
                </div>
              );
            })}

            {/* User Placed Pins */}
            {userPins.map((pin) => (
              <div
                key={pin.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePinClick(pin.id);
                }}
                style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-25 cursor-pointer"
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 ${
                    selectedPinForConnect === pin.id
                      ? 'border-white bg-red-600 animate-bounce'
                      : 'border-red-500 bg-black'
                  }`}
                />
                <span className="absolute top-4 left-1/2 -translate-x-1/2 bg-black px-1 text-[8px] text-white whitespace-nowrap border border-[#181C20]">
                  {pin.label}
                </span>
              </div>
            ))}
          </div>

          <div className="absolute inset-0 scanlines opacity-35 pointer-events-none" />

          {/* Triangulation HUD Card */}
          <div className="absolute top-3 left-3 bg-black/90 p-2.5 border border-[#181C20] text-[9px] text-[#7E858D] space-y-1">
            <span className="text-white font-bold block">TRIANGULATION RADAR:</span>
            <p>LAT ANCHOR: <span className="text-red-400">62.4835° N [VERIFIED]</span></p>
            <p>LON ANCHOR: <span className="text-red-400">34.2567° E [VERIFIED]</span></p>
            <p>TEMPORAL LOCK: <span className="text-white">{currentTime} UTC</span></p>
          </div>

          {/* Signal Epicenter Detection Alert Banner */}
          {is0444Event && isFreqLocked && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#050608]/95 border border-red-700 px-6 py-2.5 text-center shadow-[0_0_30px_rgba(185,28,28,0.7)] animate-fade-in z-30">
              <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest block">
                SIGNAL ANOMALY DETECTED AT 04:44
              </span>
              <p className="text-xs text-white font-mono mt-0.5 font-semibold">
                CARRIER 444.40 MHz LOCKED ON SECTOR B-4 ({CENTRAL_CONFIG.PRIMARY_COORDINATES})
              </p>
              {showPuzzleAction && (
                <p className="text-[9px] text-red-400 mt-0.5">
                  [ PUZZLE 07 DECRYPTED // ANSWER REGISTERED ]
                </p>
              )}
            </div>
          )}

        </div>

        {/* Selected Marker Detail Dossier */}
        {selectedMarker && (
          <div className="p-5 border border-[#252A2E] bg-[#050608] space-y-3 font-mono animate-fade-in">
            <div className="flex justify-between items-start border-b border-[#181C20] pb-2">
              <div>
                <span className="text-[10px] text-red-500 uppercase tracking-widest font-bold">
                  {selectedMarker.code} · LAYER: {selectedMarker.layer}
                </span>
                <h3 className="text-base text-white font-semibold mt-0.5">
                  {selectedMarker.name}
                </h3>
              </div>
              <span className="text-xs text-red-400 font-mono">
                {selectedMarker.coords}
              </span>
            </div>

            <p className="text-xs text-[#D6D9DC] leading-relaxed">
              {selectedMarker.description}
            </p>

            <div className="pt-2 text-[10px] text-[#7E858D] flex justify-between items-center border-t border-[#111519]">
              <span>CARTOGRAPHIC LOG // SECTOR B-4</span>
              {selectedMarker.isEpicenter && (
                <span className="text-red-400 font-bold">
                  MATCHES 04:44 TRANSMISSION EPICENTER
                </span>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
