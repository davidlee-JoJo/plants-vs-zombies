import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { cellToWorld } from '../../constants'
import type { Plant } from '../../types'

interface Props { plant: Plant }

export function WallNut({ plant }: Props) {
  const ref = useRef<THREE.Group>(null)
  const { x, z } = cellToWorld(plant.col, plant.row)
  const hpPercent = plant.hp / plant.maxHp

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.position.y = 0.4 + Math.sin(clock.getElapsedTime() * 0.5) * 0.02
  })

  const crack = hpPercent < 0.67 ? (hpPercent < 0.33 ? '#A0522D' : '#8B7D6B') : null

  return (
    <group ref={ref} position={[x, 0, z]}>
      {/* pot - wider for wallnut */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.55, 0.45, 0.25, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* wallnut body */}
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.45, 12, 12]} />
        <meshStandardMaterial
          color={hpPercent > 0.67 ? '#D2691E' : hpPercent > 0.33 ? '#C4A882' : '#A0522D'}
        />
      </mesh>
      {/* face */}
      <mesh position={[-0.12, 0.65, 0.4]}>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.12, 0.65, 0.4]}>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-0.12, 0.65, 0.41]}>
        <sphereGeometry args={[0.03]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.12, 0.65, 0.41]}>
        <sphereGeometry args={[0.03]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* eyebrows */}
      <mesh position={[-0.12, 0.72, 0.4]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.1, 0.02, 0.02]} />
        <meshStandardMaterial color={crack || '#5D4037'} />
      </mesh>
      <mesh position={[0.12, 0.72, 0.4]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[0.1, 0.02, 0.02]} />
        <meshStandardMaterial color={crack || '#5D4037'} />
      </mesh>
      {/* angry mouth */}
      <mesh position={[0, 0.5, 0.4]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.12, 0.025, 0.02]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      {/* crack lines when damaged */}
      {hpPercent < 0.67 && (
        <mesh position={[0.15, 0.55, 0.42]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.08, 0.005, 0.01]} />
          <meshStandardMaterial color="#5D4037" />
        </mesh>
      )}
      {hpPercent < 0.33 && (
        <mesh position={[-0.15, 0.4, 0.42]} rotation={[0, 0, -0.4]}>
          <boxGeometry args={[0.06, 0.005, 0.01]} />
          <meshStandardMaterial color="#5D4037" />
        </mesh>
      )}
    </group>
  )
}
