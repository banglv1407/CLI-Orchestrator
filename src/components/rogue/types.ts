// Core types for Rogue Node 2D Canvas Engine

export interface Player {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isAlive: boolean;
  role?: 'system_engineer' | 'rogue_agent';
  isLocal: boolean;
  facing: 'left' | 'right' | 'up' | 'down';
  currentRoom: string;
}

export interface Wall {
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
}

export interface TaskPoint {
  id: string;
  name: string;
  room: string;
  x: number;
  y: number;
  type: 'wires' | 'card_swipe' | 'quantum_disk' | 'download_data';
  isCompleted: boolean;
}

export interface VentPoint {
  id: string;
  room: string;
  x: number;
  y: number;
  connectedTo: string[]; // Other vent IDs
}

export interface StationMap {
  width: number;
  height: number;
  rooms: { name: string; x: number; y: number; w: number; h: number }[];
  walls: Wall[];
  tasks: TaskPoint[];
  vents: VentPoint[];
}

export const QUANTUM_STATION_MAP: StationMap = {
  width: 2400,
  height: 1800,
  rooms: [
    { name: 'Cafeteria / Command Core', x: 900, y: 300, w: 600, h: 500 },
    { name: 'Quantum Reactor', x: 200, y: 700, w: 450, h: 500 },
    { name: 'Server Farm / Comms', x: 1750, y: 700, w: 450, h: 500 },
    { name: 'Electrical & Power Grid', x: 750, y: 1100, w: 400, h: 450 },
    { name: 'MedBay & Bio Scanner', x: 750, y: 400, w: 350, h: 350 },
    { name: 'Oxygen & Life Support', x: 1300, y: 1100, w: 400, h: 450 },
  ],
  walls: [
    // Outer perimeter
    { x: 50, y: 50, w: 2300, h: 30 },
    { x: 50, y: 1720, w: 2300, h: 30 },
    { x: 50, y: 50, w: 30, h: 1700 },
    { x: 2320, y: 50, w: 30, h: 1700 },

    // Cafeteria / Command Core Boundaries
    { x: 900, y: 300, w: 600, h: 20 },
    { x: 900, y: 300, w: 20, h: 200 },
    { x: 900, y: 600, w: 20, h: 200 }, // Doorway left
    { x: 1480, y: 300, w: 20, h: 200 },
    { x: 1480, y: 600, w: 20, h: 200 }, // Doorway right
    { x: 900, y: 780, w: 200, h: 20 },
    { x: 1300, y: 780, w: 200, h: 20 }, // Doorway bottom

    // Quantum Reactor Boundaries
    { x: 200, y: 700, w: 450, h: 20 },
    { x: 200, y: 700, w: 20, h: 500 },
    { x: 200, y: 1180, w: 450, h: 20 },
    { x: 630, y: 700, w: 20, h: 180 },
    { x: 630, y: 1000, w: 20, h: 200 },

    // Electrical Room
    { x: 750, y: 1100, w: 400, h: 20 },
    { x: 750, y: 1100, w: 20, h: 450 },
    { x: 750, y: 1530, w: 400, h: 20 },
    { x: 1130, y: 1100, w: 20, h: 200 },
    { x: 1130, y: 1380, w: 20, h: 170 },

    // Server Farm Boundaries
    { x: 1750, y: 700, w: 450, h: 20 },
    { x: 2180, y: 700, w: 20, h: 500 },
    { x: 1750, y: 1180, w: 450, h: 20 },
    { x: 1750, y: 700, w: 20, h: 180 },
    { x: 1750, y: 1000, w: 20, h: 200 },
  ],
  tasks: [
    { id: 'task-wires-elec', name: 'Calibrate Optical Cables', room: 'Electrical', x: 800, y: 1150, type: 'wires', isCompleted: false },
    { id: 'task-card-core', name: 'Biometric Card Authorization', room: 'Command Core', x: 1200, y: 350, type: 'card_swipe', isCompleted: false },
    { id: 'task-disk-server', name: 'Rebalance Quantum Disk', room: 'Server Farm', x: 1900, y: 800, type: 'quantum_disk', isCompleted: false },
    { id: 'task-download-reactor', name: 'Extract Telemetry Logs', room: 'Reactor', x: 300, y: 800, type: 'download_data', isCompleted: false },
  ],
  vents: [
    { id: 'vent-reactor', room: 'Reactor', x: 250, y: 1120, connectedTo: ['vent-elec', 'vent-medbay'] },
    { id: 'vent-elec', room: 'Electrical', x: 800, y: 1480, connectedTo: ['vent-reactor', 'vent-medbay'] },
    { id: 'vent-medbay', room: 'MedBay', x: 800, y: 450, connectedTo: ['vent-reactor', 'vent-elec'] },
    { id: 'vent-server', room: 'Server Farm', x: 2100, y: 1120, connectedTo: ['vent-cafeteria'] },
    { id: 'vent-cafeteria', room: 'Command Core', x: 1420, y: 350, connectedTo: ['vent-server'] },
  ],
};
