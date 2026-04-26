"use client"

import { Flame } from "lucide-react"

interface StreakBadgeProps {
  count: number
  type: "mood" | "water"
  size?: "sm" | "md"
}

export function StreakBadge({ count, type, size = "md" }: StreakBadgeProps) {
  if (count < 1) return null

  const label = type === "mood" ? "mood logging" : "hydration"
  
  const sizeStyles = {
    sm: {
      container: "px-3 py-1.5 gap-1.5",
      icon: "w-4 h-4",
      text: "text-xs",
    },
    md: {
      container: "px-4 py-2 gap-2",
      icon: "w-5 h-5",
      text: "text-sm",
    },
  }

  const styles = sizeStyles[size]

  return (
    <div 
      className={`inline-flex items-center ${styles.container} bg-gradient-to-r from-[#F0E4D6] to-[#F5EDE0] rounded-full animate-in fade-in zoom-in-95 duration-300`}
    >
      <div className="relative">
        <Flame className={`${styles.icon} text-[#D4A574]`} />
        {count >= 7 && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#E8CFCF] rounded-full animate-pulse" />
        )}
      </div>
      <span className={`${styles.text} font-medium text-[#6A5A4A]`}>
        {count} day{count !== 1 ? "s" : ""} {label} streak
      </span>
    </div>
  )
}
