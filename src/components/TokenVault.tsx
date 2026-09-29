import React from 'react';
import { CENTRAL_CONFIG } from '../config/centralConfig';
import { Sigil444 } from './Sigil444';
import { audioSystem } from '../utils/audioSystem';

interface TokenVaultProps {
  isAllSolved: boolean;
  solvedCount: number;
  totalPuzzles: number;
  onNavigateToPuzzles: () => void;
}

export const TokenVault: React.FC<TokenVaultProps> = ({
  isAllSolved,
  solvedCount,
  totalPuzzles,
  onNavigateToPuzzles,
}) => {
  return (
    <div className="min-h-screen bg-black text-[#D6D9DC] font-mono pb-24">
      
      {/* Header Bar */}
      <div className="w-full border-b border-[#181C20] bg-[#050608] px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-red-500 uppercase tracking-[0.25em]">
                RESTRICTED VAULT // CLEARANCE LEVEL 14
              </span>
              <span className="text-[#60676E]">·</span>
              <span className="text-[10px] text-[#7E858D] tracking-widest">
                PROTOCOL CHANNEL
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-wider text-white phosphor-text">
              444 TOKEN CHANNEL
            </h2>
          </div>

          <div className="text-xs text-[#7E858D]">
            <span>VAULT STATUS: {isAllSolved ? 'UNSEALED' : 'SEALED'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        
        {!isAllSolved ? (
          /* COMPLETELY LOCKED & SEALED STATE */
          <div className="p-8 sm:p-12 border border-[#181C20] bg-[#050608] text-center space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.9)]">
            
            <div className="flex justify-center">
              <div className="p-4 border border-[#252A2E] bg-black text-[#60676E]">
                <Sigil444 size={64} interactive={false} />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold tracking-[0.25em] text-white phosphor-text">
                TOKEN CHANNEL
              </h3>
              
              <div className="space-y-1.5 py-4 border-y border-[#181C20] max-w-sm mx-auto text-xs text-[#9BA1A6]">
                <p>STATUS: <span className="text-red-500 font-bold">SEALED</span></p>
                <p>MARKET DATA: <span className="text-[#60676E]">OFFLINE</span></p>
                <p>CONTRACT: <span className="text-white tracking-widest font-mono">█████████████</span></p>
                <p>NETWORK: <span className="text-[#60676E]">UNKNOWN</span></p>
              </div>

              <p className="text-xs text-[#D6D9DC] font-semibold tracking-wider pt-2">
                THE DOCUMENT HAS NOT BEEN RECOVERED.
              </p>

              <p className="text-[11px] text-[#60676E] max-w-md mx-auto leading-relaxed">
                All 14 anomalous signals must be deciphered before the vault protocol can be initialized. Current progress: {solvedCount} / {totalPuzzles} signals recovered.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => {
                  audioSystem.playClick();
                  onNavigateToPuzzles();
                }}
                className="px-6 py-3 border border-[#252A2E] bg-[#090C0F] text-xs uppercase tracking-widest text-white hover:border-[#7E858D] transition-colors"
              >
                RETURN TO PUZZLE PROGRESSION ({solvedCount}/{totalPuzzles})
              </button>
            </div>

          </div>
        ) : (
          /* UNSEALED STATE (AFTER ALL 14 PUZZLES SOLVED) */
          <div className="p-8 sm:p-12 border border-red-900/60 bg-[#050608] text-center space-y-6 shadow-[0_0_60px_rgba(185,28,28,0.3)] animate-fade-in">
            
            <div className="flex justify-center">
              <Sigil444 size={80} interactive={true} className="text-white" />
            </div>

            <div className="space-y-2">
              <p className="text-[10px] text-red-500 uppercase tracking-[0.3em] font-bold">
                INVESTIGATION COMPLETE
              </p>
              <h3 className="text-2xl font-bold tracking-[0.2em] text-white phosphor-text">
                14 / 14 SIGNALS RECOVERED
              </h3>
              <p className="text-sm text-red-400 font-semibold tracking-wider">
                THE ARCHIVE HAS BEEN UNSEALED.
              </p>
            </div>

            {/* Respecting CENTRAL_CONFIG.TOKEN_LAUNCHED */}
            {!CENTRAL_CONFIG.TOKEN_LAUNCHED ? (
              <div className="p-6 border border-[#181C20] bg-black text-xs text-[#9BA1A6] space-y-3 max-w-md mx-auto">
                <div className="space-y-1 text-center font-mono">
                  <p className="text-white font-semibold">CHANNEL STATUS: AWAITING SECOND SIGNAL</p>
                  <p className="text-[#7E858D]">CONTRACT STATUS: UNDEPLOYED // STANDBY</p>
                  <p className="text-red-400 pt-2 text-[11px] leading-relaxed">
                    The token has not been launched. All official deployment broadcasts will be issued strictly via the Observers Network upon the arrival of the Second Signal.
                  </p>
                  <p className="text-[10px] text-[#4A5057] pt-2">
                    DO NOT TRUST UNOFFICIAL CONTRACTS OR IMPOSTORS.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 border border-[#252A2E] bg-black text-xs text-white space-y-3 max-w-md mx-auto text-left font-mono">
                <p><span className="text-[#7E858D]">NAME:</span> {CENTRAL_CONFIG.TOKEN_NAME}</p>
                <p><span className="text-[#7E858D]">TICKER:</span> {CENTRAL_CONFIG.TOKEN_TICKER}</p>
                <p><span className="text-[#7E858D]">NETWORK:</span> {CENTRAL_CONFIG.TOKEN_NETWORK}</p>
                <p className="break-all"><span className="text-[#7E858D]">CONTRACT:</span> {CENTRAL_CONFIG.TOKEN_CONTRACT}</p>
                {CENTRAL_CONFIG.TOKEN_DEX && (
                  <p><span className="text-[#7E858D]">DEX:</span> <a href={CENTRAL_CONFIG.TOKEN_DEX} target="_blank" rel="noopener noreferrer" className="text-red-400 underline">Trade on DEX</a></p>
                )}
                {CENTRAL_CONFIG.TOKEN_EXPLORER && (
                  <p><span className="text-[#7E858D]">EXPLORER:</span> <a href={CENTRAL_CONFIG.TOKEN_EXPLORER} target="_blank" rel="noopener noreferrer" className="text-red-400 underline">View Explorer</a></p>
                )}
              </div>
            )}

            <div className="text-[11px] text-[#60676E] pt-2">
              RECURRENCE: 04:44:12 UTC // WAIT FOR THE SECOND SIGNAL
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
