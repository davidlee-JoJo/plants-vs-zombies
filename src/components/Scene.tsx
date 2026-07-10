import { useMemo } from 'react'

export function Scene() {
  const grassPositions = useMemo(() => {
    const pos: [number, number, number][] = []
    for (let i = 0; i < 200; i++) {
      pos.push([
        Math.random() * 28 - 2,
        -0.02,
        Math.random() * 10 - 5,
      ])
    }
    return pos
  }, [])

  return (
    <group>
      {/* main lawn */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6, -0.04, 0]} receiveShadow>
        <planeGeometry args={[28, 10]} />
        <meshStandardMaterial color="#4A7C3F" />
      </mesh>

      {/* checkerboard lawn */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6, -0.03, 0]} receiveShadow>
        <planeGeometry args={[27, 9]} />
        <meshStandardMaterial color="#5A8F3C" transparent opacity={0.4} />
      </mesh>

      {/* house */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.5, -0.02, 0]} receiveShadow>
        <planeGeometry args={[4, 10]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>
      <mesh position={[-1.5, 1.5, 0]}>
        <boxGeometry args={[4, 3, 0.1]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>
      {/* door */}
      <mesh position={[-1.5, 0.7, 0.06]}>
        <planeGeometry args={[0.6, 1]} />
        <meshStandardMaterial color="#4E342E" />
      </mesh>
      {/* windows */}
      <mesh position={[-2.2, 1.5, 0.06]}>
        <planeGeometry args={[0.4, 0.4]} />
        <meshStandardMaterial color="#FFECB3" emissive="#FFECB3" emissiveIntensity={0.1} />
      </mesh>
      <mesh position={[-0.8, 1.5, 0.06]}>
        <planeGeometry args={[0.4, 0.4]} />
        <meshStandardMaterial color="#FFECB3" emissive="#FFECB3" emissiveIntensity={0.1} />
      </mesh>

      {/* grass tufts */}
      {grassPositions.map((pos, i) => (
        <mesh key={i} position={pos} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.08, 0.15]} />
          <meshStandardMaterial color="#5A8F3C" transparent opacity={0.3} side={2} />
        </mesh>
      ))}

      {/* fence on the right edge */}
      {[-2, -1, 0, 1, 2].map((i) => (
        <group key={`fence-${i}`} position={[14.5, 0, i * 1.5]}>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.1, 1, 0.08]} />
            <meshStandardMaterial color="#8D6E63" />
          </mesh>
          <mesh position={[0.15, 0.35, 0]}>
            <boxGeometry args={[0.3, 0.05, 0.06]} />
            <meshStandardMaterial color="#A1887F" />
          </mesh>
          <mesh position={[0.15, 0.65, 0]}>
            <boxGeometry args={[0.3, 0.05, 0.06]} />
            <meshStandardMaterial color="#A1887F" />
          </mesh>
        </group>
      ))}
    </group>
  )
}
