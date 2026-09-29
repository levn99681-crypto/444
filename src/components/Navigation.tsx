import React, { useState } from 'react';
import { Sigil444 } from './Sigil444';
import { audioSystem } from '../utils/audioSystem';

export type SectionType =
  | 'SIGNAL'
  | 'ARCHIVE'
  | 'EVIDENCE'
  | 'TRANSMISSIONS'
  | 'MAP'
  | 'PUZZLES'
  | 'THE OBSERVERS'
  | '444 TOKEN';

interface NavigationProps {
  currentSection: SectionType;
  onSelectSection: (section: SectionType) => void;
  solvedCount: number;
  totalPuzzles: number;
  onLockSession: () => void;
}

export const Navigation: React.FC<NavigationProps & { onOpenSignalHunt?: () => void }> = ({
  currentSection,
  onSelectSection,
  solvedCount,
  totalPuzzles,
  onLockSession,
  onOpenSignalHunt,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(audioSystem.getMuted());

  const navItems: { id: SectionType; label: string; code: string }[] = [
    { id: 'SIGNAL', label: 'SIGNAL', code: '01' },
    { id: 'ARCHIVE', label: 'ARCHIVE', code: '02' },
    { id: 'EVIDENCE', label: 'EVIDENCE', code: '03' },
    { id: 'TRANSMISSIONS', label: 'TRANSMISSIONS', code: '04' },
    { id: 'MAP', label: 'MAP', code: '05' },
    { id: 'PUZZLES', label: 'PUZZLES', code: '06' },
    { id: 'THE OBSERVERS', label: 'OBSERVERS', code: '07' },
    { id: '444 TOKEN', label: '444 TOKEN', code: '08' },
  ];

  const handleNavClick = (section: SectionType) => {
    audioSystem.playClick();
    onSelectSection(section);
    setMobileMenuOpen(false);
  };

  const handleSoundToggle = () => {
    const muted = audioSystem.toggleMute();
    setIsMuted(muted);
  };

  const progressPercent = Math.round((solvedCount / totalPuzzles) * 100);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#181C20] bg-black/90 backdrop-blur-md select-none font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        
        {/* Left: 444 Sigil and Identity */}
        <div className="flex items-center gap-3">
          <Sigil444 size={28} className="text-white hover:text-red-400" />
          <button
            onClick={() => handleNavClick('SIGNAL')}
            className="text-left group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-[0.25em] text-white group-hover:text-white/80">
                444
              </span>
              <span className="hidden sm:inline-block text-[10px] tracking-[0.2em] text-[#60676E] border-l border-[#181C20] pl-2">
                SIGNAL DETECTED
              </span>
            </div>
          </button>
        </div>

        {/* Center: Desktop Archive Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3 py-1.5 text-[11px] tracking-[0.18em] transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-white bg-[#090C0F] border border-[#252A2E]'
                    : 'text-[#7E858D] hover:text-[#D6D9DC] hover:bg-[#050608]'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 left-0 w-full h-[1px] bg-red-600/70" />
                )}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Progress Tracker & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Signal Hunt Side Game Launcher */}
          {onOpenSignalHunt && (
            <button
              onClick={() => {
                audioSystem.playClick();
                onOpenSignalHunt();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] tracking-wider border border-red-900 bg-red-950/30 text-white hover:border-red-600 hover:bg-red-950 transition-colors"
              title="Launch Optional Signal Hunt Side Game"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>HUNT</span>
            </button>
          )}

          {/* Progress display */}
          <div
            onClick={() => handleNavClick('PUZZLES')}
            className="flex items-center gap-2 cursor-pointer py-1 px-2 border border-[#181C20] bg-[#050608] hover:border-[#252A2E] transition-colors"
            title="Investigation Progress"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[10px] tracking-wider text-[#9BA1A6] tabular-nums">
              {solvedCount}/{totalPuzzles}
            </span>
            <span className="hidden md:inline text-[9px] text-[#60676E] tracking-widest">
              ({progressPercent}%)
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleSoundToggle}
            className="px-2 py-1 text-[10px] tracking-widest border border-[#181C20] bg-[#050608] text-[#7E858D] hover:text-[#D6D9DC] hover:border-[#252A2E] transition-colors cursor-pointer"
            title="Toggle Ambient Audio"
          >
            SOUND: {isMuted ? 'OFF' : 'ON'}
          </button>

          {/* Lock / Exit Gate Button */}
          <button
            onClick={() => {
              audioSystem.playStaticBurst(0.2, 0.05);
              onLockSession();
            }}
            className="hidden sm:block text-[10px] tracking-widest text-[#4A5057] hover:text-red-400/80 transition-colors cursor-pointer"
            title="Lock Archive / Clear Session"
          >
            [LOCK]
          </button>

          {/* Mobile Index Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden px-2.5 py-1 text-[11px] tracking-widest border border-[#252A2E] bg-[#090C0F] text-[#D6D9DC] cursor-pointer"
          >
            {mobileMenuOpen ? 'CLOSE' : 'INDEX'}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#181C20] bg-[#050608]/98 px-6 py-4 space-y-2 animate-fade-in">
          <p className="text-[10px] tracking-[0.25em] text-[#60676E] uppercase pb-2 border-b border-[#111519]">
            ARCHIVE DIRECTORY // INDEX
          </p>
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`p-2 text-left text-xs tracking-wider border transition-colors cursor-pointer ${
                  currentSection === item.id
                    ? 'border-[#252A2E] bg-[#111519] text-white'
                    : 'border-[#111519] bg-[#050608] text-[#7E858D] hover:text-white'
                }`}
              >
                <div className="text-[9px] text-[#4A5057]">{item.code}</div>
                <div>{item.label}</div>
              </button>
            ))}
          </div>

          <div className="pt-3 flex justify-between items-center border-t border-[#111519] text-[10px] text-[#60676E]">
            <span>RECOVERED: {solvedCount}/{totalPuzzles} SIGNALS</span>
            <button
              onClick={onLockSession}
              className="text-red-400/80 hover:text-red-300"
            >
              [TERMINATE SESSION]
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
