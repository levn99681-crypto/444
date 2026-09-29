import React from 'react';
import { audioSystem } from '../utils/audioSystem';

interface SigilProps {
  size?: number | string;
  className?: string;
  interactive?: boolean;
  onInterruption?: (msg?: string) => void;
  showNumbers?: boolean;
}

export const Sigil444: React.FC<SigilProps> = ({
  size = 64,
  className = '',
  interactive = true,
  onInterruption,
  showNumbers = false,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (!interactive) return;
    e.stopPropagation();
    audioSystem.playStaticBurst(0.4, 0.08);

    const crypticMessages = [
      "SIGNAL INTERRUPTION // SECOND SIGNAL: NOT YET // WAIT.",
      "SECOND SIGNAL: PENDING // DO NOT TRANSMIT // WAIT FOR 04:44",
      "SIGNAL INTERRUPTION // THE FREQUENCY HAS NOT OPENED // WAIT FOR THE SECOND SIGNAL.",
      "SECOND SIGNAL: WAITING // YOU WERE NOT SUPPOSED TO SEE THIS // WAIT."
    ];
    const chosen = crypticMessages[Math.floor(Math.random() * crypticMessages.length)];

    if (onInterruption) {
      onInterruption(chosen);
    } else {
      // Dispatches custom window event so any listener or global toast can catch it
      window.dispatchEvent(new CustomEvent('444_SIGNAL_INTERRUPT', { detail: { message: chosen } }));
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`inline-flex flex-col items-center justify-center select-none ${
        interactive ? 'cursor-pointer group' : ''
      } ${className}`}
      title={interactive ? 'TRANSMISSION ANOMALY' : undefined}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`transition-all duration-300 ${
          interactive
            ? 'group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] group-active:scale-95 group-hover:scale-[1.02]'
            : ''
        }`}
      >
        <defs>
          <filter id="distortNoise" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        {/* Outer faint reticle circles */}
        <circle cx="100" cy="115" r="92" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.25" strokeDasharray="3 4" />
        <circle cx="100" cy="115" r="76" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.15" />

        {/* Central vertical piercing dagger/axis */}
        <line x1="100" y1="12" x2="100" y2="218" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* Needle tips */}
        <polygon points="100,6 97,18 103,18" fill="currentColor" />
        <polygon points="100,224 98,212 102,212" fill="currentColor" />

        {/* Upper Diamond Frame */}
        <polygon
          points="100,32 138,82 100,122 62,82"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinejoin="round"
        />

        {/* Inner Diamond Core */}
        <polygon
          points="100,48 124,82 100,108 76,82"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
          strokeOpacity="0.6"
        />

        {/* Lateral Chevron Wings (forming twin 4s / runic blades) */}
        {/* Left Wing */}
        <polygon
          points="62,82 22,112 62,142 82,112"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinejoin="round"
        />
        <line x1="22" y1="112" x2="100" y2="112" stroke="currentColor" strokeWidth="1.8" strokeOpacity="0.75" />
        <line x1="62" y1="82" x2="62" y2="148" stroke="currentColor" strokeWidth="2" />
        <line x1="42" y1="97" x2="42" y2="127" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />

        {/* Right Wing */}
        <polygon
          points="138,82 178,112 138,142 118,112"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinejoin="round"
        />
        <line x1="178" y1="112" x2="100" y2="112" stroke="currentColor" strokeWidth="1.8" strokeOpacity="0.75" />
        <line x1="138" y1="82" x2="138" y2="148" stroke="currentColor" strokeWidth="2" />
        <line x1="158" y1="97" x2="158" y2="127" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />

        {/* Bottom V chevron terminating at center axis */}
        <polyline
          points="62,142 100,182 138,142"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinejoin="round"
        />

        {/* Stylized internal rune hash marks */}
        <line x1="84" y1="112" x2="84" y2="145" stroke="currentColor" strokeWidth="1.5" />
        <line x1="116" y1="112" x2="116" y2="145" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      {showNumbers && (
        <span className="mt-1 font-mono tracking-[0.35em] text-xs opacity-75 font-semibold">
          4 4 4
        </span>
      )}
    </div>
  );
};
