import { useCallback } from 'react'
import { ROWS, COLS, CELL_SIZE } from '../constants'
import { useGameStore } from '../stores/gameStore'

export function Board() {
  const addPlant = useGameStore((s) => s.addPlant)
  const selectedPlant = useGameStore((s) => s.selectedPlant)

  const handleClick = useCallback((row: number, col: number) => {
    if (selectedPlant) {
      addPlant(selectedPlant, row, col)
    }
  }, [selectedPlant, addPlant])

  const cells = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = c * CELL_SIZE
      const z = r * CELL_SIZE - ((ROWS - 1) * CELL_SIZE) / 2
      cells.push(
        <mesh
          key={`${r}-${c}`}
          position={[x, -0.01, z]}
          rotation={[-Math.PI / 2, 0, 0]}
          onClick={(e) => {
            e.stopPropagation()
            handleClick(r, c)
          }}
        >
          <planeGeometry args={[CELL_SIZE - 0.15, CELL_SIZE - 0.15]} />
          <meshStandardMaterial
            color={(r + c) % 2 === 0 ? '#5a8f3c' : '#4a7c3f'}
          />
        </mesh>
      )
    }
  }
  return <group>{cells}</group>
}
