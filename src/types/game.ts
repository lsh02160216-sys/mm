export type GameState = 'TITLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER' | 'VICTORY';

export type Direction = 0 | 1 | 2 | 3; // 0: Up, 1: Right, 2: Down, 3: Left

export const DIR_VECTORS: Record<Direction, { dx: number; dy: number }> = {
  0: { dx: 0, dy: -1 },
  1: { dx: 1, dy: 0 },
  2: { dx: 0, dy: 1 },
  3: { dx: -1, dy: 0 },
};

export type TileType =
  | 'EMPTY'        // Walkable paved stone alley
  | 'HOUSE'        // Hanok building tile (blocking)
  | 'WALL'         // Stone fence / wall (blocking)
  | 'SHRINE'       // Sacred Pavilion where the Red Ghost resides
  | 'WELL'         // Ancient spirit well (spawns hungry ghosts)
  | 'DECORATION';  // Stone jar / pine tree (blocking)

export interface Player {
  x: number; // In grid units (e.g. 5.5)
  y: number;
  dir: Direction;
  nextDir: Direction | null;
  speed: number;
  isMoving: boolean;
  spicyTimer: number; // Seconds of pepper boost remaining
  invincibleTimer: number; // Seconds of damage i-frames remaining
  animTime: number;
}

export interface HungryGhost {
  id: string;
  x: number;
  y: number;
  dir: Direction;
  nextDir: Direction | null;
  speed: number;
  type: 'HUNGRY_CHASER' | 'WANDERER' | 'AMBUSHER';
  color: string;
  name: string;
  animTime: number;
  mouthOpen: boolean;
}

export interface RedGhost {
  x: number;
  y: number;
  targetApples: number;
  animTime: number;
}

export interface Item {
  id: string;
  type: 'APPLE' | 'PEPPER';
  x: number; // Tile coordinates
  y: number;
  collected: boolean;
  floatOffset: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'SPARKLE' | 'FIRE' | 'MIST' | 'HEART' | 'CONFETTI';
}

export interface GameStats {
  lives: number;
  maxLives: number;
  applesCollected: number;
  targetApples: number;
  peppersEaten: number;
  ghostCount: number;
  elapsedTime: number; // in seconds
  score: number;
  isSpicyActive: boolean;
  spicyPercent: number;
}
