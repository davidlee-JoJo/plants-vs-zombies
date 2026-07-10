import { create } from 'zustand'
import type { Wave, PlantType, ZombieType, GameState } from '../types'
import { PLANT_CONFIG, ZOMBIE_CONFIG, COLS, CELL_SIZE, cellToWorld } from '../constants'

interface GameActions {
  addPlant: (type: PlantType, row: number, col: number) => void
  setSelectedPlant: (type: PlantType | null) => void
  startWave: () => void
  collectSun: (id: string) => void
  reset: () => void
  tick: (dt: number) => void
}

const ZOMBIE_START_X = COLS * CELL_SIZE + 3

function generateWaves(level: number): Wave[] {
  const waves: Wave[] = []
  const count = Math.min(3 + level, 10)
  for (let i = 0; i < count; i++) {
    const zombies: { type: ZombieType; row: number; delay: number }[] = []
    const countZombies = 4 + i + level
    for (let j = 0; j < countZombies; j++) {
      const r = Math.floor(Math.random() * 5)
      let type: ZombieType = 'basic'
      if (level >= 2 && Math.random() < 0.2 + i * 0.05) type = 'cone'
      if (level >= 3 && Math.random() < 0.1 + i * 0.03) type = 'bucket'
      zombies.push({ type, row: r, delay: j * (0.8 + Math.random() * 0.5) })
    }
    waves.push({ number: i + 1, zombies, spawned: 0 })
  }
  return waves
}

const initialState: GameState = {
  sun: 500,
  plants: [],
  zombies: [],
  projectiles: [],
  suns: [],
  waves: [],
  currentWave: 0,
  gameOver: false,
  victory: false,
  selectedPlant: null,
  level: 1,
}

let nextId = 0
const genId = () => `e${nextId++}`

const skyTimer = { value: 0 }

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,

  addPlant: (type, row, col) => {
    const state = get()
    if (state.gameOver || state.victory) return
    const key = `${row}-${col}`
    if (state.plants.some((p) => `${p.row}-${p.col}` === key)) return
    if (state.sun < PLANT_CONFIG[type].cost) return
    set((s) => ({
      sun: s.sun - PLANT_CONFIG[type].cost,
      plants: [...s.plants, {
        id: genId(), type, row, col,
        hp: PLANT_CONFIG[type].hp, maxHp: PLANT_CONFIG[type].hp,
        lastShot: 0, lastSun: 0,
      }],
    }))
  },

  setSelectedPlant: (type) => set((s) => ({
    selectedPlant: s.selectedPlant === type ? null : type,
  })),

  startWave: () => {
    const waves = generateWaves(get().level)
    skyTimer.value = 0
    set({ waves, currentWave: 0, gameOver: false, victory: false })
  },

  collectSun: (id) => {
    set((s) => {
      const sun = s.suns.find((su) => su.id === id)
      if (!sun) return {}
      return { sun: s.sun + sun.value, suns: s.suns.filter((s2) => s2.id !== id) }
    })
  },

  reset: () => {
    skyTimer.value = 0
    set({ ...initialState })
  },

  tick: (dt) => {
    const state = get()
    if (state.gameOver || state.victory) return
    if (state.waves.length === 0) return

    set((s) => {
      const now = performance.now() / 1000
      let { plants, zombies, projectiles, suns, waves, currentWave } = s

      // --- wave spawning ---
      // Use a simple counter per wave stored on the wave object
      const wave = waves[currentWave]
      if (wave && wave.spawned < wave.zombies.length) {
        (wave as any)._spawnTimer = ((wave as any)._spawnTimer ?? 0) + dt
        if ((wave as any)._spawnTimer >= 1.0) {
          (wave as any)._spawnTimer = 0
          const next = wave.zombies[wave.spawned]
          if (next) {
            zombies = [...zombies, {
              id: genId(), type: next.type, row: next.row, col: COLS,
              hp: ZOMBIE_CONFIG[next.type].hp, maxHp: ZOMBIE_CONFIG[next.type].hp,
              speed: ZOMBIE_CONFIG[next.type].speed, attackCooldown: 0, x: ZOMBIE_START_X,
            }]
            waves = waves.map((w, i) =>
              i === currentWave ? { ...w, spawned: w.spawned + 1 } : w
            )
          }
        }
      }

      // --- zombies: move & attack ---
      zombies = zombies.map((z) => {
        if (z.hp <= 0) return z
        const plantInFront = plants.find(
          (p) => p.row === z.row && Math.abs(p.col * CELL_SIZE - z.x) < 1.0
        )
        if (plantInFront) {
          const newCd = z.attackCooldown - dt
          if (newCd <= 0) {
            plants = plants.map((p) =>
              p.id === plantInFront.id ? { ...p, hp: p.hp - ZOMBIE_CONFIG[z.type].damage } : p
            )
            return { ...z, attackCooldown: ZOMBIE_CONFIG[z.type].attackSpeed }
          }
          return { ...z, attackCooldown: Math.max(newCd, 0) }
        }
        return { ...z, x: z.x - z.speed * dt }
      }).filter((z) => z.hp > 0)

      plants = plants.filter((p) => p.hp > 0)

      // --- projectiles: move & hit ---
      projectiles = projectiles
        .map((p) => ({ ...p, x: p.x + 0.5 }))
        .filter((p) => {
          if (p.x > COLS * CELL_SIZE + 3) return false
          const idx = zombies.findIndex(
            (z) => z.hp > 0 && z.row === p.row && Math.abs(z.x - p.x) < 0.7
          )
          if (idx >= 0) {
            const newHp = zombies[idx].hp - p.damage
            zombies = zombies.map((z, i) =>
              i === idx ? { ...z, hp: Math.max(newHp, 0) } : z
            ).filter((z) => z.hp > 0)
            return false
          }
          return true
        })

      // --- game over ---
      if (zombies.some((z) => z.x < -1)) {
        return { gameOver: true, plants, zombies, projectiles, suns, waves }
      }

      // --- wave transition: all spawned + all dead from this wave ---
      const remainingFromWave = zombies.filter((z) => {
        const w = waves[currentWave]
        return w && z.row >= 0 && z.row < 5
      })
      if (
        wave &&
        wave.spawned >= wave.zombies.length &&
        remainingFromWave.length === 0 &&
        currentWave < waves.length - 1
      ) {
        currentWave++
      }

      // --- victory ---
      const allWavesDone = waves.every((w) => w.spawned >= w.zombies.length)
      if (allWavesDone && zombies.length === 0) {
        return { victory: true, plants, zombies, projectiles, suns, waves }
      }

      // --- plants shoot ---
      plants = plants.map((p) => {
        if (p.type !== 'peashooter' && p.type !== 'snowpea') return p
        const hasTarget = zombies.some((z) => z.hp > 0 && z.row === p.row && z.x > p.col * CELL_SIZE)
        if (!hasTarget) return p
        if (p.lastShot === 0 || now - p.lastShot > 1.5) {
          projectiles = [...projectiles, {
            id: genId(), row: p.row, x: p.col * CELL_SIZE + 0.6,
            damage: PLANT_CONFIG[p.type].damage,
            slow: p.type === 'snowpea',
          }]
          return { ...p, lastShot: now }
        }
        return p
      })

      // --- sun production ---
      plants = plants.map((p) => {
        if (p.type !== 'sunflower') return p
        if (p.lastSun === 0 || now - p.lastSun > 10) {
          const pos = cellToWorld(p.col, p.row)
          suns = [...suns, { id: genId(), x: pos.x, y: 3, value: 25, targetY: pos.z + 0.5 }]
          return { ...p, lastSun: now }
        }
        return p
      })

      // --- sky sun drops ---
      skyTimer.value += dt
      if (skyTimer.value > 5) {
        skyTimer.value = 0
        suns = [...suns, { id: genId(), x: Math.random() * 12, y: 6, value: 25, targetY: Math.random() * 6 - 3 }]
      }

      return { plants, zombies, projectiles, suns, waves, currentWave }
    })
  },
}))
