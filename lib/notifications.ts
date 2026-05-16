// Sound notification utilities for reminders and alerts
let audioContext: AudioContext | null = null
let soundEnabled = true

// Get or create audio context
function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioContext
}

// Load sound enabled state from localStorage
export function initSoundSettings() {
  if (typeof window !== "undefined") {
    soundEnabled = localStorage.getItem("soundEnabled") !== "false"
  }
}

// Toggle sound on/off
export function toggleSound(enabled: boolean) {
  soundEnabled = enabled
  if (typeof window !== "undefined") {
    localStorage.setItem("soundEnabled", String(enabled))
  }
}

// Get sound enabled state
export function isSoundEnabled() {
  return soundEnabled
}

// Play a bell/chime sound (reminder notification)
export function playReminderSound() {
  if (!soundEnabled || typeof window === "undefined") return

  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    // Create oscillator for bell sound
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    // Bell sound frequencies
    const notes = [523.25, 659.25, 523.25] // C5, E5, C5
    let startTime = now

    notes.forEach((freq, index) => {
      const noteStart = startTime + index * 0.2
      const noteEnd = noteStart + 0.15

      // Use a second oscillator for layering
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()

      osc2.frequency.value = freq * 2 // Harmonics
      osc2.type = "sine"
      osc2.connect(gain2)
      gain2.connect(ctx.destination)

      gain2.gain.setValueAtTime(0.1, noteStart)
      gain2.gain.exponentialRampToValueAtTime(0.01, noteEnd)

      osc2.start(noteStart)
      osc2.stop(noteEnd)
    })

    // Main tone
    osc.frequency.setValueAtTime(523.25, now)
    osc.type = "sine"
    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6)

    osc.start(now)
    osc.stop(now + 0.6)
  } catch (error) {
    console.error("Failed to play reminder sound:", error)
  }
}

// Play an alert sound (water intake, milestone)
export function playAlertSound() {
  if (!soundEnabled || typeof window === "undefined") return

  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    // Create a simple beep
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.frequency.value = 800 // Hz
    osc.type = "sine"

    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)

    osc.start(now)
    osc.stop(now + 0.2)
  } catch (error) {
    console.error("Failed to play alert sound:", error)
  }
}

// Play notification sound (generic)
export function playNotificationSound() {
  if (!soundEnabled || typeof window === "undefined") return

  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    // Create two-tone notification
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gain = ctx.createGain()

    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(ctx.destination)

    // First tone
    osc1.frequency.value = 440 // A4
    osc1.type = "sine"
    osc1.start(now)
    osc1.stop(now + 0.15)

    // Second tone (higher)
    osc2.frequency.value = 550 // C#5
    osc2.type = "sine"
    osc2.start(now + 0.15)
    osc2.stop(now + 0.3)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
  } catch (error) {
    console.error("Failed to play notification sound:", error)
  }
}

// Play success sound (mood logged, streak achieved)
export function playSuccessSound() {
  if (!soundEnabled || typeof window === "undefined") return

  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    // Ascending tones for success
    const notes = [523.25, 659.25, 783.99] // C5, E5, G5
    let time = now

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.frequency.value = freq
      osc.type = "sine"

      const start = time + index * 0.1
      const end = start + 0.15

      gain.gain.setValueAtTime(0.2, start)
      gain.gain.exponentialRampToValueAtTime(0.01, end)

      osc.start(start)
      osc.stop(end)
    })
  } catch (error) {
    console.error("Failed to play success sound:", error)
  }
}
