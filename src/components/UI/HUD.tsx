import { useGameStore } from '../../stores/gameStore'

export function HUD() {
  const sun = useGameStore((s) => s.sun)
  const currentWave = useGameStore((s) => s.currentWave)
  const waves = useGameStore((s) => s.waves)
  const gameOver = useGameStore((s) => s.gameOver)
  const victory = useGameStore((s) => s.victory)
  const startWave = useGameStore((s) => s.startWave)

  return (
    <div style={{ position: 'relative', zIndex: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '4px 16px', background: '#222', color: '#fff' }}>
        <span style={{ fontSize: 18 }}>☀</span>
        <span style={{ fontSize: 16, fontWeight: 'bold' }}>{sun}</span>
        <span style={{ marginLeft: 'auto', fontSize: 14 }}>
          波次 {currentWave + 1}/{waves.length || '?'}
        </span>
        {waves.length === 0 && (
          <button onClick={startWave} style={{ padding: '4px 12px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            開始遊戲
          </button>
        )}
      </div>
      {gameOver && (
        <div style={{ position: 'absolute', top: '50vh', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.8)', padding: 32, borderRadius: 12, textAlign: 'center', color: '#fff' }}>
          <h2 style={{ color: '#FF5252', margin: 0 }}>遊戲結束</h2>
          <p>殭屍入侵了你的房子！</p>
          <button onClick={() => { useGameStore.getState().reset(); window.location.reload() }} style={{ padding: '8px 24px', background: '#FF5252', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', marginTop: 8 }}>
            重新開始
          </button>
        </div>
      )}
      {victory && (
        <div style={{ position: 'absolute', top: '50vh', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.8)', padding: 32, borderRadius: 12, textAlign: 'center', color: '#fff' }}>
          <h2 style={{ color: '#4CAF50', margin: 0 }}>勝利！</h2>
          <p>你成功抵擋了所有殭屍的攻擊！</p>
          <button onClick={() => { useGameStore.getState().reset(); window.location.reload() }} style={{ padding: '8px 24px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', marginTop: 8 }}>
            返回主選單
          </button>
        </div>
      )}
    </div>
  )
}
