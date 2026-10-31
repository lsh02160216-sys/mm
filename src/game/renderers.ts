import { Player, HungryGhost, RedGhost, Item, Particle, Direction } from '../types/game';
import { MapData } from './mapData';

/**
 * Procedural Canvas Renderers for Hanok Village Ghost Game
 * Renders charming folkloric characters, traditional Hanok architecture, and effects.
 */

// Draw Korean Hanok Tile Roof & Building
export function drawHanokHouse(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  time: number
) {
  // Base wooden wall
  ctx.fillStyle = '#261b16';
  ctx.fillRect(x, y, size, size);

  // Hanji paper window with warm interior lantern light
  const winPad = size * 0.22;
  const winW = size - winPad * 2;
  const winH = size * 0.45;
  const winY = y + size * 0.45;

  const flicker = Math.sin(time * 3 + x + y) * 0.08 + 0.92;
  ctx.fillStyle = `rgba(251, 191, 36, ${0.45 * flicker})`;
  ctx.fillRect(x + winPad, winY, winW, winH);

  // Window wooden lattice (창호지 문살)
  ctx.strokeStyle = '#3b2416';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + winPad, winY, winW, winH);

  // Vertical and horizontal wooden lattice slats
  ctx.beginPath();
  ctx.moveTo(x + size * 0.5, winY);
  ctx.lineTo(x + size * 0.5, winY + winH);
  ctx.moveTo(x + winPad, winY + winH * 0.5);
  ctx.lineTo(x + winPad + winW, winY + winH * 0.5);
  ctx.stroke();

  // Traditional Black Giwa Roof (기와지붕)
  const roofH = size * 0.55;
  ctx.save();
  ctx.fillStyle = '#1e232a';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(x - 2, y + roofH);
  // Curved roof eave (처마 곡선)
  ctx.quadraticCurveTo(x + size * 0.5, y + 2, x + size + 2, y + roofH);
  ctx.lineTo(x + size + 3, y + roofH - 4);
  ctx.quadraticCurveTo(x + size * 0.5, y - 2, x - 3, y + roofH - 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Roof ridges / tiles (용마루 및 기와골)
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    const rx = x + (size / 4) * i + size * 0.12;
    ctx.beginPath();
    ctx.moveTo(rx, y + 6);
    ctx.lineTo(rx, y + roofH);
    ctx.stroke();
  }
  ctx.restore();
}

// Draw Traditional Stone Wall (돌담)
export function drawStoneWall(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  // Base earthen mortar
  ctx.fillStyle = '#3a342d';
  ctx.fillRect(x, y, size, size);

  // Stacked river stones
  ctx.strokeStyle = '#221c17';
  ctx.lineWidth = 1.5;

  const stones = [
    { sx: x + 2, sy: y + 2, sw: size * 0.55, sh: size * 0.45, col: '#574f45' },
    { sx: x + size * 0.58, sy: y + 2, sw: size * 0.38, sh: size * 0.45, col: '#675f54' },
    { sx: x + 2, sy: y + size * 0.5, sw: size * 0.4, sh: size * 0.45, col: '#4f473e' },
    { sx: x + size * 0.44, sy: y + size * 0.5, sw: size * 0.52, sh: size * 0.45, col: '#5c5449' },
  ];

  for (const st of stones) {
    ctx.fillStyle = st.col;
    ctx.beginPath();
    ctx.roundRect(st.sx, st.sy, st.sw, st.sh, 3);
    ctx.fill();
    ctx.stroke();
  }

  // Top capping stone slab (담장 갓돌)
  ctx.fillStyle = '#312b25';
  ctx.fillRect(x - 1, y, size + 2, 3);
}

// Draw Jangdokdae (장독대 earthen fermentation jars)
export function drawJangdokdae(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  ctx.fillStyle = '#221b16';
  ctx.fillRect(x, y, size, size);

  // Stone terrace slab
  ctx.fillStyle = '#443c35';
  ctx.fillRect(x + 2, y + size * 0.7, size - 4, size * 0.25);

  // Earthen Onggi Jar (옹기 항아리)
  const cx = x + size * 0.5;
  const cy = y + size * 0.55;
  const r = size * 0.32;

  ctx.save();
  ctx.fillStyle = '#2c221e';
  ctx.strokeStyle = '#18120f';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.ellipse(cx, cy, r, r * 1.1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Lid (뚜껑)
  ctx.fillStyle = '#3d302a';
  ctx.beginPath();
  ctx.ellipse(cx, cy - r * 0.9, r * 0.8, r * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Lid handle
  ctx.fillStyle = '#55433a';
  ctx.beginPath();
  ctx.arc(cx, cy - r * 1.15, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Draw Spirit Well (도깨비/귀신 우물)
export function drawSpiritWell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  time: number
) {
  const cx = x + size * 0.5;
  const cy = y + size * 0.5;

  // Outer stone rim
  ctx.save();
  ctx.fillStyle = '#333b46';
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.42, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Deep dark water with mystical swirl
  ctx.fillStyle = '#090d16';
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.32, 0, Math.PI * 2);
  ctx.fill();

  // Eerie ghost mist bubbling from well
  const mistAlpha = Math.sin(time * 4) * 0.25 + 0.4;
  ctx.fillStyle = `rgba(168, 85, 247, ${mistAlpha})`;
  ctx.beginPath();
  ctx.arc(cx + Math.cos(time * 2) * 4, cy + Math.sin(time * 2) * 4, size * 0.22, 0, Math.PI * 2);
  ctx.fill();

  // Small floating spirit eyes in the well
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(cx - 3, cy - 2, 1.5, 0, Math.PI * 2);
  ctx.arc(cx + 3, cy - 2, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Draw Cheongsachorong Lantern (청사초롱)
export function drawLantern(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  time: number
) {
  const cx = x + size * 0.5;
  const cy = y + size * 0.5;

  // Radial warm light glow on ground
  const glowGrad = ctx.createRadialGradient(cx, cy, 4, cx, cy, size * 1.8);
  glowGrad.addColorStop(0, 'rgba(251, 146, 60, 0.22)');
  glowGrad.addColorStop(0.6, 'rgba(239, 68, 68, 0.08)');
  glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Wooden lantern pole
  ctx.strokeStyle = '#451a03';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, y + size);
  ctx.lineTo(cx, cy - 4);
  ctx.stroke();

  // Lantern silk body: Top half Red (Hong), Bottom half Blue (Cheong)
  const sway = Math.sin(time * 2.5 + x) * 2;
  const lx = cx + sway;
  const ly = cy - 6;

  // Red upper silk
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.roundRect(lx - 5, ly - 6, 10, 6, [2, 2, 0, 0]);
  ctx.fill();

  // Blue lower silk
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.roundRect(lx - 5, ly, 10, 6, [0, 0, 2, 2]);
  ctx.fill();

  // Silk fringe / tassel
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(lx, ly + 6);
  ctx.lineTo(lx, ly + 10);
  ctx.stroke();
}

// Draw Player Character (꼬마 도령)
export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  player: Player,
  tileSize: number,
  time: number
) {
  const px = player.x * tileSize + tileSize * 0.5;
  const py = player.y * tileSize + tileSize * 0.5;

  // Invincibility flash (flicker when damaged)
  if (player.invincibleTimer > 0) {
    if (Math.floor(player.invincibleTimer * 12) % 2 === 0) {
      return; // Skip rendering frame for flicker
    }
  }

  ctx.save();
  ctx.translate(px, py);

  const isSpicy = player.spicyTimer > 0;
  const bob = player.isMoving ? Math.sin(player.animTime * 14) * 2.5 : 0;

  // Spicy mode fiery aura
  if (isSpicy) {
    ctx.save();
    const auraRad = tileSize * 0.55 + Math.sin(time * 18) * 3;
    const auraGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, auraRad);
    auraGrad.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
    auraGrad.addColorStop(0.7, 'rgba(249, 115, 22, 0.25)');
    auraGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 0, auraRad, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Shadow on ground
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, tileSize * 0.35, tileSize * 0.28, tileSize * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Character body: Hanbok (두루마기)
  const bodyY = bob;
  ctx.fillStyle = isSpicy ? '#dc2626' : '#2563eb'; // Blue coat, turns blazing crimson when spicy!
  ctx.beginPath();
  ctx.roundRect(-tileSize * 0.24, bodyY - tileSize * 0.15, tileSize * 0.48, tileSize * 0.45, 6);
  ctx.fill();

  // Hanbok decorative belt / ribbon (옷고름)
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(-tileSize * 0.08, bodyY - tileSize * 0.05, tileSize * 0.16, tileSize * 0.25);

  // Cute Little Shoes (꽃신 / 버선)
  const legOffset = player.isMoving ? Math.sin(player.animTime * 14) * 3 : 0;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(-tileSize * 0.12, bodyY + tileSize * 0.32 + legOffset, 4, 3, 0, 0, Math.PI * 2);
  ctx.ellipse(tileSize * 0.12, bodyY + tileSize * 0.32 - legOffset, 4, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cute Head / Face
  const headY = bodyY - tileSize * 0.28;
  const faceColor = isSpicy ? '#fca5a5' : '#fed7aa'; // Blushing red if spicy!
  ctx.fillStyle = faceColor;
  ctx.beginPath();
  ctx.arc(0, headY, tileSize * 0.22, 0, Math.PI * 2);
  ctx.fill();

  // Traditional Hat (복건 / 갓)
  ctx.fillStyle = '#090d16';
  ctx.beginPath();
  ctx.arc(0, headY - 4, tileSize * 0.24, Math.PI, Math.PI * 2);
  ctx.fill();

  // Hat top knob & trailing ribbon (갓끈)
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-3, headY - tileSize * 0.28, 6, 6);

  // Expressive face & eyes according to direction
  const eyeOffset = player.dir === 1 ? 3 : player.dir === 3 ? -3 : 0;
  const eyeYOffset = player.dir === 0 ? -2 : player.dir === 2 ? 2 : 0;

  // Eyes
  ctx.fillStyle = '#0f172a';
  if (isSpicy) {
    // Determined fiery eyes!
    ctx.beginPath();
    ctx.arc(-4 + eyeOffset, headY + eyeYOffset, 2.5, 0, Math.PI * 2);
    ctx.arc(4 + eyeOffset, headY + eyeYOffset, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Fiery eyebrow slants
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-6 + eyeOffset, headY - 4);
    ctx.lineTo(-2 + eyeOffset, headY - 2);
    ctx.moveTo(6 + eyeOffset, headY - 4);
    ctx.lineTo(2 + eyeOffset, headY - 2);
    ctx.stroke();

    // Hot steam puffs from ears!
    ctx.fillStyle = 'rgba(254, 240, 138, 0.7)';
    const puffY = headY - 8 + Math.sin(time * 20) * 3;
    ctx.beginPath();
    ctx.arc(-11, puffY, 3, 0, Math.PI * 2);
    ctx.arc(11, puffY, 3, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Normal cute big eyes
    ctx.beginPath();
    ctx.arc(-4 + eyeOffset, headY + eyeYOffset, 2.2, 0, Math.PI * 2);
    ctx.arc(4 + eyeOffset, headY + eyeYOffset, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Rosy cheeks
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(-7 + eyeOffset, headY + 3, 2, 0, Math.PI * 2);
    ctx.arc(7 + eyeOffset, headY + 3, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// Draw Hungry Ghost (걸신)
export function drawHungryGhost(
  ctx: CanvasRenderingContext2D,
  ghost: HungryGhost,
  tileSize: number,
  time: number
) {
  const gx = ghost.x * tileSize + tileSize * 0.5;
  const gy = ghost.y * tileSize + tileSize * 0.5;

  ctx.save();
  ctx.translate(gx, gy);

  // Floating bob animation
  const floatY = Math.sin(ghost.animTime * 6 + Number(ghost.id.slice(-1) || 0)) * 3;

  // Ethereal Ghost Glow
  const glowGrad = ctx.createRadialGradient(0, floatY, 4, 0, floatY, tileSize * 0.65);
  glowGrad.addColorStop(0, 'rgba(168, 85, 247, 0.35)');
  glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(0, floatY, tileSize * 0.65, 0, Math.PI * 2);
  ctx.fill();

  // Ghostly wavy body (Pac-Man inspired Korean spirit)
  ctx.fillStyle = ghost.color; // Soft lavender/cyan-purple
  ctx.beginPath();
  const r = tileSize * 0.28;
  ctx.arc(0, floatY - 2, r, Math.PI, 0, false);

  // Ghost tail ripples
  const tailY = floatY + tileSize * 0.32;
  const wave = Math.sin(time * 12 + Number(ghost.id.slice(-1) || 0)) * 2;
  ctx.lineTo(r, tailY - 4);
  ctx.quadraticCurveTo(r * 0.5, tailY + wave, 0, tailY - 3);
  ctx.quadraticCurveTo(-r * 0.5, tailY - wave, -r, tailY - 4);
  ctx.closePath();
  ctx.fill();

  // Floating ghost hands holding empty begging bowl (걸신의 밥그릇)
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.ellipse(0, floatY + 6, 7, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#451a03';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Goofy greedy eyes
  const eyeDirX = ghost.dir === 1 ? 2.5 : ghost.dir === 3 ? -2.5 : 0;
  const eyeDirY = ghost.dir === 0 ? -2 : ghost.dir === 2 ? 2 : 0;

  // White sclera
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(-5, floatY - 4, 4.5, 5, 0, 0, Math.PI * 2);
  ctx.ellipse(5, floatY - 4, 4.5, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pupils tracking movement
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.arc(-5 + eyeDirX, floatY - 4 + eyeDirY, 2.5, 0, Math.PI * 2);
  ctx.arc(5 + eyeDirX, floatY - 4 + eyeDirY, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Hungry gaping mouth (opens and shuts)
  const mouthCycle = Math.sin(ghost.animTime * 10);
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  if (mouthCycle > 0) {
    // Open hungry mouth
    ctx.ellipse(0, floatY + 1, 4, 3, 0, 0, Math.PI * 2);
  } else {
    // Narrow greedy line
    ctx.rect(-3, floatY, 6, 2);
  }
  ctx.fill();

  // Little drool drop when chasing!
  if (mouthCycle > 0.4) {
    ctx.fillStyle = '#93c5fd';
    ctx.beginPath();
    ctx.arc(1.5, floatY + 4, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// Draw Red Ghost (붉은 귀신 / 붉은 도깨비) in Sacred Pavilion
export function drawRedGhost(
  ctx: CanvasRenderingContext2D,
  redGhost: RedGhost,
  tileSize: number,
  applesCollected: number,
  time: number
) {
  const rx = redGhost.x * tileSize + tileSize * 0.5;
  const ry = redGhost.y * tileSize + tileSize * 0.5;

  ctx.save();
  ctx.translate(rx, ry);

  const readyToWin = applesCollected >= redGhost.targetApples;

  // Sacred Pavilion Backdrop Pillars (사당 기둥과 처마)
  ctx.strokeStyle = '#b91c1c';
  ctx.lineWidth = 3;
  ctx.strokeRect(-tileSize * 0.65, -tileSize * 0.65, tileSize * 1.3, tileSize * 1.3);

  // Ethereal Sacred Aura (Glowing beacon when player has all 5 apples!)
  const auraRad = tileSize * (readyToWin ? 1.1 + Math.sin(time * 6) * 0.15 : 0.7);
  const auraGrad = ctx.createRadialGradient(0, 0, 6, 0, 0, auraRad);
  if (readyToWin) {
    auraGrad.addColorStop(0, 'rgba(250, 204, 21, 0.7)');
    auraGrad.addColorStop(0.5, 'rgba(239, 68, 68, 0.4)');
    auraGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
  } else {
    auraGrad.addColorStop(0, 'rgba(239, 68, 68, 0.35)');
    auraGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
  }
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(0, 0, auraRad, 0, Math.PI * 2);
  ctx.fill();

  const float = Math.sin(time * 3) * 2;

  // Red Ghost Crimson Robe (붉은 도포)
  ctx.fillStyle = '#991b1b';
  ctx.beginPath();
  ctx.roundRect(-tileSize * 0.3, float - tileSize * 0.1, tileSize * 0.6, tileSize * 0.5, 8);
  ctx.fill();

  // Golden Hanbok Trim
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Red Dokkaebi Face
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(0, float - tileSize * 0.22, tileSize * 0.25, 0, Math.PI * 2);
  ctx.fill();

  // Cute Dokkaebi Horns (작은 뿔)
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(-tileSize * 0.15, float - tileSize * 0.42);
  ctx.lineTo(-tileSize * 0.22, float - tileSize * 0.58);
  ctx.lineTo(-tileSize * 0.08, float - tileSize * 0.44);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(tileSize * 0.15, float - tileSize * 0.42);
  ctx.lineTo(tileSize * 0.22, float - tileSize * 0.58);
  ctx.lineTo(tileSize * 0.08, float - tileSize * 0.44);
  ctx.fill();

  // Friendly glowing eyes
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(-5, float - tileSize * 0.24, 3, 0, Math.PI * 2);
  ctx.arc(5, float - tileSize * 0.24, 3, 0, Math.PI * 2);
  ctx.fill();

  // Warm gentle smile
  ctx.strokeStyle = '#450a0a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, float - tileSize * 0.18, 5, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // Open welcoming hands holding a sacred plate
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.ellipse(0, float + tileSize * 0.12, tileSize * 0.28, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Floating request bubble above head
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const bubbleY = float - tileSize * 0.72;
  if (readyToWin) {
    // Win beacon!
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.roundRect(-42, bubbleY - 10, 84, 20, 6);
    ctx.fill();
    ctx.strokeStyle = '#ca8a04';
    ctx.stroke();

    ctx.fillStyle = '#78350f';
    ctx.fillText('🍎 사과를 주게!', 0, bubbleY);
  } else {
    // Need more apples
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.roundRect(-35, bubbleY - 9, 70, 18, 6);
    ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.stroke();

    ctx.fillStyle = '#fca5a5';
    ctx.fillText(`🍎 ${applesCollected}/${redGhost.targetApples}`, 0, bubbleY);
  }

  ctx.restore();
}

// Draw Sacred Apple (영험한 사과)
export function drawApple(
  ctx: CanvasRenderingContext2D,
  item: Item,
  tileSize: number,
  time: number
) {
  const ax = item.x * tileSize + tileSize * 0.5;
  const ay = item.y * tileSize + tileSize * 0.5 + Math.sin(time * 4 + item.floatOffset) * 3;

  ctx.save();
  ctx.translate(ax, ay);

  // Soft sparkle aura
  const auraGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 14);
  auraGrad.addColorStop(0, 'rgba(239, 68, 68, 0.35)');
  auraGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 14, 0, Math.PI * 2);
  ctx.fill();

  // Apple Body (Glossy Red)
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.ellipse(-3.5, 0, 6, 7.5, -0.1, 0, Math.PI * 2);
  ctx.ellipse(3.5, 0, 6, 7.5, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Shiny highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.beginPath();
  ctx.ellipse(-3, -2.5, 2, 3.5, -0.4, 0, Math.PI * 2);
  ctx.fill();

  // Cute smiley face on apple!
  ctx.fillStyle = '#450a0a';
  ctx.beginPath();
  ctx.arc(-2, 1, 1, 0, Math.PI * 2);
  ctx.arc(2, 1, 1, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#450a0a';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.arc(0, 2.5, 2, 0.1, Math.PI - 0.1);
  ctx.stroke();

  // Apple Stem & Green Leaf
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -6);
  ctx.quadraticCurveTo(1, -9, 3, -11);
  ctx.stroke();

  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.ellipse(4, -8, 3.5, 1.8, 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Draw Spicy Red Pepper (홍고추)
export function drawPepper(
  ctx: CanvasRenderingContext2D,
  item: Item,
  tileSize: number,
  time: number
) {
  const px = item.x * tileSize + tileSize * 0.5;
  const py = item.y * tileSize + tileSize * 0.5 + Math.sin(time * 5 + item.floatOffset) * 3;

  ctx.save();
  ctx.translate(px, py);

  // Fiery heat aura
  const heatGrad = ctx.createRadialGradient(0, 0, 3, 0, 0, 16);
  heatGrad.addColorStop(0, 'rgba(249, 115, 22, 0.5)');
  heatGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
  ctx.fillStyle = heatGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.fill();

  // Curved Chili Body
  ctx.fillStyle = '#e11d48';
  ctx.beginPath();
  ctx.moveTo(-1, -7);
  ctx.bezierCurveTo(7, -4, 9, 4, 1, 10);
  ctx.bezierCurveTo(-2, 5, -6, 0, -5, -4);
  ctx.closePath();
  ctx.fill();

  // Spicy angry eyebrows and cute face!
  ctx.fillStyle = '#4c0519';
  ctx.beginPath();
  ctx.arc(-1, -1, 1, 0, Math.PI * 2);
  ctx.arc(3, -1, 1, 0, Math.PI * 2);
  ctx.fill();

  // Green stem cap
  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.roundRect(-4, -9, 8, 3, 1);
  ctx.fill();

  // Steam/flame particle above pepper
  ctx.fillStyle = '#f59e0b';
  const flameY = -11 + Math.sin(time * 16) * 1.5;
  ctx.beginPath();
  ctx.arc(0, flameY, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Draw Flying Particles (Sparkles, Flames, Mist)
export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const p of particles) {
    const alpha = Math.max(0, p.life / p.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;

    if (p.type === 'FIRE') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'SPARKLE') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'CONFETTI') {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size * 1.5);
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}
