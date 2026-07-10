import { useGameStore } from '../../stores/gameStore'
import { PLANT_CONFIG } from '../../constants'
import type { PlantType } from '../../types'

const plants: PlantType[] = ['sunflower', 'peashooter', 'wallnut', 'snowpea']

export function PlantSelector() {
  const selectedPlant = useGameStore((s) => s.selectedPlant)
  const setSelectedPlant = useGameStore((s) => s.setSelectedPlant)
  const sun = useGameStore((s) => s.sun)

  return (
    <div style={{ display: 'flex', gap: 8, padding: '8px 16px', background: '#333', alignItems: 'center' }}>
      {plants.map((type) => {
        const config = PLANT_CONFIG[type]
        const canAfford = sun >= config.cost
        return (
          <button
            key={type}
            onClick={() => setSelectedPlant(selectedPlant === type ? null : type)}
            style={{
              padding: '8px 12px',
              border: selectedPlant === type ? '2px solid #FFD700' : '2px solid transparent',
              borderRadius: 8,
              background: canAfford ? '#555' : '#444',
              cursor: canAfford ? 'pointer' : 'not-allowed',
              opacity: canAfford ? 1 : 0.5,
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              minWidth: 80,
            }}
          >
            <span style={{ fontSize: 24 }}>{type === 'sunflower' ? '🌻' : type === 'peashooter' ? '🌱' : type === 'wallnut' ? '🥜' : '❄️'}</span>
            <span style={{ fontSize: 12 }}>{config.label}</span>
            <span style={{ fontSize: 11, color: '#FFD700' }}>☀ {config.cost}</span>
          </button>
        )
      })}
    </div>
  )
}
