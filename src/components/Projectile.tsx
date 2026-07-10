import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { cellToWorld } from '../constants'
import type { Projectile } from '../types'

interface Props { projectile: Projectile }

export function Projectile3D({ projectile }: Props) {
  const ref = useRef<THREE.Mesh>(null)
  const { z } = cellToWorld(0, projectile.row)

  useFrame(() => {
    if (!ref.current) return
    ref.current.rotation.x += 0.2
    ref.current.rotation.z += 0.15
  })

  return (
    <mesh ref={ref} position={[projectile.x, 0.65, z]}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial
        color={projectile.slow ? '#00BCD4' : '#4CAF50'}
        emissive={projectile.slow ? '#00BCD4' : '#4CAF50'}
        emissiveIntensity={0.2}
      />
    </mesh>
  )
}
