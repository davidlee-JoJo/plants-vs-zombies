import { useEffect, useRef } from 'react'
import { GameCanvas } from './components/GameCanvas'
import { PlantSelector } from './components/UI/PlantSelector'
import { HUD } from './components/UI/HUD'
import { StartPage } from './components/UI/StartPage'
import { AudioManager } from './components/AudioManager'
import { useGameStore } from './stores/gameStore'

function GameLayout() {
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: '#111' }}>
      <AudioManager />
      <HUD />
      <div style={{ flex: 1, position: 'relative' }}>
        <GameCanvas />
      </div>
      <PlantSelector />
    </div>
  )
}

export default function App() {
  const tick = useGameStore((s) => s.tick)
  const waves = useGameStore((s) => s.waves)
  const gameOver = useGameStore((s) => s.gameOver)
  const victory = useGameStore((s) => s.victory)
  const lastTime = useRef(0)
  const showGame = waves.length > 0

  useEffect(() => {
    lastTime.current = performance.now()
    let running = true

    const loop = (now: number) => {
      if (!running) return
      const dt = Math.min((now - lastTime.current) / 1000, 0.05)
      lastTime.current = now
      tick(dt)
      requestAnimationFrame(loop)
    }

    requestAnimationFrame(loop)
    return () => { running = false }
  }, [tick])

  if (!showGame && !gameOver && !victory) {
    return <StartPage />
  }

  return <GameLayout />
}
