"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReminderCardProps {
  title: string
  time: string
  type: "medication" | "self-care" | "appointment" | "hydration"
  isCompleted?: boolean
  onToggle?: () => void
}

const typeColors = {
  medication: "bg-[#E8CFCF]",
  "self-care": "bg-[#D6D4F0]",
  appointment: "bg-[#CFE8E6]",
  hydration: "bg-[#D6F0E8]",
}

const typeLabels = {
  medication: "Medication",
  "self-care": "Self-care",
  appointment: "Appointment",
  hydration: "Hydration",
}

export function ReminderCard({ title, time, type, isCompleted, onToggle }: ReminderCardProps) {
  return (
    <div className={cn(
      "flex items-center justify-between p-4 bg-card rounded-2xl shadow-sm transition-all duration-200",
      isCompleted && "opacity-60"
    )}>
      <div className="flex flex-col gap-1">
        <h4 className={cn(
          "font-medium text-card-foreground",
          isCompleted && "line-through"
        )}>
          {title}
        </h4>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{time}</span>
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full font-medium",
            typeColors[type],
            "text-foreground"
          )}>
            {typeLabels[type]}
          </span>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
          "border-2",
          isCompleted
            ? "bg-[#CFE8E6] border-[#CFE8E6]"
            : "border-border hover:border-[#D6D4F0]",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D6D4F0]"
        )}
        aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
      >
        {isCompleted && <Check className="w-4 h-4 text-[#3A5A58]" />}
      </button>
    </div>
  )
}
