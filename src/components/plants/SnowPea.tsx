import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { cellToWorld } from '../../constants'
import type { Plant } from '../../types'

interface Props { plant: Plant }

export function SnowPea({ plant }: Props) {
  const ref = useRef<THREE.Group>(null)
  const mouthRef = useRef<THREE.Mesh>(null)
  const { x, z } = cellToWorld(plant.col, plant.row)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.position.y = 0.45 + Math.sin(t * 1.8) * 0.04
    if (mouthRef.current) {
      mouthRef.current.scale.x = 0.8 + Math.sin(t * 3) * 0.2
    }
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
        <cylinderGeometry args={[0.06, 0.1, 0.3, 6]} />
        <meshStandardMaterial color="#006064" />
      </mesh>
      {/* head */}
      <mesh position={[0, 0.65, 0]}>
        <sphereGeometry args={[0.32, 10, 10]} />
        <meshStandardMaterial color="#00ACC1" />
      </mesh>
      {/* ice crown */}
      <mesh position={[0, 0.9, 0]}>
        <coneGeometry args={[0.25, 0.15, 6]} />
        <meshStandardMaterial color="#80DEEA" emissive="#4DD0E1" emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <coneGeometry args={[0.15, 0.12, 6]} />
        <meshStandardMaterial color="#B2EBF2" emissive="#4DD0E1" emissiveIntensity={0.2} />
      </mesh>
      {/* eyes */}
      <mesh position={[-0.14, 0.7, 0.28]}>
        <sphereGeometry args={[0.06]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.14, 0.7, 0.28]}>
        <sphereGeometry args={[0.06]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-0.14, 0.7, 0.3]}>
        <sphereGeometry args={[0.035]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.14, 0.7, 0.3]}>
        <sphereGeometry args={[0.035]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* mouth */}
      <mesh ref={mouthRef} position={[0.32, 0.6, 0]} rotation={[0, 0, -0.1]}>
        <cylinderGeometry args={[0.1, 0.15, 0.3, 8]} />
        <meshStandardMaterial color="#00838F" />
      </mesh>
      {/* leaves */}
      <mesh position={[-0.2, 0.45, 0]} rotation={[0, 0, 0.4]}>
        <planeGeometry args={[0.25, 0.12]} />
        <meshStandardMaterial color="#006064" side={2} />
      </mesh>
      <mesh position={[0.2, 0.45, 0]} rotation={[0, 0, -0.4]}>
        <planeGeometry args={[0.25, 0.12]} />
        <meshStandardMaterial color="#006064" side={2} />
      </mesh>
    </group>
  )
}
