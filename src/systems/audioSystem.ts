class AudioSystem {
  private ctx: AudioContext | null = null
  private bgmGain: GainNode | null = null
  private bgmPlaying = false

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = 'square',
    volume = 0.15,
    delay = 0,
  ) {
    const ctx = this.getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = frequency
    gain.gain.value = volume
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration + delay)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime + delay)
    osc.stop(ctx.currentTime + duration + delay)
  }

  private playNoise(duration: number, volume = 0.08) {
    const ctx = this.getCtx()
    const bufferSize = ctx.sampleRate * duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2)
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const gain = ctx.createGain()
    gain.gain.value = volume
    source.connect(gain)
    gain.connect(ctx.destination)
    source.start()
  }

  shoot() {
    this.playTone(600, 0.08, 'square', 0.1)
    this.playTone(900, 0.06, 'square', 0.06, 0.03)
  }

  zombieHit() {
    this.playTone(200, 0.12, 'sawtooth', 0.1)
    this.playNoise(0.1, 0.05)
  }

  zombieDeath() {
    this.playTone(180, 0.15, 'sawtooth', 0.12)
    this.playTone(120, 0.2, 'square', 0.08, 0.1)
    this.playNoise(0.15, 0.06)
  }

  sunCollect() {
    this.playTone(880, 0.1, 'sine', 0.12)
    this.playTone(1320, 0.15, 'sine', 0.1, 0.08)
    this.playTone(1760, 0.2, 'sine', 0.08, 0.16)
  }

  plantPlace() {
    this.playTone(300, 0.1, 'triangle', 0.12)
    this.playTone(400, 0.12, 'triangle', 0.1, 0.08)
  }

  gameOver() {
    this.playTone(400, 0.3, 'sawtooth', 0.15)
    this.playTone(300, 0.3, 'sawtooth', 0.12, 0.3)
    this.playTone(200, 0.5, 'sawtooth', 0.1, 0.6)
  }

  victory() {
    this.playTone(523, 0.15, 'sine', 0.12)
    this.playTone(659, 0.15, 'sine', 0.12, 0.15)
    this.playTone(784, 0.15, 'sine', 0.12, 0.3)
    this.playTone(1047, 0.3, 'sine', 0.15, 0.45)
  }

  startBGM() {
    if (this.bgmPlaying) return
    this.bgmPlaying = true
    const ctx = this.getCtx()

    this.bgmGain = ctx.createGain()
    this.bgmGain.gain.value = 0.04
    this.bgmGain.connect(ctx.destination)

    const bpm = 100
    const beatDuration = 60 / bpm

    // simple looping bass line
    const notes = [130.81, 146.83, 164.81, 174.61, 196.0, 174.61, 164.81, 146.83] // C3 D3 E3 F3 G3 F3 E3 D3
    const melody = [261.63, 293.66, 329.63, 349.23, 392.0, 349.23, 329.63, 293.66] // C4 D4 E4 F4 G4 F4 E4 D4

    const playLoop = () => {
      if (!this.bgmPlaying) return

      const now = ctx.currentTime

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.value = freq
        gain.gain.value = 0.04
        gain.gain.exponentialRampToValueAtTime(0.001, now + (i + 1) * beatDuration)
        osc.connect(gain)
        gain.connect(this.bgmGain!)
        osc.start(now + i * beatDuration)
        osc.stop(now + (i + 1) * beatDuration)
      })

      melody.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = i % 2 === 0 ? freq : freq / 2
        gain.gain.value = 0.025
        gain.gain.exponentialRampToValueAtTime(0.001, now + (i + 1) * beatDuration)
        osc.connect(gain)
        gain.connect(this.bgmGain!)
        osc.start(now + i * beatDuration)
        osc.stop(now + (i + 1) * beatDuration)
      })

      setTimeout(playLoop, notes.length * beatDuration * 1000)
    }

    playLoop()
  }

  stopBGM() {
    this.bgmPlaying = false
  }

  startContext() {
    this.getCtx()
  }
}

export const audio = new AudioSystem()
