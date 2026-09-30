import React, { useState } from 'react';
import { PUZZLES_META, PuzzleInfo } from '../../utils/progressStore';
import { audioSystem } from '../../utils/audioSystem';
import {
  Puzzle01FirstSignal,
  Puzzle02Morse,
  Puzzle03Photograph,
  Puzzle04Caesar,
  Puzzle05MissingAnswer,
  Puzzle06AudioTransmission,
  Puzzle07MapPuzzle,
  Puzzle08ImageForensics,
  Puzzle09Sequence,
  Puzzle10SymbolDeconstruction,
  Puzzle11HiddenText,
  Puzzle12MiniGame,
  Puzzle13UnlistedSignal,
  Puzzle14SecondSignal,
} from './PuzzleSystem';

interface PuzzlesHubProps {
  progressList: number[];
  onSolvePuzzle: (puzzleId: number) => void;
  onNavigateToToken: () => void;
  onNavigateToFinalSignal: () => void;
  onResetProgress?: () => void;
}

export const PuzzlesHub: React.FC<PuzzlesHubProps> = ({
  progressList,
  onSolvePuzzle,
  onNavigateToToken,
  onNavigateToFinalSignal,
  onResetProgress,
}) => {
  const [activePuzzleId, setActivePuzzleId] = useState<number>(() => {
    // Open the first unlocked but unsolved puzzle, or 1
    const firstAvailable = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].find(
      (id) => !progressList.includes(id) && (id === 1 || progressList.includes(id - 1))
    );
    return firstAvailable || 1;
  });
  const [showDependencyGraph, setShowDependencyGraph] = useState<boolean>(false);

  // Puzzle count calculation
  const solvedCount = progressList.filter((id) => id >= 1 && id <= 14).length;
  const isAllSolved = solvedCount >= 14;

  // Researcher lore progression quote
  const getResearcherLog = () => {
    if (solvedCount <= 3) {
      return {
        step: 'LOG 01 // DISCOVERY',
        quote: '“I thought it was a coincidence. A stray 444 harmonic bouncing through the frozen boreal pines.”',
      };
    }
    if (solvedCount <= 7) {
      return {
        step: 'LOG 14 // ANOMALOUS OSCILLATION',
        quote: '“It appears before the equipment is switched on. The needles deflect seconds before transmission.”',
      };
    }
    if (solvedCount <= 11) {
      return {
        step: 'LOG 28 // CARRIER ENGAGED',
        quote: '“Something is answering from across the perimeter. The fourteen pieces are converging.”',
      };
    }
    return {
      step: 'LOG 44 // FINAL LOG ENTRY',
      quote: '“I don’t think we found it. It found us.”',
    };
  };

  const researcherLog = getResearcherLog();

  const handleSelectPuzzle = (id: number) => {
    audioSystem.playClick();
    setActivePuzzleId(id);
  };

  const renderActivePuzzle = () => {
    const isSolved = progressList.includes(activePuzzleId);
    const props = {
      puzzleId: activePuzzleId,
      onSolve: (id: number) => {
        // Enforce that only the current active puzzle being solved can be marked completed
        if (id === activePuzzleId) {
          onSolvePuzzle(id);
          if (id < 14) setActivePuzzleId(id + 1);
        }
      },
      isSolved,
    };

    switch (activePuzzleId) {
      case 1:
        return <Puzzle01FirstSignal {...props} />;
      case 2:
        return <Puzzle02Morse {...props} />;
      case 3:
        return <Puzzle03Photograph {...props} />;
      case 4:
        return <Puzzle04Caesar {...props} />;
      case 5:
        return <Puzzle05MissingAnswer {...props} />;
      case 6:
        return <Puzzle06AudioTransmission {...props} />;
      case 7:
        return <Puzzle07MapPuzzle {...props} />;
      case 8:
        return <Puzzle08ImageForensics {...props} />;
      case 9:
        return <Puzzle09Sequence {...props} />;
      case 10:
        return <Puzzle10SymbolDeconstruction {...props} />;
      case 11:
        return <Puzzle11HiddenText {...props} />;
      case 12:
        return <Puzzle12MiniGame {...props} />;
      case 13:
        return <Puzzle13UnlistedSignal {...props} />;
      case 14:
        return <Puzzle14SecondSignal {...props} />;
      default:
        return null;
    }
  };

  const progressPercent = Math.round((solvedCount / 14) * 100);

  return (
    <div className="min-h-screen bg-black text-[#D6D9DC] font-mono pb-24">
      
      {/* Header Bar */}
      <div className="w-full border-b border-[#181C20] bg-[#050608] px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-red-500 uppercase tracking-[0.25em]">
                PROGRESSION HUB
              </span>
              <span className="text-[#60676E]">·</span>
              <span className="text-[10px] text-[#7E858D] tracking-widest">
                EXACTLY 14 RECOVERY SIGNALS
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-wider text-white phosphor-text">
              INVESTIGATION PROTOCOL
            </h2>
          </div>

          {/* Atmospheric Progress Bar & Graph button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                audioSystem.playClick();
                setShowDependencyGraph(!showDependencyGraph);
              }}
              className="px-3 py-1.5 border border-[#252A2E] bg-[#090C0F] text-[10px] text-white hover:border-[#7E858D] transition-colors"
            >
              {showDependencyGraph ? 'HIDE GRAPH' : 'DEPENDENCY GRAPH'}
            </button>

            {solvedCount > 0 && onResetProgress && (
              <button
                onClick={() => {
                  audioSystem.playClick();
                  onResetProgress();
                  setActivePuzzleId(1);
                }}
                className="px-2.5 py-1.5 border border-red-950/60 bg-black text-[10px] text-[#7E858D] hover:text-red-400 hover:border-red-800 transition-colors cursor-pointer"
                title="Reset progress to 0/14"
              >
                RESET
              </button>
            )}

            <div className="text-right">
              <span className="text-[10px] text-[#7E858D] uppercase tracking-widest block">
                SIGNALS RECOVERED
              </span>
              <span className="text-sm text-white font-bold tracking-wider">
                {solvedCount} / 14 &nbsp;
                <span className="text-red-400">({progressPercent}%)</span>
              </span>
            </div>

            <div className="w-28 sm:w-36 h-2 bg-[#111519] border border-[#181C20]">
              <div
                className="h-full bg-red-700 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Researcher Lore Strip */}
      <div className="w-full border-b border-[#111519] bg-[#050608] px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="text-[9px] text-red-500 font-bold tracking-widest uppercase">
              {researcherLog.step}:
            </span>
            <span className="text-[11px] text-[#D6D9DC] italic truncate">
              {researcherLog.quote}
            </span>
          </div>
          <span className="text-[9px] text-[#60676E] shrink-0 font-mono">
            FIELD OBSERVER // UNKNOWN
          </span>
        </div>
      </div>

      {/* Dependency Graph Modal */}
      {showDependencyGraph && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 animate-fade-in">
          <div className="p-6 border border-[#252A2E] bg-[#050608] space-y-4">
            <div className="flex justify-between items-center border-b border-[#181C20] pb-2">
              <div>
                <span className="text-[10px] text-red-500 uppercase tracking-widest font-bold">
                  SIGNAL CONVERGENCE MAP
                </span>
                <h4 className="text-sm text-white font-bold">
                  INTER-PUZZLE DEPENDENCY GRAPH
                </h4>
              </div>
              <button
                onClick={() => setShowDependencyGraph(false)}
                className="text-xs text-[#7E858D] hover:text-white"
              >
                ✕ CLOSE GRAPH
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 border border-[#181C20] bg-black space-y-1">
                <span className="text-[9px] text-red-400 font-bold">BRANCH 01 // FOUNDATION</span>
                <p className="text-white">P-01 (Cadence 4444)</p>
                <p className="text-[#60676E] text-[10px]">↳ Unlocks P-02 Morse ("SIGNAL")</p>
                <p className="text-[#60676E] text-[10px]">↳ Directs gaze to Archive 017</p>
              </div>

              <div className="p-3 border border-[#181C20] bg-black space-y-1">
                <span className="text-[9px] text-red-400 font-bold">BRANCH 02 // GEOGRAPHY</span>
                <p className="text-white">P-03 (Bunker Sector B-4)</p>
                <p className="text-[#60676E] text-[10px]">↳ Connects P-04 Caesar Cipher</p>
                <p className="text-[#60676E] text-[10px]">↳ Triangulates P-07 Map Vector</p>
              </div>

              <div className="p-3 border border-[#181C20] bg-black space-y-1">
                <span className="text-[9px] text-red-400 font-bold">BRANCH 03 // SPECTRAL</span>
                <p className="text-white">P-06 (444.40 MHz Carrier)</p>
                <p className="text-[#60676E] text-[10px]">↳ Unlocks P-08 Shadow Film</p>
                <p className="text-[#60676E] text-[10px]">↳ Informs P-12 Frequency Mini-Game</p>
              </div>

              <div className="p-3 border border-[#181C20] bg-black space-y-1">
                <span className="text-[9px] text-red-400 font-bold">BRANCH 04 // MASTER</span>
                <p className="text-white">P-13 (Synthesis)</p>
                <p className="text-[#60676E] text-[10px]">↳ Merges 5 anchor elements</p>
                <p className="text-[#60676E] text-[10px]">↳ P-14 Initiates Second Signal</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unsealed Master Announcement (When 14/14 complete) */}
      {isAllSolved && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
          <div className="p-6 border border-red-700 bg-red-950/20 text-center space-y-4 animate-fade-in shadow-[0_0_30px_rgba(185,28,28,0.3)]">
            <div className="space-y-1">
              <span className="text-[10px] text-red-400 font-bold uppercase tracking-[0.3em]">
                INVESTIGATION COMPLETE
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-widest phosphor-text">
                14 / 14 SIGNALS RECOVERED
              </h3>
              <p className="text-xs text-[#D6D9DC] tracking-wider">
                THE ARCHIVE HAS BEEN UNSEALED. THE SECOND SIGNAL IS DETECTED.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={onNavigateToFinalSignal}
                className="px-6 py-2.5 border border-red-600 bg-black text-xs font-semibold uppercase tracking-widest text-white hover:bg-red-950 transition-colors"
              >
                [ ENTER FINAL SIGNAL CEREMONY ]
              </button>
              <button
                onClick={onNavigateToToken}
                className="px-6 py-2.5 border border-[#252A2E] bg-[#090C0F] text-xs font-semibold uppercase tracking-widest text-[#D6D9DC] hover:text-white hover:border-[#7E858D] transition-colors"
              >
                [ VIEW 444 TOKEN CHANNEL ]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Puzzle Selector & Puzzle Work Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: 14 Puzzles List */}
          <div className="lg:col-span-5 space-y-2">
            <p className="text-[10px] text-[#7E858D] uppercase tracking-widest pb-1 border-b border-[#181C20]">
              DECRYPTION CADENCE (SELECT SIGNAL)
            </p>

            <div className="space-y-1.5 max-h-[680px] overflow-y-auto pr-1">
              {PUZZLES_META.map((meta) => {
                const isSolved = progressList.includes(meta.id);
                // Puzzle is unlocked if it's #1 or if previous is solved
                const isUnlocked = meta.id === 1 || progressList.includes(meta.id - 1);
                const isActive = activePuzzleId === meta.id;

                return (
                  <button
                    key={meta.id}
                    disabled={!isUnlocked}
                    onClick={() => isUnlocked && handleSelectPuzzle(meta.id)}
                    className={`w-full text-left p-3 border transition-all text-xs flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'border-[#7E858D] bg-[#090C0F] text-white'
                        : isSolved
                        ? 'border-[#181C20] bg-[#050608] text-[#9BA1A6] hover:border-[#252A2E]'
                        : isUnlocked
                        ? 'border-[#181C20] bg-[#050608] text-[#D6D9DC] hover:border-[#252A2E]'
                        : 'border-[#111519] bg-black/40 text-[#3A4048] cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div className="space-y-0.5 truncate pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#7E858D] font-mono">
                          {meta.code}
                        </span>
                        <span className="font-semibold truncate">{meta.title}</span>
                      </div>
                      <span className="text-[10px] text-[#60676E] block truncate">
                        {meta.type}
                      </span>
                    </div>

                    <div className="shrink-0 text-right">
                      {isSolved ? (
                        <span className="text-[9px] px-1.5 py-0.5 border border-red-900/60 bg-red-950/20 text-red-400 font-bold">
                          RECOVERED
                        </span>
                      ) : isUnlocked ? (
                        <span className="text-[9px] px-1.5 py-0.5 border border-[#252A2E] text-[#9BA1A6]">
                          AVAILABLE
                        </span>
                      ) : (
                        <span className="text-[9px] text-[#3A4048]">
                          SEALED
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Puzzle Workbench */}
          <div className="lg:col-span-7">
            {activePuzzleId && (
              <div className="p-6 border border-[#252A2E] bg-[#050608] space-y-6 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
                
                {/* Puzzle Header */}
                <div className="flex justify-between items-start border-b border-[#181C20] pb-4">
                  <div>
                    <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">
                      {PUZZLES_META[activePuzzleId - 1].code} · {PUZZLES_META[activePuzzleId - 1].type}
                    </span>
                    <h3 className="text-xl text-white font-bold mt-1 tracking-wider phosphor-text">
                      {PUZZLES_META[activePuzzleId - 1].title}
                    </h3>
                  </div>

                  <span className="text-xs font-mono text-[#7E858D]">
                    {progressList.includes(activePuzzleId) ? (
                      <span className="text-red-400 font-bold">[ SIGNAL RECOVERED ]</span>
                    ) : (
                      <span>[ PENDING DECRYPTION ]</span>
                    )}
                  </span>
                </div>

                {/* Puzzle Brief */}
                <p className="text-xs text-[#9BA1A6] leading-relaxed">
                  {PUZZLES_META[activePuzzleId - 1].brief}
                </p>

                {/* Render the Puzzle's Interactive Component */}
                <div className="pt-2">
                  {renderActivePuzzle()}
                </div>

              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
