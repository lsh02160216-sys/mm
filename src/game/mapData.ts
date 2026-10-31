import { TileType } from '../types/game';

// 21 rows x 25 cols map representing a Korean Hanok Village (한옥마을)
// # : Hanok Tile House (기와집)
// = : Stone Wall / Fence (돌담)
// . : Walkable Alley (돌담길 / 안길)
// S : Red Ghost Sacred Pavilion (붉은 귀신의 사당)
// W : Spirit Well (도깨비/귀신 우물)
// D : Jangdokdae (장독대) / Pine Tree (소나무)

export const MAP_ROWS = 21;
export const MAP_COLS = 25;

export const RAW_MAP: string[] = [
  "#########################", // 0
  "#...=.......S.......=...#", // 1 (S: Red Ghost Shrine)
  "#.=.=.#####...#####.=.=.#", // 2
  "#.......#.......#.......#", // 3
  "#.#####.=.#####.=.#####.#", // 4
  "#...#.......#.......#...#", // 5
  "###.=.##=##...##=##.=.###", // 6
  "#...#...#...W...#...#...#", // 7 (W: North Spirit Well)
  "#.=.###.=.#####.=.###.=.#", // 8
  "#.......#.......#.......#", // 9
  "##=##.#...##.##...#.##=##", // 10
  "#...#.#.D.......D.#.#...#", // 11 (D: Jangdokdae jars)
  "#.=.#.#.#########.#.#.=.#", // 12
  "#...#.......W.......#...#", // 13 (W: Center-South Well)
  "#.#####.###...###.#####.#", // 14
  "#...=...#.......#...=...#", // 15
  "###.=.#.#.#####.#.#.=.###", // 16
  "#...#.#.#...#...#.#.#...#", // 17
  "#.=.=.#...#...#...#.=.=.#", // 18
  "#.......#...P...#.......#", // 19 (P: Player Start)
  "#########################", // 20
];

export interface MapData {
  rows: number;
  cols: number;
  grid: TileType[][];
  playerStart: { x: number; y: number };
  redGhostPos: { x: number; y: number };
  spiritWells: { x: number; y: number }[];
  initialApples: { x: number; y: number }[];
  initialPeppers: { x: number; y: number }[];
  lanterns: { x: number; y: number }[];
}

export function parseMap(): MapData {
  const grid: TileType[][] = [];
  let playerStart = { x: 12, y: 19 };
  let redGhostPos = { x: 12, y: 1 };
  const spiritWells: { x: number; y: number }[] = [];

  for (let r = 0; r < MAP_ROWS; r++) {
    const row: TileType[] = [];
    const line = RAW_MAP[r];
    for (let c = 0; c < MAP_COLS; c++) {
      const ch = line[c] || '#';
      if (ch === '#') {
        row.push('HOUSE');
      } else if (ch === '=') {
        row.push('WALL');
      } else if (ch === 'S') {
        row.push('SHRINE');
        redGhostPos = { x: c, y: r };
      } else if (ch === 'W') {
        row.push('WELL');
        spiritWells.push({ x: c, y: r });
      } else if (ch === 'D') {
        row.push('DECORATION');
      } else if (ch === 'P') {
        row.push('EMPTY');
        playerStart = { x: c, y: r };
      } else {
        row.push('EMPTY');
      }
    }
    grid.push(row);
  }

  // Pre-designated picturesque locations for Sacred Apples (total 6 on map, need 5 to win)
  const initialApples = [
    { x: 3, y: 3 },
    { x: 21, y: 3 },
    { x: 3, y: 15 },
    { x: 21, y: 15 },
    { x: 7, y: 9 },
    { x: 17, y: 9 },
    { x: 12, y: 11 },
  ];

  // Pre-designated spicy hot peppers (홍고추) for speed boosting
  const initialPeppers = [
    { x: 1, y: 7 },
    { x: 23, y: 7 },
    { x: 7, y: 17 },
    { x: 17, y: 17 },
  ];

  // Scenic Korean lanterns (청사초롱) located at alley junctions
  const lanterns = [
    { x: 4, y: 1 },
    { x: 20, y: 1 },
    { x: 8, y: 3 },
    { x: 16, y: 3 },
    { x: 4, y: 9 },
    { x: 20, y: 9 },
    { x: 8, y: 15 },
    { x: 16, y: 15 },
    { x: 10, y: 19 },
    { x: 14, y: 19 },
  ];

  return {
    rows: MAP_ROWS,
    cols: MAP_COLS,
    grid,
    playerStart,
    redGhostPos,
    spiritWells,
    initialApples,
    initialPeppers,
    lanterns,
  };
}

export function isWalkable(grid: TileType[][], col: number, row: number): boolean {
  if (row < 0 || row >= MAP_ROWS || col < 0 || col >= MAP_COLS) {
    return false;
  }
  const tile = grid[row][col];
  return tile === 'EMPTY' || tile === 'SHRINE' || tile === 'WELL';
}
