import { useGameStore } from '../../stores/gameStore'
import { PLANT_CONFIG, ZOMBIE_CONFIG } from '../../constants'
import type { PlantType } from '../../types'

const plants: PlantType[] = ['sunflower', 'peashooter', 'wallnut', 'snowpea']

const plantEmoji: Record<string, string> = {
  sunflower: '🌻',
  peashooter: '🌱',
  wallnut: '🥜',
  snowpea: '❄️',
}

export function StartPage() {
  const startWave = useGameStore((s) => s.startWave)
  const reset = useGameStore((s) => s.reset)

  const handleStart = () => {
    reset()
    setTimeout(() => startWave(), 50)
  }

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', color: '#fff', fontFamily: 'Segoe UI, sans-serif',
      overflow: 'auto', padding: '40px 20px',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 48, fontWeight: 800, margin: 0, letterSpacing: 2 }}>
          <span style={{ color: '#4CAF50' }}>植物</span>
          <span style={{ color: '#fff' }}>對戰</span>
          <span style={{ color: '#FF5252' }}>殭屍</span>
        </h1>
        <p style={{ fontSize: 16, color: '#aaa', marginTop: 8 }}>Plants vs. Zombies - 3D Web Edition</p>
      </div>

      <div style={{
        maxWidth: 640, width: '100%',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 16, padding: 24,
        marginBottom: 24,
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 12px', color: '#4CAF50' }}>遊戲簡介</h2>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#ccc', margin: 0 }}>
          殭屍大軍來襲！你需要種植各種植物來保衛你的房子。
          每種植物都有獨特的能力，合理安排防線，
          抵擋一波又一波的殭屍攻勢！
        </p>
      </div>

      <div style={{
        maxWidth: 640, width: '100%',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 16, padding: 24,
        marginBottom: 24,
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 12px', color: '#FFD700' }}>遊玩辦法</h2>
        <ul style={{ fontSize: 14, lineHeight: 2.2, color: '#ccc', margin: 0, paddingLeft: 20 }}>
          <li>點擊下方植物按鈕選擇要種植的植物（再次點擊取消選擇）</li>
          <li>點擊棋盤上的格子來種植選中的植物</li>
          <li>種植植物需要消耗 <strong style={{ color: '#FFD700' }}>陽光 ☀</strong></li>
          <li><strong style={{ color: '#FFD700' }}>向日葵 🌻</strong> 會定期產生陽光</li>
          <li><strong style={{ color: '#4CAF50' }}>豌豆射手 🌱</strong> 自動攻擊前方的殭屍</li>
          <li><strong style={{ color: '#8B4513' }}>堅果牆 🥜</strong> 高血量阻擋殭屍前進</li>
          <li><strong style={{ color: '#00BCD4' }}>寒冰射手 ❄️</strong> 射擊冰凍子彈減速殭屍</li>
          <li>點擊場景中掉落的 <strong style={{ color: '#FFD700' }}>陽光</strong> 來收集</li>
          <li>按下「<strong style={{ color: '#4CAF50' }}>開始遊戲</strong>」迎接殭屍攻勢！</li>
        </ul>
      </div>

      <div style={{
        maxWidth: 640, width: '100%',
        display: 'flex', gap: 12, flexWrap: 'wrap',
        justifyContent: 'center', marginBottom: 24,
      }}>
        {plants.map((type) => {
          const cfg = PLANT_CONFIG[type]
          return (
            <div key={type} style={{
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 12, padding: '12px 16px',
              textAlign: 'center', minWidth: 100,
            }}>
              <div style={{ fontSize: 28 }}>{plantEmoji[type]}</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{cfg.label}</div>
              <div style={{ fontSize: 11, color: '#FFD700' }}>☀ {cfg.cost}</div>
              <div style={{ fontSize: 11, color: '#aaa' }}>
                {type === 'sunflower' ? '❤️ 100' : type === 'wallnut' ? '❤️ 400' : '❤️ 100'}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{
        maxWidth: 640, width: '100%',
        display: 'flex', gap: 12, flexWrap: 'wrap',
        justifyContent: 'center', marginBottom: 32,
      }}>
        {(['basic', 'cone', 'bucket'] as const).map((type) => {
          const cfg = ZOMBIE_CONFIG[type]
          return (
            <div key={type} style={{
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 12, padding: '12px 16px',
              textAlign: 'center', minWidth: 100,
            }}>
              <div style={{ fontSize: 28 }}>🧟</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{cfg.label}</div>
              <div style={{ fontSize: 11, color: '#FF5252' }}>❤️ {cfg.hp}</div>
              <div style={{ fontSize: 11, color: '#aaa' }}>💨 {cfg.speed.toFixed(2)}</div>
            </div>
          )
        })}
      </div>

      <button
        onClick={handleStart}
        style={{
          padding: '14px 48px', fontSize: 20, fontWeight: 700,
          background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
          color: '#fff', border: 'none', borderRadius: 50,
          cursor: 'pointer', boxShadow: '0 4px 20px rgba(76,175,80,0.4)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)'
          e.currentTarget.style.boxShadow = '0 6px 30px rgba(76,175,80,0.6)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(76,175,80,0.4)'
        }}
      >
        🎮 開始遊戲
      </button>

      <p style={{ fontSize: 12, color: '#666', marginTop: 24 }}>
        Powered by React Three Fiber • 3D Models by Quaternius (CC0)
      </p>
    </div>
  )
}
