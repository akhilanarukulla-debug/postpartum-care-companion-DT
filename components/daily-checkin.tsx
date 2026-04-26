"use client"

import { Smile, Meh, Frown, CloudRain, Moon } from "lucide-react"

interface DailyCheckinProps {
  onSelectMood: (mood: string) => void
  currentMood: string | null
}

const quickMoods = [
  { id: "happy", icon: <Smile className="w-5 h-5" />, label: "Happy", color: "#D6F0E8" },
  { id: "okay", icon: <Meh className="w-5 h-5" />, label: "Okay", color: "#D6D4F0" },
  { id: "sad", icon: <Frown className="w-5 h-5" />, label: "Sad", color: "#E8CFCF" },
  { id: "overwhelmed", icon: <CloudRain className="w-5 h-5" />, label: "Overwhelmed", color: "#F0E4D6" },
  { id: "tired", icon: <Moon className="w-5 h-5" />, label: "Tired", color: "#CFE8E6" },
]

export function DailyCheckin({ onSelectMood, currentMood }: DailyCheckinProps) {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-4">
        <h3 className="font-medium text-foreground mb-1">Daily Check-in</h3>
        <p className="text-xs text-muted-foreground">
          {currentMood ? "Mood logged today" : "How are you feeling right now?"}
        </p>
      </div>
      
      <div className="flex justify-between gap-2">
        {quickMoods.map((mood) => {
          const isSelected = currentMood === mood.id
          return (
            <button
              key={mood.id}
              onClick={() => onSelectMood(mood.id)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D6D4F0] ${
                isSelected 
                  ? "ring-2 ring-[#D6D4F0] shadow-sm" 
                  : "hover:bg-muted"
              }`}
              style={{ 
                backgroundColor: isSelected ? mood.color : undefined 
              }}
              aria-label={`Select ${mood.label} mood`}
              aria-pressed={isSelected}
            >
              <div className={`transition-transform duration-150 ${isSelected ? "scale-110" : ""}`}>
                {mood.icon}
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">
                {mood.label}
              </span>
            </button>
          )
        })}
      </div>

      {currentMood && (
        <p className="mt-3 text-center text-xs text-muted-foreground animate-in fade-in duration-200">
          You&apos;re feeling {currentMood} today
        </p>
      )}
    </div>
  )
}
