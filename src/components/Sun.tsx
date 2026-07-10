import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Sun as SunType } from '../types'
import { useGameStore } from '../stores/gameStore'

interface Props { sun: SunType }

export function Sun3D({ sun }: Props) {
  const ref = useRef<THREE.Group>(null)
  const collectSun = useGameStore((s) => s.collectSun)
  const targetY = useRef(0.3)
  const hitGround = useRef(false)

  useFrame((_, delta) => {
    if (!ref.current || hitGround.current) return
    const pos = ref.current.position
    if (pos.y > targetY.current) {
      pos.y -= delta * 1.5
    } else {
      pos.y = targetY.current
      hitGround.current = true
    }
    ref.current.rotation.y += delta * 0.5
  })

  return (
    <group
      ref={ref}
      position={[sun.x, sun.y, sun.targetY]}
      onClick={(e) => {
        e.stopPropagation()
        collectSun(sun.id)
      }}
    >
      {/* glow */}
      <mesh>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.15} transparent opacity={0.3} />
      </mesh>
      {/* core */}
      <mesh>
        <sphereGeometry args={[0.16]} />
        <meshStandardMaterial color="#FFF176" emissive="#FFD700" emissiveIntensity={0.3} />
      </mesh>
      {/* rays */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * Math.PI * 2) / 6
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.22, 0, Math.sin(angle) * 0.22]}>
            <planeGeometry args={[0.06, 0.12]} />
            <meshStandardMaterial color="#FFD700" side={2} />
          </mesh>
        )
      })}
    </group>
  )
}
