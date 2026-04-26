"use client"

import { useState } from "react"
import { MoodCard } from "@/components/mood-card"
import { Smile, Meh, Frown, CloudRain, Moon } from "lucide-react"

interface MoodScreenProps {
  onSaveMood: (mood: string, note: string) => void
  currentMood: string | null
}

const moods = [
  { id: "happy", label: "Happy", icon: <Smile className="w-7 h-7" />, color: "mint" as const },
  { id: "okay", label: "Okay", icon: <Meh className="w-7 h-7" />, color: "lavender" as const },
  { id: "sad", label: "Sad", icon: <Frown className="w-7 h-7" />, color: "pink" as const },
  { id: "overwhelmed", label: "Overwhelmed", icon: <CloudRain className="w-7 h-7" />, color: "peach" as const },
  { id: "tired", label: "Tired", icon: <Moon className="w-7 h-7" />, color: "teal" as const },
]

export function MoodScreen({ onSaveMood, currentMood }: MoodScreenProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(currentMood)
  const [note, setNote] = useState("")
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    if (selectedMood) {
      onSaveMood(selectedMood, note)
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
    }
  }

  return (
    <div className="min-h-screen pb-24 px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <header className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          How are you feeling?
        </h1>
        <p className="text-muted-foreground">
          Take a moment to check in with yourself
        </p>
      </header>

      {/* Mood Selection */}
      <section className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <div className="flex flex-wrap justify-center gap-4">
          {moods.map((mood) => (
            <MoodCard
              key={mood.id}
              mood={mood.label}
              icon={mood.icon}
              color={mood.color}
              isSelected={selectedMood === mood.id}
              onClick={() => setSelectedMood(mood.id)}
            />
          ))}
        </div>
      </section>

      {/* Optional Note */}
      <section className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <label htmlFor="mood-note" className="block text-sm font-medium text-muted-foreground mb-3">
          Add a note (optional)
        </label>
        <textarea
          id="mood-note"
          placeholder="How are you really feeling? Any thoughts you&apos;d like to capture..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-4 bg-input rounded-2xl text-foreground placeholder:text-muted-foreground resize-none h-32 focus:outline-none focus:ring-2 focus:ring-[#D6D4F0] transition-all"
        />
      </section>

      {/* Save Button */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <button
          onClick={handleSave}
          disabled={!selectedMood}
          className="w-full py-4 bg-[#E8CFCF] text-[#5A4545] rounded-xl font-medium hover:bg-[#E0C5C5] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D6D4F0]"
        >
          {isSaved ? "Saved! ✓" : "Save Mood"}
        </button>
      </div>

      {/* Supportive Message */}
      {selectedMood && (
        <p className="mt-6 text-center text-sm text-muted-foreground animate-in fade-in duration-300">
          {selectedMood === "happy" && "That&apos;s wonderful to hear! 🌟"}
          {selectedMood === "okay" && "It&apos;s okay to feel okay. You&apos;re doing great."}
          {selectedMood === "sad" && "It&apos;s okay to feel this way. You&apos;re not alone. 💜"}
          {selectedMood === "overwhelmed" && "Take a deep breath. One step at a time. 🌸"}
          {selectedMood === "tired" && "Rest is important. Be gentle with yourself. 🌙"}
        </p>
      )}
    </div>
  )
}
