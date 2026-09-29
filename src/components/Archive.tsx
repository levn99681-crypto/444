import React, { useState } from 'react';
import { ARCHIVE_EVIDENCE_ITEMS, ArchiveEvidenceItem, ArchiveCategory } from '../data/archiveItems';
import { PhotoForensicViewer } from './PhotoForensicViewer';
import { Sigil444 } from './Sigil444';
import { audioSystem } from '../utils/audioSystem';

interface ArchiveProps {
  onClueDiscovered?: (clue: string) => void;
}

export const Archive: React.FC<ArchiveProps> = ({ onClueDiscovered }) => {
  const [selectedItem, setSelectedItem] = useState<ArchiveEvidenceItem | null>(null);
  const [inspectingItem, setInspectingItem] = useState<ArchiveEvidenceItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<ArchiveCategory | 'ALL'>('ALL');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'puzzle_evidence' | 'lore_evidence' | 'cross_reference'>('ALL');

  const categories: { id: ArchiveCategory | 'ALL'; label: string }[] = [
    { id: 'ALL', label: 'ALL REPOSITORIES' },
    { id: 'FOREST', label: 'A // FOREST' },
    { id: 'BUILDINGS', label: 'B // BUILDINGS' },
    { id: 'ROADS', label: 'C // ROADS' },
    { id: 'DOCUMENTARY', label: 'D // DOCUMENTS' },
    { id: 'CLOSEUP', label: 'E // CLOSE-UP' },
    { id: 'SIGNAL', label: 'F // SIGNAL' },
    { id: 'MAP', label: 'G // CARTOGRAPHY' },
  ];

  const filteredItems = ARCHIVE_EVIDENCE_ITEMS.filter((item) => {
    if (activeCategory !== 'ALL' && item.category !== activeCategory) return false;
    if (roleFilter !== 'ALL' && item.role !== roleFilter) return false;
    return true;
  });

  const handleOpenItem = (item: ArchiveEvidenceItem) => {
    audioSystem.playClick();
    setSelectedItem(item);
  };

  const handleLaunchInspector = (item: ArchiveEvidenceItem) => {
    audioSystem.playClick();
    setSelectedItem(null);
    setInspectingItem(item);
  };

  const handleClueExtracted = (clueText: string) => {
    if (onClueDiscovered) {
      onClueDiscovered(clueText);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#D6D9DC] font-mono pb-24">
      
      {/* Header Bar */}
      <div className="w-full border-b border-[#181C20] bg-[#050608] px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-red-500 uppercase tracking-[0.25em]">
                CLASSIFIED ARCHIVES
              </span>
              <span className="text-[#60676E]">·</span>
              <span className="text-[10px] text-[#7E858D] tracking-widest">
                {ARCHIVE_EVIDENCE_ITEMS.length} DEPOSITED VISUAL ARTIFACTS
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-wider text-white phosphor-text">
              EVIDENCE REPOSITORY
            </h2>
          </div>

          {/* Role Filter Buttons */}
          <div className="flex items-center gap-1 p-1 border border-[#181C20] bg-[#090C0F] text-[10px]">
            {[
              { id: 'ALL', label: 'ALL ROLES' },
              { id: 'puzzle_evidence', label: 'PUZZLE KEYS' },
              { id: 'lore_evidence', label: 'FIELD LORE' },
              { id: 'cross_reference', label: 'CROSS-REFS' },
            ].map((rf) => (
              <button
                key={rf.id}
                onClick={() => {
                  audioSystem.playClick();
                  setRoleFilter(rf.id as any);
                }}
                className={`px-2.5 py-1 tracking-wider transition-colors cursor-pointer ${
                  roleFilter === rf.id
                    ? 'bg-[#181C20] text-white border border-[#252A2E]'
                    : 'text-[#7E858D] hover:text-[#D6D9DC]'
                }`}
              >
                {rf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="w-full border-b border-[#111519] bg-black px-4 sm:px-6 py-2 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 whitespace-nowrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                audioSystem.playClick();
                setActiveCategory(cat.id);
              }}
              className={`px-3 py-1 text-[10px] tracking-wider border transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? 'border-[#7E858D] bg-[#090C0F] text-white font-semibold'
                  : 'border-[#181C20] bg-[#050608] text-[#60676E] hover:text-[#D6D9DC]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Archive Documents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenItem(item)}
              className="group border border-[#181C20] bg-[#050608] hover:border-[#252A2E] hover:bg-[#090C0F] transition-all cursor-pointer flex flex-col justify-between overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
            >
              <div>
                {/* Photo frame */}
                <div className="relative aspect-square border-b border-[#181C20] overflow-hidden bg-black">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover grayscale contrast-125 brightness-80 group-hover:scale-105 group-hover:brightness-95 transition-all duration-500"
                  />
                  <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />
                  
                  {/* Subtle tag overlay */}
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/80 border border-[#181C20] text-[9px] text-white tracking-widest">
                    {item.code}
                  </div>

                  {item.hasSymbol && (
                    <div className="absolute bottom-2 right-2 text-white/50 group-hover:text-red-400 transition-colors">
                      <Sigil444 size={18} interactive={false} />
                    </div>
                  )}

                  {item.role === 'puzzle_evidence' && (
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-red-950/80 border border-red-800 text-[8px] text-red-300 font-bold uppercase tracking-wider">
                      PUZZLE KEY
                    </div>
                  )}
                </div>

                {/* Metadata list */}
                <div className="p-4 space-y-2 text-xs">
                  <h3 className="text-white font-medium text-sm leading-snug group-hover:text-red-300 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <div className="space-y-1 text-[10px] text-[#7E858D] pt-1">
                    <p className="truncate">
                      <span className="text-[#4A5057]">CATEGORY:</span> {item.category}
                    </p>
                    <p className="truncate">
                      <span className="text-[#4A5057]">DATE:</span> {item.date} · {item.time}
                    </p>
                    <p className="truncate">
                      <span className="text-[#4A5057]">LOC:</span> {item.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-4 py-2.5 border-t border-[#111519] bg-black/60 flex items-center justify-between text-[10px] text-[#60676E]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLaunchInspector(item);
                  }}
                  className="text-white hover:text-red-400 flex items-center gap-1 font-semibold"
                >
                  <span>[INSPECT EVIDENCE &rarr;]</span>
                </button>
                <span>{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Dossier Modal */}
      {selectedItem && (
        <div
          onClick={() => setSelectedItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl p-6 border border-[#252A2E] bg-[#050608] space-y-4 font-mono shadow-[0_0_60px_rgba(0,0,0,0.95)]"
          >
            <div className="flex justify-between items-start border-b border-[#181C20] pb-3">
              <div>
                <span className="text-[10px] text-red-500 uppercase tracking-widest font-bold">
                  {selectedItem.code} · {selectedItem.category}
                </span>
                <h3 className="text-base sm:text-lg text-white font-semibold mt-1">
                  {selectedItem.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-xs text-[#7E858D] hover:text-white px-2 py-1 border border-[#181C20]"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-video max-h-56 border border-[#181C20] overflow-hidden bg-black">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale contrast-125"
              />
              <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />
              <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 text-[9px] text-[#9BA1A6]">
                LOC: {selectedItem.location}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-[#60676E] uppercase">FIELD REPORT NOTES:</span>
              <p className="text-xs text-[#D6D9DC] leading-relaxed p-3 border border-[#181C20] bg-black">
                {selectedItem.notes}
              </p>
            </div>

            {selectedItem.crossReferences && selectedItem.crossReferences.length > 0 && (
              <div className="text-[10px] text-[#7E858D]">
                <span className="text-[#60676E]">CROSS-REFERENCED ARTIFACTS:</span>{' '}
                {selectedItem.crossReferences.join(', ')}
              </div>
            )}

            <div className="pt-3 border-t border-[#181C20] flex items-center justify-between">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 border border-[#181C20] text-xs text-[#7E858D] hover:text-white"
              >
                CLOSE
              </button>
              <button
                onClick={() => handleLaunchInspector(selectedItem)}
                className="px-5 py-2 border border-red-900 bg-red-950/40 text-xs text-white hover:border-red-600 hover:bg-red-950 transition-colors"
              >
                [ OPEN FORENSIC INSPECTION SUITE &rarr; ]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forensic Inspection Modal */}
      {inspectingItem && (
        <PhotoForensicViewer
          item={inspectingItem}
          onClose={() => setInspectingItem(null)}
          onClueExtracted={handleClueExtracted}
        />
      )}

    </div>
  );
};
