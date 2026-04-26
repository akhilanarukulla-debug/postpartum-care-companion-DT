"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Smile, Meh, Frown, CloudRain, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface MoodHistoryEntry {
  id: string
  mood: string
  note?: string
  timestamp: Date
}

interface MoodHistoryItemProps {
  entry: MoodHistoryEntry
}

const moodConfig: Record<string, { icon: React.ReactNode; color: string; bgColor: string }> = {
  happy: {
    icon: <Smile className="w-5 h-5" />,
    color: "text-[#3A5A58]",
    bgColor: "bg-[#CFE8D6]",
  },
  okay: {
    icon: <Meh className="w-5 h-5" />,
    color: "text-[#4A4860]",
    bgColor: "bg-[#D6D4F0]",
  },
  sad: {
    icon: <Frown className="w-5 h-5" />,
    color: "text-[#5A4545]",
    bgColor: "bg-[#E8CFCF]",
  },
  overwhelmed: {
    icon: <CloudRain className="w-5 h-5" />,
    color: "text-[#6B5A45]",
    bgColor: "bg-[#F0E4D6]",
  },
  tired: {
    icon: <Moon className="w-5 h-5" />,
    color: "text-[#3A5A58]",
    bgColor: "bg-[#CFE8E6]",
  },
}

function formatDate(date: Date): string {
  const now = new Date()
  const entryDate = new Date(date)
  
  // Check if it's today
  if (entryDate.toDateString() === now.toDateString()) {
    return `Today at ${entryDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
  }
  
  // Check if it's yesterday
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (entryDate.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${entryDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
  }
  
  // Otherwise, show full date
  return entryDate.toLocaleDateString([], { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

export function MoodHistoryItem({ entry }: MoodHistoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const config = moodConfig[entry.mood] || moodConfig.okay
  const hasNote = entry.note && entry.note.trim().length > 0
  const notePreview = hasNote && entry.note!.length > 60 
    ? entry.note!.slice(0, 60) + "..." 
    : entry.note

  return (
    <div
      className={cn(
        "bg-card rounded-2xl p-4 shadow-sm transition-all duration-200",
        "hover:shadow-md",
        hasNote && "cursor-pointer"
      )}
      onClick={() => hasNote && setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start gap-3">
        {/* Mood Icon */}
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
          config.bgColor,
          config.color
        )}>
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="font-medium text-foreground capitalize">{entry.mood}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(entry.timestamp)}
            </p>
          </div>

          {/* Note Preview or Full */}
          {hasNote && (
            <div className="mt-2">
              {isExpanded ? (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap animate-in fade-in duration-200">
                  {entry.note}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {notePreview}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Expand Indicator */}
        {hasNote && (
          <button 
            className="p-1 text-muted-foreground hover:text-foreground transition-colors duration-150"
            aria-label={isExpanded ? "Collapse note" : "Expand note"}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  )
}
