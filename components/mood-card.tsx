"use client"

import { cn } from "@/lib/utils"

interface MoodCardProps {
  mood: string
  icon: React.ReactNode
  isSelected?: boolean
  onClick?: () => void
  color: "pink" | "lavender" | "teal" | "peach" | "mint"
}

const colorMap = {
  pink: "bg-[#E8CFCF] hover:bg-[#E0C5C5]",
  lavender: "bg-[#D6D4F0] hover:bg-[#CCC9E8]",
  teal: "bg-[#CFE8E6] hover:bg-[#C5E0DE]",
  peach: "bg-[#F0E4D6] hover:bg-[#E8DCC9]",
  mint: "bg-[#D6F0E8] hover:bg-[#CCE8E0]",
}

export function MoodCard({ mood, icon, isSelected, onClick, color }: MoodCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl",
        "w-20 h-20 md:w-24 md:h-24",
        "transition-all duration-150 ease-out",
        "active:scale-90",
        colorMap[color],
        isSelected && "ring-2 ring-offset-2 ring-[#5A4545] scale-105 shadow-lg",
        !isSelected && "hover:scale-102 hover:shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D6D4F0]"
      )}
      aria-pressed={isSelected}
      aria-label={`Select ${mood} mood`}
    >
      <span className={cn(
        "text-2xl md:text-3xl transition-transform duration-150",
        isSelected && "scale-110"
      )}>
        {icon}
      </span>
      <span className="text-xs font-medium text-foreground capitalize">{mood}</span>
    </button>
  )
}
