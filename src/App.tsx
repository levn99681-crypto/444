/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AccessGate } from './components/AccessGate';
import { OpeningSequence } from './components/OpeningSequence';
import { Navigation, SectionType } from './components/Navigation';
import { SignalHome } from './components/SignalHome';
import { Archive } from './components/Archive';
import { EvidenceBoard } from './components/EvidenceBoard';
import { Transmissions } from './components/Transmissions';
import { InteractiveMap } from './components/InteractiveMap';
import { PuzzlesHub } from './components/puzzles/PuzzlesHub';
import { TheObservers } from './components/TheObservers';
import { TokenVault } from './components/TokenVault';
import { FinalSignal } from './components/FinalSignal';
import { SecretInterruptionModal } from './components/SecretInterruptionModal';
import { SignalHuntGame } from './components/SignalHuntGame';
import { clearStoredProgress, getStoredProgress, saveSolvedPuzzle } from './utils/progressStore';
import { audioSystem } from './utils/audioSystem';
import { CENTRAL_CONFIG } from './config/centralConfig';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showOpening, setShowOpening] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<SectionType>('SIGNAL');
  const [progressList, setProgressList] = useState<number[]>([]);
  const [showFinalSignalCeremony, setShowFinalSignalCeremony] = useState<boolean>(false);
  const [showSignalHuntModal, setShowSignalHuntModal] = useState<boolean>(false);

  useEffect(() => {
    // Check if user has previously authenticated
    const authStatus = localStorage.getItem('444_SIGNAL_AUTH');
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true);
    }
    setProgressList(getStoredProgress());

    const handleProgressUpdate = () => {
      setProgressList(getStoredProgress());
    };
    window.addEventListener('444_PROGRESS_UPDATED', handleProgressUpdate);
    return () => window.removeEventListener('444_PROGRESS_UPDATED', handleProgressUpdate);
  }, []);

  const handleGateSuccess = () => {
    setShowOpening(true);
  };

  const handleOpeningComplete = () => {
    setShowOpening(false);
    setIsAuthenticated(true);
    audioSystem.startDrone();
  };

  const handleLockSession = () => {
    localStorage.removeItem('444_SIGNAL_AUTH');
    setIsAuthenticated(false);
    setShowOpening(false);
    setCurrentSection('SIGNAL');
    audioSystem.stopDrone();
  };

  const handleSolvePuzzle = (puzzleId: number) => {
    const updated = saveSolvedPuzzle(puzzleId);
    setProgressList(updated);
  };

  const handleResetProgress = () => {
    const updated = clearStoredProgress();
    setProgressList(updated);
  };

  // Solved count (between 1 and 14)
  const solvedCount = progressList.filter((id) => id >= 1 && id <= 14).length;
  const isAllSolved = solvedCount >= 14;

  // If not authenticated, show Access Gate
  if (!isAuthenticated && !showOpening) {
    return <AccessGate onSuccess={handleGateSuccess} />;
  }

  // If currently showing opening sequence
  if (showOpening) {
    return <OpeningSequence onComplete={handleOpeningComplete} />;
  }

  // If viewing the Final Signal ceremony
  if (showFinalSignalCeremony) {
    return (
      <FinalSignal
        onReturnToArchive={() => setShowFinalSignalCeremony(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#D6D9DC] font-mono selection:bg-red-950 selection:text-white flex flex-col justify-between">
      
      {/* Global Signal Interruption Popups */}
      <SecretInterruptionModal />

      {/* Persistent Classified Archive Navigation */}
      <div>
        <Navigation
          currentSection={currentSection}
          onSelectSection={(sec) => setCurrentSection(sec)}
          solvedCount={solvedCount}
          totalPuzzles={14}
          onLockSession={handleLockSession}
          onOpenSignalHunt={() => setShowSignalHuntModal(true)}
        />

        {/* Optional 2D Signal Hunt Side Game Modal */}
        {showSignalHuntModal && (
          <SignalHuntGame onClose={() => setShowSignalHuntModal(false)} />
        )}

        {/* Main Content Router */}
        <main className="w-full">
          {currentSection === 'SIGNAL' && (
            <SignalHome
              onNavigate={(sec) => setCurrentSection(sec)}
              solvedCount={solvedCount}
              totalPuzzles={14}
              onOpenSignalHunt={() => setShowSignalHuntModal(true)}
            />
          )}

          {currentSection === 'ARCHIVE' && <Archive />}

          {currentSection === 'EVIDENCE' && <EvidenceBoard />}

          {currentSection === 'TRANSMISSIONS' && <Transmissions />}

          {currentSection === 'MAP' && (
            <InteractiveMap
              onSignalFound={(coords) => {
                handleSolvePuzzle(7);
              }}
              showPuzzleAction={true}
            />
          )}

          {currentSection === 'PUZZLES' && (
            <PuzzlesHub
              progressList={progressList}
              onSolvePuzzle={handleSolvePuzzle}
              onNavigateToToken={() => setCurrentSection('444 TOKEN')}
              onNavigateToFinalSignal={() => setShowFinalSignalCeremony(true)}
              onResetProgress={handleResetProgress}
            />
          )}

          {currentSection === 'THE OBSERVERS' && <TheObservers />}

          {currentSection === '444 TOKEN' && (
            <TokenVault
              isAllSolved={isAllSolved}
              solvedCount={solvedCount}
              totalPuzzles={14}
              onNavigateToPuzzles={() => setCurrentSection('PUZZLES')}
            />
          )}
        </main>
      </div>

      {/* Atmospheric Investigation Footer */}
      <footer className="w-full border-t border-[#181C20] bg-[#050608] py-8 px-4 sm:px-6 select-none text-[11px] text-[#60676E]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-white font-bold tracking-widest">444</span>
            <span>·</span>
            <span>SIGNAL DETECTED</span>
            <span>·</span>
            <span className="text-[#4A5057]">COORDINATES: {CENTRAL_CONFIG.PRIMARY_COORDINATES}</span>
          </div>

          <div className="text-center md:text-right space-y-1">
            <p className="tracking-widest text-[#7E858D]">
              {CENTRAL_CONFIG.RECURRING_PHRASE}.
            </p>
            <p className="text-[10px] text-[#4A5057]">
              RECOVERED ARCHIVE SPECIFICATION 04:44:12 UTC · ALL SIGNALS CLASSIFIED
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
