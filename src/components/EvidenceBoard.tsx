import React, { useState, useEffect } from 'react';
import { EvidenceItem, getStoredEvidence, saveEvidenceItem } from '../utils/progressStore';
import { audioSystem } from '../utils/audioSystem';
import { Sigil444 } from './Sigil444';

interface ClueNode {
  id: string;
  title: string;
  category: 'TIME' | 'LOCATION' | 'CARRIER' | 'CIPHER' | 'PHOTO';
  content: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  connectedTo: string[];
}

const DEFAULT_BOARD_NODES: ClueNode[] = [
  {
    id: 'node-time',
    title: 'Recurrent Intercept Window',
    category: 'TIME',
    content: '04:44:12 UTC',
    x: 18,
    y: 22,
    connectedTo: ['node-photo'],
  },
  {
    id: 'node-photo',
    title: 'Surveillance Photo // Inscription',
    category: 'PHOTO',
    content: 'ARCHIVE // 003 [Marker 444]',
    x: 48,
    y: 22,
    connectedTo: ['node-coords'],
  },
  {
    id: 'node-coords',
    title: 'Primary Coordinate Vector',
    category: 'LOCATION',
    content: '62.4835° N, 34.2567° E',
    x: 78,
    y: 22,
    connectedTo: ['node-bunker'],
  },
  {
    id: 'node-bunker',
    title: 'Sector B-4 Concrete Monolith',
    category: 'LOCATION',
    content: 'FACILITY SECTOR B-4',
    x: 78,
    y: 65,
    connectedTo: ['node-carrier'],
  },
  {
    id: 'node-carrier',
    title: 'Shortwave Harmonic Carrier',
    category: 'CARRIER',
    content: '444.40 MHz',
    x: 48,
    y: 65,
    connectedTo: ['node-cipher'],
  },
  {
    id: 'node-cipher',
    title: 'Latin Caesar Directive',
    category: 'CIPHER',
    content: 'JVIUYIRGC -> FREQUENCY',
    x: 18,
    y: 65,
    connectedTo: ['node-time'],
  }
];

export const EvidenceBoard: React.FC = () => {
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [boardNodes, setBoardNodes] = useState<ClueNode[]>(DEFAULT_BOARD_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState<string>('ALL');
  const [signalPulseActive, setSignalPulseActive] = useState<boolean>(false);

  // New Note Modal
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'TIME' | 'LOCATION' | 'CARRIER' | 'CIPHER' | 'PHOTO'>('LOCATION');

  useEffect(() => {
    setEvidenceList(getStoredEvidence());

    const handleUpdate = () => {
      setEvidenceList(getStoredEvidence());
    };
    window.addEventListener('444_EVIDENCE_UPDATED', handleUpdate);
    return () => window.removeEventListener('444_EVIDENCE_UPDATED', handleUpdate);
  }, []);

  const handleNodeClick = (nodeId: string) => {
    audioSystem.playClick();
    if (!selectedNodeId) {
      setSelectedNodeId(nodeId);
    } else if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    } else {
      // Toggle connection between selectedNodeId and nodeId
      setBoardNodes((prev) => {
        const updated = prev.map((node) => {
          if (node.id === selectedNodeId) {
            const has = node.connectedTo.includes(nodeId);
            return {
              ...node,
              connectedTo: has
                ? node.connectedTo.filter((id) => id !== nodeId)
                : [...node.connectedTo, nodeId],
            };
          }
          return node;
        });
        return updated;
      });

      // Trigger red string signal pulse!
      setSignalPulseActive(true);
      audioSystem.playMorseTone(444, 120);
      setTimeout(() => setSignalPulseActive(false), 1400);

      setSelectedNodeId(null);
    }
  };

  const handleCreateNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    audioSystem.playClick();
    const rx = Math.floor(20 + Math.random() * 60);
    const ry = Math.floor(30 + Math.random() * 40);

    const newNode: ClueNode = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      content: newContent.trim(),
      x: rx,
      y: ry,
      connectedTo: [],
    };

    setBoardNodes((prev) => [...prev, newNode]);

    // Also persist in evidence store
    saveEvidenceItem({
      id: newNode.id,
      archiveId: `FIELD // ${newCategory}`,
      title: newTitle.trim(),
      type: 'DOCUMENT',
      content: newContent.trim(),
      discoveredAt: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      notes: 'Investigator board connection.',
    });

    setNewTitle('');
    setNewContent('');
    setShowAddForm(false);
  };

  // Check if closed loop of 4 core nodes exists
  const isLoopFormed = boardNodes.some((n) => n.connectedTo.length >= 2);

  return (
    <div className="min-h-screen bg-black text-[#D6D9DC] font-mono pb-24">
      
      {/* Header Bar */}
      <div className="w-full border-b border-[#181C20] bg-[#050608] px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-red-500 uppercase tracking-[0.25em]">
                ANOMALY CORRELATION 2.0
              </span>
              <span className="text-[#60676E]">·</span>
              <span className="text-[10px] text-[#7E858D] tracking-widest">
                EVIDENCE BOARD // STRING MATRIX
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-wider text-white phosphor-text">
              INVESTIGATION BOARD
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                audioSystem.playClick();
                setShowAddForm(!showAddForm);
              }}
              className="px-4 py-2 border border-[#252A2E] bg-[#090C0F] text-xs tracking-wider text-white hover:border-[#7E858D] transition-colors cursor-pointer"
            >
              {showAddForm ? '[ CLOSE FORM ]' : '[ PIN NEW CLUE ]'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Board Instruction HUD */}
        <div className="p-4 border border-[#181C20] bg-[#050608] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-white font-semibold">
              FIELD INSTRUCTION: Connect evidence nodes using red correlation thread.
            </p>
            <p className="text-[#7E858D] text-[11px]">
              Tap any two pins to attach or remove a yarn thread. When related clues link ([04:44] &rarr; [PHOTO] &rarr; [COORDINATES] &rarr; [SECTOR B-4]), carrier resonance pulses.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {selectedNodeId && (
              <span className="px-3 py-1 border border-red-700 bg-red-950/40 text-red-400 text-[10px] animate-pulse">
                PIN SELECTED &mdash; TAP SECOND PIN TO CONNECT
              </span>
            )}
            <button
              onClick={() => {
                audioSystem.playClick();
                setBoardNodes(DEFAULT_BOARD_NODES);
              }}
              className="px-3 py-1 text-[10px] border border-[#181C20] text-[#7E858D] hover:text-white"
            >
              RESET THREADS
            </button>
          </div>
        </div>

        {/* New Pin Modal Form */}
        {showAddForm && (
          <div className="p-6 border border-[#252A2E] bg-[#090C0F] max-w-xl mx-auto space-y-4 animate-fade-in text-xs">
            <div className="flex justify-between items-center border-b border-[#181C20] pb-2">
              <span className="text-white font-bold uppercase tracking-wider">
                PIN NEW FIELD NOTE TO MATRIX
              </span>
              <button onClick={() => setShowAddForm(false)} className="text-[#7E858D] hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateNode} className="space-y-3">
              <div>
                <label className="block text-[10px] text-[#7E858D] uppercase mb-1">CLUE TITLE:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Tower Radiation Spike"
                  className="w-full bg-black border border-[#181C20] p-2 text-white outline-none focus:border-[#7E858D]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#7E858D] uppercase mb-1">CATEGORY:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-black border border-[#181C20] p-2 text-white outline-none"
                >
                  <option value="TIME">TIME / TEMPORAL</option>
                  <option value="LOCATION">LOCATION / MAP</option>
                  <option value="CARRIER">CARRIER FREQUENCY</option>
                  <option value="CIPHER">CIPHER / KEY</option>
                  <option value="PHOTO">PHOTO ARTIFACT</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-[#7E858D] uppercase mb-1">EXACT TELEMETRY / CONTENT:</label>
                <input
                  type="text"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="e.g. 444.40 MHz or Latitude"
                  className="w-full bg-black border border-[#181C20] p-2 text-white outline-none focus:border-[#7E858D]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 border border-red-900 bg-red-950/40 text-white font-bold hover:bg-red-950 uppercase tracking-widest text-xs"
              >
                ATTACH PIN TO CORKBOARD
              </button>
            </form>
          </div>
        )}

        {/* Interactive Evidence Corkboard Matrix Viewport */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[520px] border border-[#181C20] bg-[#050608] shadow-[inset_0_0_100px_rgba(0,0,0,0.98)] overflow-hidden select-none">
          
          {/* Subtle Cork Grid Texture */}
          <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />

          {/* SVG Yarn / String Layer connecting pins */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {boardNodes.flatMap((sourceNode) =>
              sourceNode.connectedTo.map((targetId) => {
                const targetNode = boardNodes.find((n) => n.id === targetId);
                if (!targetNode) return null;
                return (
                  <line
                    key={`${sourceNode.id}-${targetNode.id}`}
                    x1={`${sourceNode.x}%`}
                    y1={`${sourceNode.y}%`}
                    x2={`${targetNode.x}%`}
                    y2={`${targetNode.y}%`}
                    stroke="#B91C1C"
                    strokeWidth={signalPulseActive ? '2.5' : '1.8'}
                    strokeDasharray={signalPulseActive ? '6 3' : undefined}
                    className={signalPulseActive ? 'animate-pulse' : ''}
                    opacity="0.85"
                  />
                );
              })
            )}
          </svg>

          {/* Interactive Evidence Cards / Pins */}
          {boardNodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            return (
              <div
                key={node.id}
                onClick={() => handleNodeClick(node.id)}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20 max-w-[190px] sm:max-w-[220px]"
              >
                {/* Physical Red Pushpin */}
                <div
                  className={`w-3.5 h-3.5 mx-auto rounded-full border-2 transition-all ${
                    isSelected
                      ? 'border-white bg-red-600 scale-125 shadow-[0_0_12px_rgba(255,255,255,0.8)]'
                      : 'border-red-950 bg-red-800'
                  }`}
                />

                {/* Card Container */}
                <div
                  className={`mt-1 p-3 border transition-all text-xs font-mono ${
                    isSelected
                      ? 'border-white bg-[#111519] shadow-[0_0_20px_rgba(0,0,0,0.9)] scale-105'
                      : 'border-[#181C20] bg-[#090C0F]/95 hover:border-[#3A4048]'
                  }`}
                >
                  <div className="flex justify-between items-center text-[8px] text-[#60676E] border-b border-[#111519] pb-1 mb-1">
                    <span>{node.category}</span>
                    <span className="text-red-500 font-bold">
                      {node.connectedTo.length > 0 ? `(${node.connectedTo.length} THREADS)` : ''}
                    </span>
                  </div>

                  <h4 className="text-[11px] font-bold text-white leading-tight">
                    {node.title}
                  </h4>

                  <p className="mt-1.5 p-1 bg-black text-[10px] text-red-400 font-mono tracking-wider border border-[#181C20] truncate">
                    {node.content}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Resonance Pulse Alert Banner */}
          {signalPulseActive && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-950/90 border border-red-600 px-6 py-2 text-center text-xs text-white font-mono shadow-[0_0_25px_rgba(185,28,28,0.7)] animate-fade-in z-30">
              CORRELATION PULSE DETECTED // CARRIER THREAD STABILIZED
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
