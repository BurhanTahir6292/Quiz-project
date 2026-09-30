// Web Audio API synthesizers for crisp, zero-dependency sound effects
class SoundController {
  constructor() {
    this.ctx = null
    this.enabled = true
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  toggle() {
    this.enabled = !this.enabled
    return this.enabled
  }

  playTone(freq, duration = 0.15, type = 'sine', gainVal = 0.1) {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = type
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime)

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + duration)
    } catch {
      // Audio autoplay policy fallback
    }
  }

  playClick() {
    this.playTone(600, 0.06, 'sine', 0.05)
  }

  playCorrect() {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return
      const now = this.ctx.currentTime
      const notes = [523.25, 659.25, 783.99] // C5, E5, G5 major triad

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.frequency.setValueAtTime(freq, now + idx * 0.08)
        gain.gain.setValueAtTime(0.1, now + idx * 0.08)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.2)
        osc.connect(gain)
        gain.connect(this.ctx.destination)
        osc.start(now + idx * 0.08)
        osc.stop(now + idx * 0.08 + 0.2)
      })
    } catch {
      // Fallback
    }
  }

  playIncorrect() {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return
      const now = this.ctx.currentTime
      const notes = [311.13, 277.18] // Eb4 to C#4 sad chime

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.frequency.setValueAtTime(freq, now + idx * 0.12)
        gain.gain.setValueAtTime(0.1, now + idx * 0.12)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.25)
        osc.connect(gain)
        gain.connect(this.ctx.destination)
        osc.start(now + idx * 0.12)
        osc.stop(now + idx * 0.12 + 0.25)
      })
    } catch {
      // Fallback
    }
  }

  playFanfare() {
    if (!this.enabled) return
    try {
      this.init()
      if (!this.ctx) return
      const now = this.ctx.currentTime
      const melody = [523.25, 659.25, 783.99, 1046.50]

      melody.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.frequency.setValueAtTime(freq, now + idx * 0.1)
        gain.gain.setValueAtTime(0.12, now + idx * 0.1)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 0.4)
        osc.connect(gain)
        gain.connect(this.ctx.destination)
        osc.start(now + idx * 0.1)
        osc.stop(now + idx * 0.1 + 0.4)
      })
    } catch {
      // Fallback
    }
  }

  playTick() {
    this.playTone(880, 0.04, 'triangle', 0.04)
  }
}

export const sound = new SoundController()
