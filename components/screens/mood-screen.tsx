"use client"

import { useState } from "react"
import { MoodCard } from "@/components/mood-card"
import { StreakBadge } from "@/components/streak-badge"
import { InsightCard } from "@/components/insight-card"
import { SectionHeader } from "@/components/section-header"
import { MoodHistory } from "@/components/mood-history"
import type { MoodHistoryEntry } from "@/components/mood-history-item"
import { Smile, Meh, Frown, CloudRain, Moon } from "lucide-react"

interface MoodScreenProps {
  onSaveMood: (mood: string, note?: string) => void
  currentMood: string | null
  streak?: number
  moodHistory: MoodHistoryEntry[]
}

const moods = [
  { id: "happy", label: "Happy", icon: <Smile className="w-7 h-7" />, color: "mint" as const },
  { id: "okay", label: "Okay", icon: <Meh className="w-7 h-7" />, color: "lavender" as const },
  { id: "sad", label: "Sad", icon: <Frown className="w-7 h-7" />, color: "pink" as const },
  { id: "overwhelmed", label: "Overwhelmed", icon: <CloudRain className="w-7 h-7" />, color: "peach" as const },
  { id: "tired", label: "Tired", icon: <Moon className="w-7 h-7" />, color: "teal" as const },
]

const supportiveMessages: Record<string, string> = {
  happy: "That's wonderful to hear! Cherish this feeling.",
  okay: "It's okay to feel okay. You're doing great.",
  sad: "It's okay to feel this way. You're not alone.",
  overwhelmed: "Take a deep breath. One step at a time.",
  tired: "Rest is important. Be gentle with yourself.",
}

export function MoodScreen({ onSaveMood, currentMood, streak = 0, moodHistory }: MoodScreenProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(currentMood)
  const [note, setNote] = useState("")
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showAllHistory, setShowAllHistory] = useState(false)

  const handleSave = () => {
    if (selectedMood) {
      setIsSaving(true)
      setTimeout(() => {
        onSaveMood(selectedMood, note)
        setIsSaved(true)
        setIsSaving(false)
        setNote("") // Clear note after saving
        setTimeout(() => setIsSaved(false), 2000)
      }, 150)
    }
  }

  const handleSelectMood = (moodId: string) => {
    setSelectedMood(moodId)
    setIsSaved(false)
  }

  return (
    <div className="min-h-screen pb-24 px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <header className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl font-semibold text-foreground mb-1">
          How are you feeling?
        </h1>
        <p className="text-muted-foreground">
          Take a moment to check in with yourself
        </p>
        
        {/* Streak Badge */}
        {streak > 0 && (
          <div className="mt-4">
            <StreakBadge count={streak} type="mood" />
          </div>
        )}
      </header>

      {/* Mood Selection */}
      <section className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <SectionHeader title="Select Your Mood" subtitle="How are you really feeling?" />
        <div className="flex flex-wrap justify-center gap-4">
          {moods.map((mood, index) => (
            <div 
              key={mood.id}
              className={`stagger-${index + 1}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <MoodCard
                mood={mood.label}
                icon={mood.icon}
                color={mood.color}
                isSelected={selectedMood === mood.id}
                onClick={() => handleSelectMood(mood.id)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Supportive Message */}
      {selectedMood && (
        <section className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <InsightCard 
            type="mood" 
            message={supportiveMessages[selectedMood] || "Thank you for checking in with yourself."} 
          />
        </section>
      )}

      {/* Optional Note */}
      <section className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <SectionHeader title="Add a Note" subtitle="Optional - capture your thoughts" />
        <textarea
          id="mood-note"
          placeholder="How are you really feeling? Any thoughts you'd like to capture..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-4 bg-input rounded-2xl text-foreground placeholder:text-muted-foreground resize-none h-32 focus:outline-none focus:ring-2 focus:ring-[#D6D4F0] transition-all duration-200"
        />
        <p className="text-xs text-muted-foreground mt-2 text-right">
          {note.length > 0 ? `${note.length} characters` : "Your notes are private and just for you"}
        </p>
      </section>

      {/* Save Button */}
      <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <button
          onClick={handleSave}
          disabled={!selectedMood || isSaving}
          className={`w-full py-4 bg-[#E8CFCF] text-[#5A4545] rounded-xl font-medium hover:bg-[#E0C5C5] tap-scale transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D6D4F0] ${isSaving ? "scale-95" : ""}`}
        >
          {isSaved ? "Saved!" : isSaving ? "Saving..." : "Save Mood"}
        </button>
      </div>

      {/* Mood History Section */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
        <MoodHistory 
          entries={moodHistory}
          maxItems={showAllHistory ? undefined : 5}
          showViewAll={!showAllHistory && moodHistory.length > 5}
          onViewAll={() => setShowAllHistory(true)}
        />
      </section>
    </div>
  )
}
