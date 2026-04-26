"use client"

import { Sparkles, Heart, Droplets, TrendingUp } from "lucide-react"

interface InsightCardProps {
  type: "mood" | "water" | "streak" | "general"
  message: string
}

const iconMap = {
  mood: <Heart className="w-4 h-4" />,
  water: <Droplets className="w-4 h-4" />,
  streak: <TrendingUp className="w-4 h-4" />,
  general: <Sparkles className="w-4 h-4" />,
}

const colorMap = {
  mood: {
    bg: "bg-[#D6D4F0]/20",
    iconBg: "bg-[#D6D4F0]",
    iconColor: "text-[#4A4860]",
    border: "border-[#D6D4F0]/30",
  },
  water: {
    bg: "bg-[#CFE8E6]/20",
    iconBg: "bg-[#CFE8E6]",
    iconColor: "text-[#3A5A58]",
    border: "border-[#CFE8E6]/30",
  },
  streak: {
    bg: "bg-[#F0E4D6]/20",
    iconBg: "bg-[#F0E4D6]",
    iconColor: "text-[#6A5A4A]",
    border: "border-[#F0E4D6]/30",
  },
  general: {
    bg: "bg-[#E8CFCF]/20",
    iconBg: "bg-[#E8CFCF]",
    iconColor: "text-[#5A4545]",
    border: "border-[#E8CFCF]/30",
  },
}

export function InsightCard({ type, message }: InsightCardProps) {
  const colors = colorMap[type]
  const icon = iconMap[type]

  return (
    <div 
      className={`${colors.bg} ${colors.border} border rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      <div className={`${colors.iconBg} ${colors.iconColor} w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <p className="text-sm text-foreground leading-relaxed text-pretty">{message}</p>
    </div>
  )
}
