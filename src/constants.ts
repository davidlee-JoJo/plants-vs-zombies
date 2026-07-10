export const ROWS = 5
export const COLS = 9
export const CELL_SIZE = 1.5
export const GRID_OFFSET_X = 0
export const GRID_OFFSET_Z = 0

export function cellToWorld(col: number, row: number): { x: number; z: number } {
  return {
    x: col * CELL_SIZE,
    z: row * CELL_SIZE - ((ROWS - 1) * CELL_SIZE) / 2,
  }
}

export function worldToCell(x: number): number {
  return Math.round(x / CELL_SIZE)
}

export const PLANT_CONFIG = {
  sunflower: { cost: 50, hp: 100, cooldown: 10, sunInterval: 10, label: '向日葵' },
  peashooter: { cost: 100, hp: 100, cooldown: 1.5, damage: 20, label: '豌豆射手' },
  wallnut: { cost: 50, hp: 400, cooldown: 0, label: '堅果牆' },
  snowpea: { cost: 175, hp: 100, cooldown: 1.5, damage: 20, slowFactor: 0.5, label: '寒冰射手' },
} as const

export const ZOMBIE_CONFIG = {
  basic: { hp: 60, speed: 0.4, damage: 30, attackSpeed: 1, label: '普通殭屍' },
  cone: { hp: 120, speed: 0.35, damage: 30, attackSpeed: 1, label: '路障殭屍' },
  bucket: { hp: 250, speed: 0.3, damage: 30, attackSpeed: 1, label: '鐵桶殭屍' },
} as const
