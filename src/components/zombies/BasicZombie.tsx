import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { cellToWorld } from '../../constants'
import type { Zombie } from '../../types'

interface Props { zombie: Zombie }

export function BasicZombie({ zombie }: Props) {
  const ref = useRef<THREE.Group>(null)
  const armLRef = useRef<THREE.Group>(null)
  const armRRef = useRef<THREE.Group>(null)
  const { z } = cellToWorld(0, zombie.row)

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.position.x = zombie.x
    ref.current.position.z = z
    ref.current.position.y = 0.05

    if (armLRef.current) {
      armLRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 2) * 0.2
    }
    if (armRRef.current) {
      armRRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 2 + Math.PI) * 0.2
    }
  })

  const hpPct = zombie.hp / zombie.maxHp
  const bodyColor = zombie.type === 'bucket' ? '#757575' : '#6B8E23'
  const shirtColor = zombie.type === 'bucket' ? '#616161' : '#556B2F'

  return (
    <group ref={ref}>
      {/* body */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.32, 0.5, 0.22]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      {/* shirt */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.34, 0.3, 0.24]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>
      {/* head */}
      <mesh position={[0, 0.78, 0]}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshStandardMaterial color="#9E9E9E" />
      </mesh>
      {/* hair */}
      <mesh position={[0, 0.88, -0.05]}>
        <sphereGeometry args={[0.14, 8, 8]} />
        <meshStandardMaterial color="#424242" />
      </mesh>
      {/* eyes */}
      <mesh position={[-0.08, 0.8, 0.16]}>
        <sphereGeometry args={[0.03]} />
        <meshStandardMaterial color="#FFEB3B" />
      </mesh>
      <mesh position={[0.08, 0.8, 0.16]}>
        <sphereGeometry args={[0.03]} />
        <meshStandardMaterial color="#FFEB3B" />
      </mesh>
      {/* eye dots */}
      <mesh position={[-0.08, 0.8, 0.17]}>
        <sphereGeometry args={[0.015]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.08, 0.8, 0.17]}>
        <sphereGeometry args={[0.015]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* mouth */}
      <mesh position={[0, 0.72, 0.17]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.1, 0.015, 0.01]} />
        <meshStandardMaterial color="#555" />
      </mesh>

      {/* hat */}
      {zombie.type === 'cone' && (
        <mesh position={[0, 0.94, 0]}>
          <coneGeometry args={[0.22, 0.3, 8]} />
          <meshStandardMaterial color="#FF6600" />
        </mesh>
      )}
      {zombie.type === 'bucket' && (
        <group>
          <mesh position={[0, 0.93, 0]}>
            <cylinderGeometry args={[0.22, 0.24, 0.25, 8]} />
            <meshStandardMaterial color="#9E9E9E" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.05, 0]}>
            <torusGeometry args={[0.22, 0.02, 4, 8]} />
            <meshStandardMaterial color="#BDBDBD" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      )}

      {/* arms */}
      <group ref={armLRef} position={[-0.22, 0.5, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.05, 0.06, 0.3, 6]} />
          <meshStandardMaterial color="#9E9E9E" />
        </mesh>
      </group>
      <group ref={armRRef} position={[0.22, 0.5, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.05, 0.06, 0.3, 6]} />
          <meshStandardMaterial color="#9E9E9E" />
        </mesh>
      </group>

      {/* legs */}
      <mesh position={[-0.1, 0.1, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 0.2, 6]} />
        <meshStandardMaterial color="#424242" />
      </mesh>
      <mesh position={[0.1, 0.1, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 0.2, 6]} />
        <meshStandardMaterial color="#424242" />
      </mesh>

      {/* HP bar */}
      {hpPct < 1 && (
        <group position={[0, -0.05, 0]}>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[0.4, 0.04]} />
            <meshStandardMaterial color="#333" side={2} />
          </mesh>
          <mesh position={[-(1 - hpPct) * 0.2, 0, 0.01]}>
            <planeGeometry args={[0.4 * hpPct, 0.035]} />
            <meshStandardMaterial color="#FF5252" side={2} />
          </mesh>
        </group>
      )}
    </group>
  )
}
