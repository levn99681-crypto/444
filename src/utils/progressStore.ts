/**
 * 444 — Progress Store & Puzzle Definitions
 * Persists puzzle completion and discovered evidence to localStorage.
 */

export interface PuzzleInfo {
  id: number;
  code: string;
  title: string;
  type: string;
  brief: string;
  unlocked: boolean;
  solved: boolean;
  solutionHash?: string; // For verification
  recoveredSignal?: string;
}

export interface EvidenceItem {
  id: string;
  archiveId: string;
  title: string;
  type: 'COORDINATE' | 'TIMESTAMP' | 'AUDIO_FREQUENCY' | 'SIGIL' | 'CIPHER' | 'PHOTO' | 'DOCUMENT';
  content: string;
  discoveredAt: string;
  notes?: string;
}

export const PUZZLES_META: Omit<PuzzleInfo, 'unlocked' | 'solved'>[] = [
  {
    id: 1,
    code: "PUZZLE 01",
    title: "THE FIRST SIGNAL",
    type: "Observation / Pattern Recognition",
    brief: "The sequence 4 44 444 carries an unlisted anomaly. Look closer at the frequency.",
    recoveredSignal: "SIG-01: THE AWAKENING [4-44-444-4444]"
  },
  {
    id: 2,
    code: "PUZZLE 02",
    title: "MORSE TRANSMISSION",
    type: "Shortwave Intercept / Audio-Visual",
    brief: "An eerie broadcast repeated on loop. Decode the rhythmic pulse of the carrier wave.",
    recoveredSignal: "SIG-02: CARRIER PULSE [SIGNAL DETECTED]"
  },
  {
    id: 3,
    code: "PUZZLE 03",
    title: "THE PHOTOGRAPH",
    type: "Archival Forensics",
    brief: "One of the recovered images contains a hidden coordinate stamp etched into concrete.",
    recoveredSignal: "SIG-03: FACILITY DESIGNATION [SECTOR B-4]"
  },
  {
    id: 4,
    code: "PUZZLE 04",
    title: "CAESAR CIPHER",
    type: "Classical Cryptography",
    brief: "Shifted by the sacred number of the broadcast. Invert the offset to read the directive.",
    recoveredSignal: "SIG-04: DIRECTIVE [FREQUENCY LOCKED]"
  },
  {
    id: 5,
    code: "PUZZLE 05",
    title: "THE MISSING ANSWER",
    type: "Manual Verification",
    brief: "THIS ANSWER WAS NEVER ARCHIVED. YOU WILL NEED TO FIND SOMEONE WHO KNOWS IT.",
    recoveredSignal: "SIG-05: OBSERVER CLEARANCE [CONFIRMED]"
  },
  {
    id: 6,
    code: "PUZZLE 06",
    title: "AUDIO TRANSMISSION",
    type: "Spectral Tone Analysis",
    brief: "A short wave frequency tone sequence intercepted at 04:44. Identify the base frequency.",
    recoveredSignal: "SIG-06: RESONANCE [444.40 MHZ]"
  },
  {
    id: 7,
    code: "PUZZLE 07",
    title: "THE MAP",
    type: "Cartographic Reconnaissance",
    brief: "Locate the anomalous radio transmission installation within the dark exclusion zone.",
    recoveredSignal: "SIG-07: SECTOR VECTOR [62.4835 N, 34.2567 E]"
  },
  {
    id: 8,
    code: "PUZZLE 08",
    title: "IMAGE MANIPULATION",
    type: "Forensic Contrast Enhancement",
    brief: "The recovered film negative is almost completely pitch black. Tune exposure and contrast.",
    recoveredSignal: "SIG-08: LATENT INSCRIPTION [SHADOW TRANSMITTER]"
  },
  {
    id: 9,
    code: "PUZZLE 09",
    title: "SEQUENCE",
    type: "Chronological Forensics",
    brief: "Arrange the intercepted surveillance timestamps into their true temporal order.",
    recoveredSignal: "SIG-09: TIMELINE COHERENCE [04:10 -> 04:58]"
  },
  {
    id: 10,
    code: "PUZZLE 10",
    title: "SYMBOL DECONSTRUCTION",
    type: "Geometric Alignment",
    brief: "Reconstruct the sacred 444 sigil from its severed geometric fragments.",
    recoveredSignal: "SIG-10: ICONOGRAPHY [SIGIL ALIGNED]"
  },
  {
    id: 11,
    code: "PUZZLE 11",
    title: "HIDDEN TEXT",
    type: "Steganographic Intercept",
    brief: "Classified memo appears meaningless. Read between the lines with interval cadence.",
    recoveredSignal: "SIG-11: STEGANOGRAPHY [SEEK THE DEEP FREQUENCY]"
  },
  {
    id: 12,
    code: "PUZZLE 12",
    title: "MINI GAME: SIGNAL LOCK",
    type: "Analog Frequency Tuning",
    brief: "Calibrate the analog receiver through static interference to isolate the harmonic core.",
    recoveredSignal: "SIG-12: HARMONIC LOCK [CARRIER STABILIZED]"
  },
  {
    id: 13,
    code: "PUZZLE 13",
    title: "THE UNLISTED SIGNAL",
    type: "Cross-Archive Deduction",
    brief: "Synthesize the 5 critical anchors recovered across previous documents, maps, and audio.",
    recoveredSignal: "SIG-13: SYNTHESIS [KEY CONVERGENCE]"
  },
  {
    id: 14,
    code: "PUZZLE 14",
    title: "SECOND SIGNAL",
    type: "The Master Signal",
    brief: "All recovered pieces converge. Initiate transmission lock and prepare for the Second Signal.",
    recoveredSignal: "SIG-14: SECOND SIGNAL [INITIATED]"
  }
];

const INITIAL_EVIDENCE: EvidenceItem[] = [
  {
    id: 'ev-1',
    archiveId: 'ARCHIVE // 003',
    title: 'Coordinates Found',
    type: 'COORDINATE',
    content: '62.4835° N, 34.2567° E',
    discoveredAt: '04:44:12',
    notes: 'Inscribed on road marker near abandoned boreal clearing.'
  },
  {
    id: 'ev-2',
    archiveId: 'ARCHIVE // 008',
    title: 'Temporal Recurrence',
    type: 'TIMESTAMP',
    content: '04:10 -> 04:44:12',
    discoveredAt: 'SURVEILLANCE LOG',
    notes: 'All anomalous signals burst consistently at 04:44.'
  },
  {
    id: 'ev-3',
    archiveId: 'ARCHIVE // 004',
    title: 'The Radar Sigil',
    type: 'SIGIL',
    content: 'Piercing Dagger Axis with Twin Chevron Wings',
    discoveredAt: 'OSCILLOSCOPE',
    notes: 'Phosphor CRT monitor locked on unknown geometry.'
  }
];

export const getStoredProgress = (): number[] => {
  if (typeof window === 'undefined') return [1];
  try {
    const raw = localStorage.getItem('444_SIGNAL_PROGRESS');
    if (!raw) return [1]; // Puzzle 1 is always unlocked first
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [1];
  } catch {
    return [1];
  }
};

export const saveSolvedPuzzle = (puzzleId: number): number[] => {
  const current = getStoredProgress();
  const set = new Set(current);
  set.add(puzzleId);
  // Auto-unlock next puzzle
  if (puzzleId < 14) {
    set.add(puzzleId + 1);
  }
  const updated = Array.from(set);
  if (typeof window !== 'undefined') {
    localStorage.setItem('444_SIGNAL_PROGRESS', JSON.stringify(updated));
    window.dispatchEvent(new Event('444_PROGRESS_UPDATED'));
  }
  return updated;
};

export const getStoredEvidence = (): EvidenceItem[] => {
  if (typeof window === 'undefined') return INITIAL_EVIDENCE;
  try {
    const raw = localStorage.getItem('444_EVIDENCE_BOARD');
    if (!raw) return INITIAL_EVIDENCE;
    return JSON.parse(raw);
  } catch {
    return INITIAL_EVIDENCE;
  }
};

export const saveEvidenceItem = (item: EvidenceItem): EvidenceItem[] => {
  const current = getStoredEvidence();
  if (current.some(e => e.id === item.id || e.content === item.content)) return current;
  const updated = [...current, item];
  if (typeof window !== 'undefined') {
    localStorage.setItem('444_EVIDENCE_BOARD', JSON.stringify(updated));
    window.dispatchEvent(new Event('444_EVIDENCE_UPDATED'));
  }
  return updated;
};
