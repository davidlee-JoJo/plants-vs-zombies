import { useEffect, useRef } from 'react'
import { useGameStore } from '../stores/gameStore'
import { audio } from '../systems/audioSystem'

export function AudioManager() {
  const prevZombieCount = useRef(0)
  const prevPlantCount = useRef(0)
  const prevSunCount = useRef(0)
  const prevProjectileCount = useRef(0)
  const prevGameOver = useRef(false)
  const prevVictory = useRef(false)
  const started = useRef(false)

  useEffect(() => {
    const unsub = useGameStore.subscribe((state) => {
      if (!started.current && state.waves.length > 0) {
        started.current = true
        audio.startContext()
        audio.startBGM()
      }

      // plant placed
      if (state.plants.length > prevPlantCount.current) {
        audio.plantPlace()
      }
      // plant destroyed
      if (state.plants.length < prevPlantCount.current) {
        audio.zombieHit()
      }
      prevPlantCount.current = state.plants.length

      // sun collected
      if (state.suns.length < prevSunCount.current && prevSunCount.current > 0) {
        audio.sunCollect()
      }
      prevSunCount.current = state.suns.length

      // zombie died
      const deadThisFrame = prevZombieCount.current - state.zombies.length
      if (deadThisFrame > 0) {
        audio.zombieDeath()
      }
      prevZombieCount.current = state.zombies.length

      // shoot
      if (state.projectiles.length > prevProjectileCount.current) {
        audio.shoot()
      }
      prevProjectileCount.current = state.projectiles.length

      // game over
      if (state.gameOver && !prevGameOver.current) {
        audio.gameOver()
        audio.stopBGM()
      }
      prevGameOver.current = state.gameOver

      // victory
      if (state.victory && !prevVictory.current) {
        audio.victory()
        audio.stopBGM()
      }
      prevVictory.current = state.victory
    })

    return () => {
      unsub()
      audio.stopBGM()
    }
  }, [])

  return null
}
