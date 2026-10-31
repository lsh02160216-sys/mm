import React, { useEffect, useRef } from 'react';
import { Direction, DIR_VECTORS, GameStats, HungryGhost, Item, Particle, Player, RedGhost } from '../types/game';
import { isWalkable, MAP_COLS, MAP_ROWS, parseMap } from './mapData';
import {
  drawApple,
  drawHanokHouse,
  drawHungryGhost,
  drawJangdokdae,
  drawLantern,
  drawParticles,
  drawPepper,
  drawPlayer,
  drawRedGhost,
  drawSpiritWell,
  drawStoneWall,
} from './renderers';
import { sound } from '../utils/sound';

interface GameCanvasProps {
  isPlaying: boolean;
  isPaused: boolean;
  onGameOver: (stats: GameStats) => void;
  onVictory: (stats: GameStats) => void;
  onStatsUpdate: (stats: GameStats) => void;
  virtualDirection: Direction | null;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  isPlaying,
  isPaused,
  onGameOver,
  onVictory,
  onStatsUpdate,
  virtualDirection,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Use refs to store mutable game state so React doesn't re-render 60fps loop
  const gameStateRef = useRef<{
    map: ReturnType<typeof parseMap>;
    player: Player;
    ghosts: HungryGhost[];
    redGhost: RedGhost;
    items: Item[];
    particles: Particle[];
    stats: GameStats;
    lastTime: number;
    screenShake: number;
    hitFlash: number;
    nextGhostSpawnTimer: number;
    heldKeys: Set<string>;
  } | null>(null);

  // Initialize or reset game state
  const resetGame = () => {
    const map = parseMap();

    const player: Player = {
      x: map.playerStart.x,
      y: map.playerStart.y,
      dir: 0,
      nextDir: null,
      speed: 3.8,
      isMoving: false,
      spicyTimer: 0,
      invincibleTimer: 0,
      animTime: 0,
    };

    // Initial 2 Hungry Ghosts
    const ghosts: HungryGhost[] = [
      {
        id: 'ghost-1',
        x: map.spiritWells[0]?.x ?? 12,
        y: map.spiritWells[0]?.y ?? 7,
        dir: 1,
        nextDir: null,
        speed: 2.5,
        type: 'HUNGRY_CHASER',
        color: '#c084fc',
        name: '눈치빠른 걸신',
        animTime: 0,
        mouthOpen: false,
      },
      {
        id: 'ghost-2',
        x: map.spiritWells[1]?.x ?? 12,
        y: map.spiritWells[1]?.y ?? 13,
        dir: 3,
        nextDir: null,
        speed: 2.3,
        type: 'WANDERER',
        color: '#818cf8',
        name: '방황하는 걸신',
        animTime: 0,
        mouthOpen: false,
      },
    ];

    const redGhost: RedGhost = {
      x: map.redGhostPos.x,
      y: map.redGhostPos.y,
      targetApples: 5,
      animTime: 0,
    };

    // Populate items
    const items: Item[] = [
      ...map.initialApples.map((pos, idx) => ({
        id: `apple-${idx}`,
        type: 'APPLE' as const,
        x: pos.x,
        y: pos.y,
        collected: false,
        floatOffset: idx * 0.8,
      })),
      ...map.initialPeppers.map((pos, idx) => ({
        id: `pepper-${idx}`,
        type: 'PEPPER' as const,
        x: pos.x,
        y: pos.y,
        collected: false,
        floatOffset: idx * 1.1,
      })),
    ];

    const stats: GameStats = {
      lives: 3,
      maxLives: 3,
      applesCollected: 0,
      targetApples: 5,
      peppersEaten: 0,
      ghostCount: ghosts.length,
      elapsedTime: 0,
      score: 0,
      isSpicyActive: false,
      spicyPercent: 0,
    };

    gameStateRef.current = {
      map,
      player,
      ghosts,
      redGhost,
      items,
      particles: [],
      stats,
      lastTime: performance.now(),
      screenShake: 0,
      hitFlash: 0,
      nextGhostSpawnTimer: 25, // First spawn after 25s
      heldKeys: new Set(),
    };
  };

  // Keyboard input listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStateRef.current) return;
      const key = e.key.toLowerCase();
      gameStateRef.current.heldKeys.add(key);

      let targetDir: Direction | null = null;
      if (key === 'arrowup' || key === 'w') targetDir = 0;
      else if (key === 'arrowright' || key === 'd') targetDir = 1;
      else if (key === 'arrowdown' || key === 's') targetDir = 2;
      else if (key === 'arrowleft' || key === 'a') targetDir = 3;

      if (targetDir !== null) {
        gameStateRef.current.player.nextDir = targetDir;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!gameStateRef.current) return;
      gameStateRef.current.heldKeys.delete(e.key.toLowerCase());
    };

    const handleBlur = () => {
      if (gameStateRef.current) {
        gameStateRef.current.heldKeys.clear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Sync virtual direction from mobile D-pad / touch controls
  useEffect(() => {
    if (virtualDirection !== null && gameStateRef.current) {
      gameStateRef.current.player.nextDir = virtualDirection;
    }
  }, [virtualDirection]);

  // Main 60fps Game Loop
  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    resetGame();
    sound.startAmbient();

    let animationFrameId: number;

    const gameLoop = (currentTime: number) => {
      const state = gameStateRef.current;
      if (!state) return;

      const rawDt = (currentTime - state.lastTime) / 1000;
      state.lastTime = currentTime;
      const dt = Math.min(rawDt, 0.05); // Clamp dt to prevent tunneling

      if (!isPaused) {
        updateSimulation(state, dt, currentTime / 1000);
      }

      renderScene(state, currentTime / 1000);

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      sound.stopAmbient();
    };
  }, [isPlaying, isPaused]);

  // Game Physics & Logic Simulation
  const updateSimulation = (
    state: NonNullable<typeof gameStateRef.current>,
    dt: number,
    time: number
  ) => {
    const { player, ghosts, redGhost, items, map, stats } = state;

    // 1. Update Game Timers
    stats.elapsedTime += dt;
    state.screenShake = Math.max(0, state.screenShake - dt * 10);
    state.hitFlash = Math.max(0, state.hitFlash - dt * 4);

    if (player.invincibleTimer > 0) {
      player.invincibleTimer = Math.max(0, player.invincibleTimer - dt);
    }

    if (player.spicyTimer > 0) {
      player.spicyTimer = Math.max(0, player.spicyTimer - dt);
      stats.isSpicyActive = true;
      stats.spicyPercent = player.spicyTimer / 7.0;

      // Spicy particle emission
      if (Math.random() < 0.45) {
        state.particles.push({
          x: (player.x + 0.5) * 32 + (Math.random() - 0.5) * 12,
          y: (player.y + 0.6) * 32 + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 20,
          vy: -Math.random() * 35 - 15,
          life: 0.5,
          maxLife: 0.5,
          color: Math.random() > 0.5 ? '#f97316' : '#ef4444',
          size: Math.random() * 3 + 2,
          type: 'FIRE',
        });
      }
    } else {
      stats.isSpicyActive = false;
      stats.spicyPercent = 0;
    }

    // 2. Dynamic Ghost Spawning Over Time ("시간이 지날수록 귀신의 숫자는 많아져")
    state.nextGhostSpawnTimer -= dt;
    if (state.nextGhostSpawnTimer <= 0 && ghosts.length < 6) {
      state.nextGhostSpawnTimer = 22; // Spawn next in 22s
      const well = map.spiritWells[ghosts.length % map.spiritWells.length];
      if (well) {
        const ghostColors = ['#a855f7', '#60a5fa', '#ec4899', '#34d399'];
        const newGhost: HungryGhost = {
          id: `ghost-${Date.now()}`,
          x: well.x,
          y: well.y,
          dir: Math.floor(Math.random() * 4) as Direction,
          nextDir: null,
          speed: 2.4 + ghosts.length * 0.15,
          type: ghosts.length % 2 === 0 ? 'HUNGRY_CHASER' : 'WANDERER',
          color: ghostColors[ghosts.length % ghostColors.length],
          name: `배고픈 걸신 ${ghosts.length + 1}호`,
          animTime: 0,
          mouthOpen: false,
        };
        ghosts.push(newGhost);
        stats.ghostCount = ghosts.length;
        sound.playGhostSpawn();

        // Well mist explosion
        for (let i = 0; i < 15; i++) {
          state.particles.push({
            x: (well.x + 0.5) * 32,
            y: (well.y + 0.5) * 32,
            vx: (Math.random() - 0.5) * 45,
            vy: (Math.random() - 0.5) * 45,
            life: 1.0,
            maxLife: 1.0,
            color: '#a855f7',
            size: 4,
            type: 'MIST',
          });
        }
      }
    }

    // 3. Player Movement & Pac-Man style corner turning
    const currentSpeed = player.spicyTimer > 0 ? 6.8 : 3.8;
    updatePlayerMovement(player, map.grid, dt, currentSpeed);

    // 4. Update Hungry Ghosts AI
    for (const ghost of ghosts) {
      updateGhostMovement(ghost, player, map.grid, dt);
    }

    // 5. Item Collection Check (사과 & 홍고추)
    for (const item of items) {
      if (item.collected) continue;
      const dist = Math.hypot(player.x - item.x, player.y - item.y);
      if (dist < 0.65) {
        item.collected = true;
        if (item.type === 'APPLE') {
          stats.applesCollected += 1;
          stats.score += 200;
          sound.playApplePickup();

          // Sparkle burst
          for (let i = 0; i < 12; i++) {
            state.particles.push({
              x: (item.x + 0.5) * 32,
              y: (item.y + 0.5) * 32,
              vx: (Math.random() - 0.5) * 50,
              vy: (Math.random() - 0.5) * 50,
              life: 0.6,
              maxLife: 0.6,
              color: '#facc15',
              size: 3,
              type: 'SPARKLE',
            });
          }
        } else if (item.type === 'PEPPER') {
          stats.peppersEaten += 1;
          player.spicyTimer = 7.0; // 7 seconds extreme speed boost!
          sound.playPepperBoost();

          // Fire burst
          for (let i = 0; i < 15; i++) {
            state.particles.push({
              x: (item.x + 0.5) * 32,
              y: (item.y + 0.5) * 32,
              vx: (Math.random() - 0.5) * 60,
              vy: (Math.random() - 0.5) * 60,
              life: 0.7,
              maxLife: 0.7,
              color: '#ef4444',
              size: 4,
              type: 'FIRE',
            });
          }
        }
      }
    }

    // 6. Red Ghost Encounter Check (Win Condition: 5 Apples -> Meet Red Ghost)
    const redDist = Math.hypot(player.x - redGhost.x, player.y - redGhost.y);
    if (redDist < 0.85) {
      if (stats.applesCollected >= stats.targetApples) {
        // VICTORY ACHIEVED!
        sound.playVictory();
        onVictory(stats);
        return;
      }
    }

    // 7. Hungry Ghost Collision Check (Damage / Lives)
    if (player.invincibleTimer <= 0) {
      for (const ghost of ghosts) {
        const gDist = Math.hypot(player.x - ghost.x, player.y - ghost.y);
        if (gDist < 0.65) {
          // Player takes damage!
          stats.lives -= 1;
          player.invincibleTimer = 2.2; // 2.2 seconds of invulnerability
          state.screenShake = 1.0;
          state.hitFlash = 1.0;
          sound.playHit();

          // Knock ghost slightly back
          const vec = DIR_VECTORS[ghost.dir];
          ghost.x -= vec.dx * 0.4;
          ghost.y -= vec.dy * 0.4;

          if (stats.lives <= 0) {
            sound.playGameOver();
            onGameOver(stats);
            return;
          }
          break;
        }
      }
    }

    // 8. Update Particles
    for (let i = state.particles.length - 1; i >= 0; i--) {
      const p = state.particles[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.life <= 0) {
        state.particles.splice(i, 1);
      }
    }

    // 9. Sync HUD stats
    onStatsUpdate({ ...stats });
  };

  // Pac-Man Style Cornering and Smooth Movement
  const updatePlayerMovement = (
    player: Player,
    grid: ReturnType<typeof parseMap>['grid'],
    dt: number,
    speed: number
  ) => {
    player.animTime += dt;

    // Check if player wants to change direction
    if (player.nextDir !== null) {
      const nextVec = DIR_VECTORS[player.nextDir];
      const isOpposite =
        (player.dir === 0 && player.nextDir === 2) ||
        (player.dir === 2 && player.nextDir === 0) ||
        (player.dir === 1 && player.nextDir === 3) ||
        (player.dir === 3 && player.nextDir === 1);

      if (isOpposite) {
        player.dir = player.nextDir;
        player.nextDir = null;
      } else {
        // Corner turn test: Check if aligned with alley grid
        const centerX = Math.round(player.x);
        const centerY = Math.round(player.y);
        const diffX = Math.abs(player.x - centerX);
        const diffY = Math.abs(player.y - centerY);

        // Within corner tolerance (0.32 tiles)
        if (diffX < 0.32 && diffY < 0.32) {
          const targetCol = centerX + nextVec.dx;
          const targetRow = centerY + nextVec.dy;
          if (isWalkable(grid, targetCol, targetRow)) {
            player.x = centerX;
            player.y = centerY;
            player.dir = player.nextDir;
            player.nextDir = null;
          }
        }
      }
    }

    // Move in current direction
    const curVec = DIR_VECTORS[player.dir];
    const step = speed * dt;
    const nextX = player.x + curVec.dx * step;
    const nextY = player.y + curVec.dy * step;

    // Collision check against next tile
    const checkCol = Math.round(nextX + curVec.dx * 0.4);
    const checkRow = Math.round(nextY + curVec.dy * 0.4);

    if (isWalkable(grid, checkCol, checkRow)) {
      player.x = nextX;
      player.y = nextY;
      player.isMoving = true;
    } else {
      // Wall hit: snap to grid center
      player.x = Math.round(player.x);
      player.y = Math.round(player.y);
      player.isMoving = false;
    }
  };

  // Hungry Ghost AI
  const updateGhostMovement = (
    ghost: HungryGhost,
    player: Player,
    grid: ReturnType<typeof parseMap>['grid'],
    dt: number
  ) => {
    ghost.animTime += dt;

    const curVec = DIR_VECTORS[ghost.dir];
    const step = ghost.speed * dt;
    const nextX = ghost.x + curVec.dx * step;
    const nextY = ghost.y + curVec.dy * step;

    const gridX = Math.round(ghost.x);
    const gridY = Math.round(ghost.y);
    const distToCenter = Math.hypot(ghost.x - gridX, ghost.y - gridY);

    // At an alley intersection: decide new direction
    if (distToCenter < step * 1.5) {
      const validDirs: Direction[] = [];
      const oppositeDir = ((ghost.dir + 2) % 4) as Direction;

      for (let d = 0; d < 4; d++) {
        const dir = d as Direction;
        if (dir === oppositeDir) continue; // Don't turn back immediately
        const vec = DIR_VECTORS[dir];
        if (isWalkable(grid, gridX + vec.dx, gridY + vec.dy)) {
          validDirs.push(dir);
        }
      }

      // If at dead end, reverse
      if (validDirs.length === 0) {
        if (isWalkable(grid, gridX + DIR_VECTORS[oppositeDir].dx, gridY + DIR_VECTORS[oppositeDir].dy)) {
          validDirs.push(oppositeDir);
        }
      }

      if (validDirs.length > 0) {
        // AI: If Hungry Chaser and player is within 7 tiles, chase player!
        const distToPlayer = Math.hypot(player.x - ghost.x, player.y - ghost.y);
        if (ghost.type === 'HUNGRY_CHASER' && distToPlayer < 7) {
          let bestDir = validDirs[0];
          let minDist = 999;
          for (const d of validDirs) {
            const v = DIR_VECTORS[d];
            const testX = gridX + v.dx;
            const testY = gridY + v.dy;
            const dTest = Math.hypot(player.x - testX, player.y - testY);
            if (dTest < minDist) {
              minDist = dTest;
              bestDir = d;
            }
          }
          ghost.dir = bestDir;
        } else {
          // Wanderer or outside chase range: pick random valid path or continue straight
          if (validDirs.includes(ghost.dir) && Math.random() < 0.65) {
            // Keep straight
          } else {
            ghost.dir = validDirs[Math.floor(Math.random() * validDirs.length)];
          }
        }
      }
    }

    // Move ghost
    const moveVec = DIR_VECTORS[ghost.dir];
    const targetCheckX = Math.round(ghost.x + moveVec.dx * 0.45);
    const targetCheckY = Math.round(ghost.y + moveVec.dy * 0.45);

    if (isWalkable(grid, targetCheckX, targetCheckY)) {
      ghost.x += moveVec.dx * step;
      ghost.y += moveVec.dy * step;
    } else {
      ghost.x = gridX;
      ghost.y = gridY;
      ghost.dir = ((ghost.dir + 1 + Math.floor(Math.random() * 3)) % 4) as Direction;
    }
  };

  // Render Scene to Canvas
  const renderScene = (
    state: NonNullable<typeof gameStateRef.current>,
    time: number
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Viewport dimensions
    const width = canvas.width;
    const height = canvas.height;

    // Base tile size calculated to fit 25 cols x 21 rows neatly
    const tileSize = Math.min(
      Math.floor(width / MAP_COLS),
      Math.floor(height / MAP_ROWS)
    );

    const mapWidth = MAP_COLS * tileSize;
    const mapHeight = MAP_ROWS * tileSize;
    const offsetX = Math.floor((width - mapWidth) / 2);
    const offsetY = Math.floor((height - mapHeight) / 2);

    ctx.save();

    // Screen Shake effect on hit
    if (state.screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * state.screenShake * 16;
      const shakeY = (Math.random() - 0.5) * state.screenShake * 16;
      ctx.translate(shakeX, shakeY);
    }

    // Dark moonlight village backdrop
    ctx.fillStyle = '#060913';
    ctx.fillRect(0, 0, width, height);

    ctx.translate(offsetX, offsetY);

    // 1. Draw Paved Ground Alleys (돌담길)
    for (let r = 0; r < MAP_ROWS; r++) {
      for (let c = 0; c < MAP_COLS; c++) {
        const x = c * tileSize;
        const y = r * tileSize;
        const tile = state.map.grid[r][c];

        if (tile === 'EMPTY' || tile === 'SHRINE' || tile === 'WELL') {
          // Granite stone pavers
          ctx.fillStyle = (r + c) % 2 === 0 ? '#1b222c' : '#171d26';
          ctx.fillRect(x, y, tileSize, tileSize);

          // Subtle stone cobble border
          ctx.strokeStyle = '#11161d';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x, y, tileSize, tileSize);
        }
      }
    }

    // 2. Draw Lanterns light glow and posts
    for (const l of state.map.lanterns) {
      drawLantern(ctx, l.x * tileSize, l.y * tileSize, tileSize, time);
    }

    // 3. Draw Buildings, Walls & Wells
    for (let r = 0; r < MAP_ROWS; r++) {
      for (let c = 0; c < MAP_COLS; c++) {
        const x = c * tileSize;
        const y = r * tileSize;
        const tile = state.map.grid[r][c];

        if (tile === 'HOUSE') {
          drawHanokHouse(ctx, x, y, tileSize, time);
        } else if (tile === 'WALL') {
          drawStoneWall(ctx, x, y, tileSize);
        } else if (tile === 'DECORATION') {
          drawJangdokdae(ctx, x, y, tileSize);
        } else if (tile === 'WELL') {
          drawSpiritWell(ctx, x, y, tileSize, time);
        }
      }
    }

    // 4. Draw Red Ghost in Sacred Pavilion
    drawRedGhost(ctx, state.redGhost, tileSize, state.stats.applesCollected, time);

    // 5. Draw Items (Apples & Hot Peppers)
    for (const item of state.items) {
      if (!item.collected) {
        if (item.type === 'APPLE') {
          drawApple(ctx, item, tileSize, time);
        } else if (item.type === 'PEPPER') {
          drawPepper(ctx, item, tileSize, time);
        }
      }
    }

    // 6. Draw Hungry Ghosts (걸신)
    for (const ghost of state.ghosts) {
      drawHungryGhost(ctx, ghost, tileSize, time);
    }

    // 7. Draw Player Character
    drawPlayer(ctx, state.player, tileSize, time);

    // 8. Draw Particle Systems
    drawParticles(ctx, state.particles);

    // 9. Soft Night Vignette & Moonlight overlay
    ctx.restore();

    ctx.save();
    // Screen Hit Flash
    if (state.hitFlash > 0) {
      ctx.fillStyle = `rgba(239, 68, 68, ${state.hitFlash * 0.45})`;
      ctx.fillRect(0, 0, width, height);
    }

    // Spicy Screen Edge Glow when boost is active
    if (state.stats.isSpicyActive) {
      const spicyGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.4,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );
      spicyGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      spicyGrad.addColorStop(1, 'rgba(239, 68, 68, 0.35)');
      ctx.fillStyle = spicyGrad;
      ctx.fillRect(0, 0, width, height);
    }

    // Subtle moonlit vignette around outer borders
    const vignette = ctx.createRadialGradient(
      width / 2,
      height / 2,
      Math.min(width, height) * 0.5,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.85
    );
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(2, 6, 23, 0.65)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();
  };

  // Window resize handler for crisp canvas
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950">
      <canvas
        ref={canvasRef}
        className="w-full h-full block touch-none"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};
