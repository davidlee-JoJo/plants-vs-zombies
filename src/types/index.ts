export type PlantType = 'sunflower' | 'peashooter' | 'wallnut' | 'snowpea'
export type ZombieType = 'basic' | 'cone' | 'bucket'

export interface Plant {
  id: string
  type: PlantType
  row: number
  col: number
  hp: number
  maxHp: number
  lastShot: number
  lastSun: number
}

export interface Zombie {
  id: string
  type: ZombieType
  row: number
  col: number
  hp: number
  maxHp: number
  speed: number
  attackCooldown: number
  x: number
}

export interface Projectile {
  id: string
  row: number
  x: number
  damage: number
  slow?: boolean
}

export interface Sun {
  id: string
  x: number
  y: number
  value: number
  targetY: number
}

export interface Wave {
  number: number
  zombies: { type: ZombieType; row: number; delay: number }[]
  spawned: number
}

export interface GameState {
  sun: number
  plants: Plant[]
  zombies: Zombie[]
  projectiles: Projectile[]
  suns: Sun[]
  waves: Wave[]
  currentWave: number
  gameOver: boolean
  victory: boolean
  selectedPlant: PlantType | null
  level: number
}
