import { Canvas } from '@react-three/fiber'
import { Scene } from './Scene'
import { Board } from './Board'
import { Peashooter } from './plants/Peashooter'
import { Sunflower } from './plants/Sunflower'
import { WallNut } from './plants/WallNut'
import { SnowPea } from './plants/SnowPea'
import { BasicZombie } from './zombies/BasicZombie'
import { Projectile3D } from './Projectile'
import { Sun3D } from './Sun'
import { useGameStore } from '../stores/gameStore'

const plantComponents = {
  peashooter: Peashooter,
  sunflower: Sunflower,
  wallnut: WallNut,
  snowpea: SnowPea,
} as const

export function GameCanvas() {
  const plants = useGameStore((s) => s.plants)
  const zombies = useGameStore((s) => s.zombies)
  const projectiles = useGameStore((s) => s.projectiles)
  const suns = useGameStore((s) => s.suns)

  return (
    <Canvas
      camera={{ position: [6, 7, 8.5], fov: 45 }}
      onCreated={({ camera }) => {
        camera.lookAt(6, 0, 0)
      }}
      shadows
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 12, 5]} intensity={1.2} castShadow />
      <hemisphereLight args={['#87CEEB', '#3d6b30', 0.4]} />
      <Scene />
      <Board />
      {plants.map((p) => {
        const Comp = plantComponents[p.type]
        return Comp ? <Comp key={p.id} plant={p} /> : null
      })}
      {zombies.map((z) => (
        <BasicZombie key={z.id} zombie={z} />
      ))}
      {projectiles.map((p) => (
        <Projectile3D key={p.id} projectile={p} />
      ))}
      {suns.map((s) => (
        <Sun3D key={s.id} sun={s} />
      ))}
    </Canvas>
  )
}
