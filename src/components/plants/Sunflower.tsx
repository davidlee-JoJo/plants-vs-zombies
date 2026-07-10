import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { cellToWorld } from '../../constants'
import type { Plant } from '../../types'

interface Props { plant: Plant }

export function Sunflower({ plant }: Props) {
  const ref = useRef<THREE.Group>(null)
  const { x, z } = cellToWorld(plant.col, plant.row)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.position.y = 0.5 + Math.sin(t * 1.2) * 0.06
    ref.current.rotation.y = Math.sin(t * 0.3) * 0.1
  })

  return (
    <group ref={ref} position={[x, 0, z]}>
      {/* pot */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.5, 0.4, 0.25, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* stem */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.35, 6]} />
        <meshStandardMaterial color="#2E7D32" />
      </mesh>
      {/* flower center */}
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.2, 10, 10]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      {/* petals */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i * Math.PI * 2) / 8
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.38, 0.72, Math.sin(angle) * 0.38]}
            rotation={[0.3, -angle, 0]}
          >
            <planeGeometry args={[0.2, 0.32]} />
            <meshStandardMaterial color="#FFC107" side={2} />
          </mesh>
        )
      })}
      {/* inner ring petals */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * Math.PI * 2) / 6 + 0.3
        return (
          <mesh
            key={`inner-${i}`}
            position={[Math.cos(angle) * 0.28, 0.73, Math.sin(angle) * 0.28]}
            rotation={[0.2, -angle, 0]}
          >
            <planeGeometry args={[0.15, 0.22]} />
            <meshStandardMaterial color="#FFCA28" side={2} />
          </mesh>
        )
      })}
      {/* face center */}
      <mesh position={[0, 0.72, 0.18]}>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial color="#4E342E" />
      </mesh>
      {/* eyes */}
      <mesh position={[-0.08, 0.75, 0.22]}>
        <sphereGeometry args={[0.04]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.08, 0.75, 0.22]}>
        <sphereGeometry args={[0.04]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-0.08, 0.75, 0.23]}>
        <sphereGeometry args={[0.025]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.08, 0.75, 0.23]}>
        <sphereGeometry args={[0.025]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* smile */}
      <mesh position={[0, 0.69, 0.22]} rotation={[0.2, 0, 0]}>
        <torusGeometry args={[0.06, 0.015, 4, 8, Math.PI]} />
        <meshStandardMaterial color="#4E342E" />
      </mesh>
    </group>
  )
}
