/**
 * 444 — Comprehensive Archive Dataset (28 Pieces of Visual Evidence)
 * Categories: FOREST, BUILDINGS, ROADS, DOCUMENTARY, CLOSEUP, SIGNAL, MAP
 */

import forestRoadImg from '../assets/images/archive_forest_road_1790568762549.jpg';
import bunkerImg from '../assets/images/archive_abandoned_facility_1790568772474.jpg';
import radarImg from '../assets/images/archive_radar_sigil_1790568781921.jpg';
import beaconImg from '../assets/images/archive_vertical_beacon_1790568791873.jpg';
import lockedDoorImg from '../assets/images/archive_locked_door_1790660618951.jpg';
import controlRoomImg from '../assets/images/archive_control_room_1790660628984.jpg';
import memoImg from '../assets/images/archive_classified_memo_1790660646461.jpg';
import watchImg from '../assets/images/archive_broken_watch_1790660662037.jpg';
import treeCarvingImg from '../assets/images/archive_tree_carving_1790660678127.jpg';

export type ArchiveCategory =
  | 'FOREST'
  | 'BUILDINGS'
  | 'ROADS'
  | 'DOCUMENTARY'
  | 'CLOSEUP'
  | 'SIGNAL'
  | 'MAP';

export type EvidenceRole =
  | 'puzzle_evidence'
  | 'lore_evidence'
  | 'cross_reference'
  | 'signal_anomaly'
  | 'decoy';

export interface ForensicClue {
  modeRequired?: 'ORIGINAL' | 'ENHANCED' | 'NEGATIVE' | 'SIGNAL_LAYER';
  sliderThreshold?: {
    brightness?: number;
    contrast?: number;
    redChannel?: number;
  };
  text: string;
  significance: string;
}

export interface ArchiveEvidenceItem {
  id: string;
  code: string;
  title: string;
  category: ArchiveCategory;
  role: EvidenceRole;
  source: string;
  date: string;
  time: string;
  location: string;
  status: string;
  image: string;
  notes: string;
  crossReferences?: string[]; // IDs of related images showing same location/object
  forensicClue?: ForensicClue;
  hasSymbol?: boolean;
  frequency?: string;
}

export const ARCHIVE_EVIDENCE_ITEMS: ArchiveEvidenceItem[] = [
  // --- CATEGORY A: FOREST ---
  {
    id: 'arch-001',
    code: 'ARCHIVE // 001',
    title: 'Snowy Access Route (Road Marker 444)',
    category: 'FOREST',
    role: 'puzzle_evidence',
    source: 'SURVEILLANCE CAM DASHCAM',
    date: '1984-11-04',
    time: '04:30:00 UTC',
    location: 'OUTER PERIMETER BOREAL SECTOR',
    status: 'RECOVERED',
    image: forestRoadImg,
    notes: 'An unmaintained forestry road heading deep into the boreal forest. An old rusted sheet-metal marker displays "444" scorched into the steel. Pine canopy shows dense nocturnal cloud cover.',
    crossReferences: ['arch-008', 'arch-015'],
    forensicClue: {
      modeRequired: 'ENHANCED',
      text: 'TIME: 04:30:00 // INITIAL ACCESS POINT FOR CHRONOLOGY SEQUENCE',
      significance: 'Key chronological anchor for Puzzle 09.'
    },
    hasSymbol: true,
  },
  {
    id: 'arch-002',
    code: 'ARCHIVE // 002',
    title: 'Tree Bark Inscription // Carved Sigil',
    category: 'FOREST',
    role: 'lore_evidence',
    source: 'FIELD AGENT MACRO LENS',
    date: '1985-02-12',
    time: '04:44:00 UTC',
    location: 'GRID 62.4810° N, 34.2510° E',
    status: 'IN SITU DISCOVERY',
    image: treeCarvingImg,
    notes: 'Ancient wet pine tree trunk with the sharp dagger runic sigil gouged deep into the cambium. Knife marks suggest repeated carving over several seasons.',
    crossReferences: ['arch-004', 'arch-010'],
    forensicClue: {
      modeRequired: 'NEGATIVE',
      text: 'LATENT CUT MARKS: "NOT CARVED BY HUMAN BLADE"',
      significance: 'Anomalous physical disturbance in biological matter.'
    },
    hasSymbol: true,
  },
  {
    id: 'arch-003',
    code: 'ARCHIVE // 003',
    title: 'Coordinates Inscription Near Snowdrift',
    category: 'FOREST',
    role: 'puzzle_evidence',
    source: 'FIELD RECONNAISSANCE UNIT',
    date: '1986-04-04',
    time: '04:44:12 UTC',
    location: '62.4835° N, 34.2567° E',
    status: 'CONFIRMED ANOMALY',
    image: forestRoadImg,
    notes: 'Telemetric stamp verified at exactly 04:44:12 UTC. Lat 62.4835° N, Lon 34.2567° E. Radio wave dispersion matches the resonant frequency of 444.40 MHz.',
    crossReferences: ['arch-007', 'arch-017'],
    forensicClue: {
      modeRequired: 'SIGNAL_LAYER',
      text: 'EPICENTER COORDINATES: 62.4835° N, 34.2567° E',
      significance: 'Primary triangulation coordinate for Map 2.0 and Puzzle 07.'
    },
    hasSymbol: true,
    frequency: '444.40 MHz'
  },
  {
    id: 'arch-004',
    code: 'ARCHIVE // 004',
    title: 'Distant Beacon Canopy Anomaly',
    category: 'FOREST',
    role: 'cross_reference',
    source: 'ASTRONOMICAL MONITORING ARRAY',
    date: '1987-10-18',
    time: '04:58:00 UTC',
    location: 'NORTHERN RIDGE SUMMIT',
    status: 'UNEXPLAINED LUMINESCENCE',
    image: beaconImg,
    notes: 'A narrow, piercing column of light terminating in a geometric diamond formation above the pine trees. Recorded precisely 14 minutes after the primary 04:44 transmission.',
    crossReferences: ['arch-017', 'arch-020'],
    forensicClue: {
      modeRequired: 'ENHANCED',
      text: 'BEACON TIME: 04:58:00 UTC // TIMELINE EVENT 4',
      significance: 'Sequence conclusion for Puzzle 09.'
    },
    hasSymbol: true,
  },

  // --- CATEGORY B: ABANDONED BUILDINGS ---
  {
    id: 'arch-005',
    code: 'ARCHIVE // 005',
    title: 'Sub-Level Vault 12 // Chained Heavy Gate',
    category: 'BUILDINGS',
    role: 'puzzle_evidence',
    source: 'SURVEILLANCE UNIT 3 STILL',
    date: '1988-04-14',
    time: '04:44:00 UTC',
    location: 'FACILITY SECTOR B-4, SUB-LEVEL -2',
    status: 'SEALED WITH STEEL CHAINS',
    image: lockedDoorImg,
    notes: 'Heavy rusted iron door bound in cold forged chains and padlock. Stamped in white stencil: "THE SIGNAL IS CLOSER THAN YOU THINK". Wall moisture contains traces of heavy static discharge.',
    crossReferences: ['arch-006', 'arch-017'],
    forensicClue: {
      modeRequired: 'SIGNAL_LAYER',
      text: 'INSCRIPTION REVEALED: "VAULT REQUIRES 14 SIGNALS TO RELEASE LOCKS"',
      significance: 'Connects directly to the Token Vault seal condition.'
    },
    hasSymbol: true,
  },
  {
    id: 'arch-006',
    code: 'ARCHIVE // 006',
    title: 'Abandoned Central Control Room',
    category: 'BUILDINGS',
    role: 'lore_evidence',
    source: 'SECURITY FLASHLIGHT ARCHIVE',
    date: '1988-04-22',
    time: '03:59:10 UTC',
    location: 'FACILITY SECTOR B-4, CENTRAL CONSOLE',
    status: 'DERELICT CONSOLE',
    image: controlRoomImg,
    notes: 'Rows of analog consoles, dials, patch cords, and dusty CRT monitors. Oscilloscopes glow with phosphor static even though main circuit breakers have been disconnected for 30 years.',
    crossReferences: ['arch-005', 'arch-011'],
    forensicClue: {
      modeRequired: 'NEGATIVE',
      text: 'NOTE TAPED TO GLASS: "DO NOT SHUT DOWN. IT BROADCASTS FROM DEEPER."',
      significance: 'Reveals researcher panic prior to abandonment.'
    },
    hasSymbol: false,
    frequency: '444.40 MHz'
  },
  {
    id: 'arch-007',
    code: 'ARCHIVE // 007',
    title: 'Research Facility Complex // Sector B-4',
    category: 'BUILDINGS',
    role: 'puzzle_evidence',
    source: 'LONG-RANGE NIGHT SURVEILLANCE OPTICS',
    date: '1986-04-04',
    time: '04:44:12 UTC',
    location: '62.4835° N, 34.2567° E',
    status: 'RECOVERED CLASSIFIED',
    image: bunkerImg,
    notes: 'Brutalist concrete monolithic structure with rooftop shortwave radio tower. Corner foundation block bears concrete relief etching: "SECTOR B-4".',
    crossReferences: ['arch-003', 'arch-005', 'arch-006'],
    forensicClue: {
      modeRequired: 'ENHANCED',
      text: 'FOUNDATION STAMP: "SECTOR B-4"',
      significance: 'The direct answer required for Puzzle 03.'
    },
    hasSymbol: true,
  },
  {
    id: 'arch-008',
    code: 'ARCHIVE // 008',
    title: 'Derelict Barracks Window & Concrete Wall',
    category: 'BUILDINGS',
    role: 'lore_evidence',
    source: 'RECOVERED STILL FRAME',
    date: '1985-11-20',
    time: '04:44:00 UTC',
    location: 'DERELICT CONCRETE BARRACKS',
    status: 'DAMAGED POLAROID',
    image: bunkerImg,
    notes: 'Charcoal and gouged concrete wall. The Sigil is centered above three vertical tally strokes and the numeral 444. Window reveals fresh nocturnal snowfall.',
    crossReferences: ['arch-002', 'arch-007'],
    hasSymbol: true,
  },

  // --- CATEGORY C: ROADS / OUTSIDE ---
  {
    id: 'arch-009',
    code: 'ARCHIVE // 009',
    title: 'Polaroid Highway Surveillance // Log 008',
    category: 'ROADS',
    role: 'puzzle_evidence',
    source: 'FOUND FILM RETRIEVAL',
    date: '1984-11-04',
    time: '04:10:00 UTC',
    location: 'OVERGROWN HIGHWAY CLEARING',
    status: 'DEGRADED PHOTO',
    image: forestRoadImg,
    notes: 'Degraded polaroid found buried in frozen soil. Handwritten annotation in faded grease pencil: "04:10 / 04:44 / ?". High voltage lines disappear into frozen forest.',
    crossReferences: ['arch-001', 'arch-004'],
    forensicClue: {
      modeRequired: 'ENHANCED',
      text: 'EARLIEST RECORDED TIMESTAMP: 04:10:00 UTC',
      significance: 'Starting element (rank 1) for chronological Puzzle 09.'
    },
    hasSymbol: false,
  },
  {
    id: 'arch-010',
    code: 'ARCHIVE // 010',
    title: 'Telephone Poles Disappearing Into Fog',
    category: 'ROADS',
    role: 'lore_evidence',
    source: 'HIGHWAY PATROL RECOVERED REEL',
    date: '1989-01-03',
    time: '04:22:00 UTC',
    location: 'OLD MILITARY ARTERY 44',
    status: 'ANALOG ARTIFACT',
    image: forestRoadImg,
    notes: 'A solitary line of wooden telegraph poles along an unplowed road. Frost patterns along the wire insulation follow exact 444-millimeter intervals.',
    crossReferences: ['arch-001', 'arch-009'],
    hasSymbol: false,
  },

  // --- CATEGORY D: DOCUMENTARY / ARCHIVAL ---
  {
    id: 'arch-011',
    code: 'ARCHIVE // 011',
    title: 'Declassified Intelligence Memo // Redacted',
    category: 'DOCUMENTARY',
    role: 'puzzle_evidence',
    source: 'DEPARTMENT ARTIFACT STORAGE',
    date: '1988-05-19',
    time: '04:44:12 UTC',
    location: 'MINISTRY VAULT ARCHIVE',
    status: 'CLASSIFIED RESTRICTED',
    image: memoImg,
    notes: 'Typewritten document on aged paper with heavy black marker redactions. Top corner stamped "TOP SECRET // ANOMALOUS INTERCEPT".',
    crossReferences: ['arch-003', 'arch-007'],
    forensicClue: {
      modeRequired: 'ENHANCED',
      text: 'REDACTION BLEED-THROUGH: "CARRIER CONTINUES UNABATED AT 444.40 MHZ"',
      significance: 'Confirms shortwave carrier frequency for Puzzle 06 & Map triangulation.'
    },
    hasSymbol: true,
    frequency: '444.40 MHz'
  },
  {
    id: 'arch-012',
    code: 'ARCHIVE // 012',
    title: 'Researcher Field Log // Entry 44',
    category: 'DOCUMENTARY',
    role: 'lore_evidence',
    source: 'RESEARCHER NOTEBOOK RECOVERY',
    date: '1988-06-01',
    time: '04:44:00 UTC',
    location: 'BUNKER DESK DRAWER',
    status: 'PARTIALLY BURNED',
    image: memoImg,
    notes: 'Handwritten ink on graph paper: "I thought it was a coincidence. Then it began appearing before the equipment was switched on. Something is answering."',
    crossReferences: ['arch-006', 'arch-011'],
    forensicClue: {
      modeRequired: 'NEGATIVE',
      text: 'MARGINAL NOTE: "THE OBSERVER SEES US. DO NOT TRANSMIT."',
      significance: 'Reinforces the recurring message: Wait for the Second Signal.'
    },
    hasSymbol: false,
  },
  {
    id: 'arch-013',
    code: 'ARCHIVE // 013',
    title: 'Steganographic Cadence Dispatch',
    category: 'DOCUMENTARY',
    role: 'puzzle_evidence',
    source: 'INTERCEPTED COURIER POUCH',
    date: '1987-09-14',
    time: 'UNKNOWN',
    location: 'SECTOR OUTPOST 2',
    status: 'RECOVERED MEMO',
    image: memoImg,
    notes: 'Text reads: "Initial surveillance confirms SEEK anomalous audio across THE northern sector through DEEP coniferous pines with FREQUENCY stability."',
    crossReferences: ['arch-011'],
    forensicClue: {
      modeRequired: 'SIGNAL_LAYER',
      text: 'EVERY 4TH WORD HIGHLIGHTED: "SEEK THE DEEP FREQUENCY"',
      significance: 'Solution text for Puzzle 11.'
    },
    hasSymbol: false,
  },

  // --- CATEGORY E: CLOSE-UP EVIDENCE ---
  {
    id: 'arch-014',
    code: 'ARCHIVE // 014',
    title: 'Mechanical Wristwatch Frozen at 04:44',
    category: 'CLOSEUP',
    role: 'puzzle_evidence',
    source: 'FORENSIC SITE PHOTOGRAPHY',
    date: 'RECOVERED IN ICE',
    time: '04:44:12 FROZEN',
    location: 'PERIMETER FENCE POST 4',
    status: 'EVIDENCE MARKER 14',
    image: watchImg,
    notes: 'Cracked crystal lens on an issue military field watch. The balance wheel is jammed with fine magnetic residue. Hands stopped at exactly 04:44:12.',
    crossReferences: ['arch-003', 'arch-009'],
    forensicClue: {
      modeRequired: 'ENHANCED',
      text: 'STOPPED TIME: 04:44:12 UTC',
      significance: 'Primary recurrence time across all telemetry.'
    },
    hasSymbol: false,
  },
  {
    id: 'arch-015',
    code: 'ARCHIVE // 015',
    title: 'Vintage Shortwave Receiver Dial // Tuning 444',
    category: 'CLOSEUP',
    role: 'puzzle_evidence',
    source: 'LABORATORY BENCH INVENTORY',
    date: '1985-03-30',
    time: '04:44:00 UTC',
    location: 'BUNKER LAB 3',
    status: 'FUNCTIONAL RECEIVER',
    image: controlRoomImg,
    notes: 'Heavy cast-iron radio receiver knob with illuminated dial. Locked mechanically at 444.40 MHz. Needle vibrates whenever atmospheric conditions drop below freezing.',
    crossReferences: ['arch-006', 'arch-016'],
    forensicClue: {
      modeRequired: 'SIGNAL_LAYER',
      text: 'DIAL RESONANCE: 444.40 MHz',
      significance: 'Verification key for Puzzle 06 & Puzzle 12.'
    },
    hasSymbol: true,
    frequency: '444.40 MHz'
  },
  {
    id: 'arch-016',
    code: 'ARCHIVE // 016',
    title: 'Magnetic Compass Needle Deflection',
    category: 'CLOSEUP',
    role: 'lore_evidence',
    source: 'SURVEYOR TOOLKIT',
    date: '1986-08-11',
    time: '04:44:12 UTC',
    location: '62.4835° N, 34.2567° E',
    status: 'DEVIATION RECORD',
    image: watchImg,
    notes: 'Liquid filled magnetic compass placed on rock near the research tower. Needle spins erratically in 44-degree arcs rather than pointing true magnetic north.',
    crossReferences: ['arch-003', 'arch-014'],
    hasSymbol: false,
  },

  // --- CATEGORY F: SIGNAL / ABSTRACT ---
  {
    id: 'arch-017',
    code: 'ARCHIVE // 017',
    title: 'Phosphor Oscilloscope Targeting Reticle',
    category: 'SIGNAL',
    role: 'puzzle_evidence',
    source: 'STATION OSC-4 CRT MONITOR',
    date: 'RECURRENT',
    time: '04:44:12 UTC',
    location: 'UNDERGROUND MONITORING BARRACKS',
    status: 'ACTIVE CARRIER SCREEN',
    image: radarImg,
    notes: 'Green phosphorus CRT electron beam drawn into the exact geometry of the 444 Sigil. The signal appears on screen seconds before electromagnetic detection by antennas.',
    crossReferences: ['arch-002', 'arch-007', 'arch-015'],
    forensicClue: {
      modeRequired: 'SIGNAL_LAYER',
      text: 'SIGIL CORE FREQUENCY: 444.40 MHz // 4-QUADRANT HARMONIC',
      significance: 'Visual blueprint for Puzzle 10 (Symbol Deconstruction).'
    },
    hasSymbol: true,
    frequency: '444.40 MHz'
  },
  {
    id: 'arch-018',
    code: 'ARCHIVE // 018',
    title: 'Corrupted Negative Frame // Frame 008',
    category: 'SIGNAL',
    role: 'puzzle_evidence',
    source: 'RECOVERED FILM SPOOL',
    date: 'UNKNOWN',
    time: '04:44:12 UTC',
    location: 'SECTOR B-4 DARKROOM',
    status: 'DEVELOPMENT ANOMALY',
    image: bunkerImg,
    notes: 'Silver halide film frame that initially appears completely blank and pitch black. Extreme contrast manipulation reveals faint latent typographic inscription.',
    crossReferences: ['arch-007'],
    forensicClue: {
      modeRequired: 'ENHANCED',
      sliderThreshold: { brightness: 75, contrast: 140 },
      text: 'LATENT SILVER INSCRIPTION: "SHADOW TRANSMITTER"',
      significance: 'Target password for forensic Puzzle 08.'
    },
    hasSymbol: true,
  },
  {
    id: 'arch-019',
    code: 'ARCHIVE // 019',
    title: 'Atmospheric VLF Radio Waveform Spectrograph',
    category: 'SIGNAL',
    role: 'lore_evidence',
    source: 'VERY LOW FREQUENCY MONITOR',
    date: '1988-12-24',
    time: '04:44:12 UTC',
    location: 'EXCLUSION ZONE RECEIVER 01',
    status: 'AUDIO SPECTROGRAM',
    image: radarImg,
    notes: 'Waterfall audio spectrum display between 0 and 20 kHz. At 04:44:12, carrier waves draw vertical parallel teeth that spell Morse characters into spectral noise.',
    crossReferences: ['arch-017'],
    forensicClue: {
      modeRequired: 'NEGATIVE',
      text: 'SPECTROGRAM MORSE: "· · ·   · ·   - - ·   - ·   · -   · - · ·" [SIGNAL]',
      significance: 'Cross-verifies Morse solution for Puzzle 02.'
    },
    hasSymbol: false,
    frequency: '044.40 MHz'
  },

  // --- CATEGORY G: MAP / LOCATION ---
  {
    id: 'arch-020',
    code: 'ARCHIVE // 020',
    title: 'Tactical Boreal Cartography Sheet // Sector B-4',
    category: 'MAP',
    role: 'puzzle_evidence',
    source: 'SURVEYOR RECON MAP SHEET',
    date: '1983-09-01',
    time: 'RECORDED AT NOON',
    location: 'GRID MAP DIVISION',
    status: 'SURVEYOR OVERLAY',
    image: forestRoadImg,
    notes: 'Survey sheet showing topography contours, logging trails, and perimeter fence lines around the concrete bunker installation at 62.4835° N, 34.2567° E.',
    crossReferences: ['arch-001', 'arch-003', 'arch-007'],
    forensicClue: {
      modeRequired: 'SIGNAL_LAYER',
      text: 'TRIANGULATION ANCHOR: LAT 62.4835° N, LON 34.2567° E',
      significance: 'Primary target coordinates for Map 2.0.'
    },
    hasSymbol: true,
  },
  {
    id: 'arch-021',
    code: 'ARCHIVE // 021',
    title: 'Subterranean Bunker Level -2 Floorplan',
    category: 'MAP',
    role: 'lore_evidence',
    source: 'ARCHITECTURAL SCHEMATIC PENCIL DRAFT',
    date: '1979-06-15',
    time: 'N/A',
    location: 'CIVIL DEFENSE ARCHIVE',
    status: 'DECADENT BLUEPRINT',
    image: memoImg,
    notes: 'Architectural blueprint showing sub-surface tunnels connecting the central control room to Vault 12. Deep room marked with handwritten red question mark: "RESONATOR ROOM".',
    crossReferences: ['arch-005', 'arch-006'],
    hasSymbol: true,
  },
  {
    id: 'arch-022',
    code: 'ARCHIVE // 022',
    title: 'Aerial Reconnaissance Still // Winter Canopy',
    category: 'MAP',
    role: 'cross_reference',
    source: 'HIGH-ALTITUDE NIGHT OPTICS',
    date: '1987-01-29',
    time: '04:44:00 UTC',
    location: 'EXCLUSION ZONE OVERFLIGHT',
    status: 'DECLASSIFIED STILL',
    image: bunkerImg,
    notes: 'Infrared aerial photograph. While surrounding forest measures -24°C, a perfect concentric circle around the rooftop tower measures +12°C with no visible chimney or heat exhaust.',
    crossReferences: ['arch-004', 'arch-007'],
    hasSymbol: false,
  },
  {
    id: 'arch-023',
    code: 'ARCHIVE // 023',
    title: 'Decoy Forestry Tower // Sector Alpha',
    category: 'ROADS',
    role: 'decoy',
    source: 'FOREST WARDEN REPORT',
    date: '1982-05-10',
    time: '14:20:00 UTC',
    location: 'GRID 62.4200° N, 34.1900° E',
    status: 'UNREMARKABLE TOWER',
    image: forestRoadImg,
    notes: 'Standard timber fire watchtower erected in 1954. No anomalous electromagnetic telemetry recorded. Likely erected as an observation screen to deter civilian entry.',
    crossReferences: ['arch-001'],
    hasSymbol: false,
  },
  {
    id: 'arch-024',
    code: 'ARCHIVE // 024',
    title: 'Encrypted Caesar Intercept Slip // Shift 4',
    category: 'DOCUMENTARY',
    role: 'puzzle_evidence',
    source: 'RADIO INTERCEPT LOG SLIP',
    date: '1988-03-04',
    time: '04:44:00 UTC',
    location: 'LISTENING POST CHARLIE',
    status: 'CRYPTOGRAPHIC SLIP',
    image: memoImg,
    notes: 'Punched tape slip with ciphertext: "JVIUYIRGC". Written in margin: "Key matches the sacred count of the broadcast (4)."',
    crossReferences: ['arch-011'],
    forensicClue: {
      modeRequired: 'ENHANCED',
      text: 'DECRYPTED WORD (SHIFT 4 BACKWARDS): "FREQUENCY"',
      significance: 'Solution for Puzzle 04 (Caesar Cipher).'
    },
    hasSymbol: false,
  }
];
