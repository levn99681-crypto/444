/**
 * 444 — Progress Store & Puzzle Definitions
 * Persists puzzle completion and discovered evidence to localStorage.
 */

import { CENTRAL_CONFIG } from '../config/centralConfig';

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
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('444_SIGNAL_PROGRESS');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const valid = Array.from(
      new Set(parsed.filter((n): n is number => typeof n === 'number' && n >= 1 && n <= 14))
    ).sort((a, b) => a - b);
    return valid;
  } catch {
    return [];
  }
};

export const saveSolvedPuzzle = (puzzleId: number): number[] => {
  const current = getStoredProgress();
  const set = new Set(current);
  set.add(puzzleId);
  const updated = Array.from(set).sort((a, b) => a - b);
  if (typeof window !== 'undefined') {
    localStorage.setItem('444_SIGNAL_PROGRESS', JSON.stringify(updated));
    window.dispatchEvent(new Event('444_PROGRESS_UPDATED'));
  }
  return updated;
};

export const clearStoredProgress = (): number[] => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('444_SIGNAL_PROGRESS');
    window.dispatchEvent(new Event('444_PROGRESS_UPDATED'));
  }
  return [];
};

/**
 * Normalizes input for answer comparison: trims whitespace, collapses inner spaces, uppercases.
 */
export const normalizeAnswer = (str: string): string => {
  return str.trim().toUpperCase().replace(/\s+/g, ' ');
};

export interface PuzzleValidationRule {
  id: number;
  acceptedAnswers: string[];
  customValidator?: (cleanInput: string) => boolean;
}

export const PUZZLE_VALIDATION_RULES: PuzzleValidationRule[] = [
  {
    id: 1,
    acceptedAnswers: ['444', '4444', '4 44 444 4444'],
  },
  {
    id: 2,
    acceptedAnswers: ['SIGNAL', '444'],
  },
  {
    id: 3,
    acceptedAnswers: ['SECTOR B-4', 'B-4', 'B4', 'SECTOR B4'],
  },
  {
    id: 4,
    acceptedAnswers: ['FREQUENCY', 'THIRD SIGNAL'],
  },
  {
    id: 5,
    acceptedAnswers: ['444ANGEL', '444 ANGEL', 'OBSERVER_444', 'OBSERVER'],
    customValidator: (clean) => {
      const configAns = normalizeAnswer(CENTRAL_CONFIG.MANUAL_PUZZLE_05_ANSWER || '444Angel');
      return (
        clean === configAns ||
        clean === '444ANGEL' ||
        clean === '444 ANGEL' ||
        clean === 'OBSERVER_444' ||
        clean === 'OBSERVER'
      );
    },
  },
  {
    id: 6,
    acceptedAnswers: ['444', '444.40', '444.4', '444 HZ', '444.40 MHZ'],
  },
  {
    id: 7,
    acceptedAnswers: ['62.4835 N, 34.2567 E', '62.4835, 34.2567'],
    customValidator: (clean) => clean.includes('62.4835') || clean.includes('34.2567'),
  },
  {
    id: 8,
    acceptedAnswers: ['SHADOW TRANSMITTER', 'SHADOW TRANSMITTER 444'],
  },
  {
    id: 9,
    acceptedAnswers: ['1,2,3,4', 'SEQUENCE_COMPLETE'],
    customValidator: (clean) => clean === 'SEQUENCE_COMPLETE' || clean === '1,2,3,4',
  },
  {
    id: 10,
    acceptedAnswers: ['SIGIL_ALIGNED', '0,0,0,0'],
  },
  {
    id: 11,
    acceptedAnswers: ['SEEK THE DEEP FREQUENCY', 'SEEK DEEP FREQUENCY'],
  },
  {
    id: 12,
    acceptedAnswers: ['444.4', '444.40', 'HARMONIC_LOCKED'],
  },
  {
    id: 13,
    acceptedAnswers: ['SECOND SIGNAL', '444', 'B-4', 'CONVERGENCE'],
    customValidator: (clean) =>
      clean.includes('444') ||
      clean.includes('SECOND SIGNAL') ||
      clean.includes('B-4') ||
      clean.includes('CONVERGENCE'),
  },
  {
    id: 14,
    acceptedAnswers: ['SECOND_SIGNAL_INITIATED'],
  },
];

/**
 * Validates a user answer strictly for the given currentPuzzleId.
 * NEVER checks other puzzles or performs global answer searching.
 * Puzzle ID is the identity of the puzzle.
 */
export const validatePuzzleAnswer = (puzzleId: number, rawInput: string): boolean => {
  const clean = normalizeAnswer(rawInput);
  
  // Find ONLY the target puzzle by unique puzzle ID
  const currentPuzzle = PUZZLE_VALIDATION_RULES.find((p) => p.id === puzzleId);
  if (!currentPuzzle) return false;

  if (currentPuzzle.customValidator) {
    return currentPuzzle.customValidator(clean);
  }

  return currentPuzzle.acceptedAnswers.some((ans) => normalizeAnswer(ans) === clean);
};

/**
 * Submits an answer strictly for the currentPuzzleId.
 * Validates ONLY against that puzzle.
 * If correct, marks ONLY currentPuzzleId as completed and unlocks next puzzle.
 */
export const submitAnswerForPuzzle = (
  currentPuzzleId: number,
  userAnswer: string
): { success: boolean; updatedProgress: number[] } => {
  const isCorrect = validatePuzzleAnswer(currentPuzzleId, userAnswer);
  if (isCorrect) {
    const updated = saveSolvedPuzzle(currentPuzzleId);
    return { success: true, updatedProgress: updated };
  }
  return { success: false, updatedProgress: getStoredProgress() };
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
