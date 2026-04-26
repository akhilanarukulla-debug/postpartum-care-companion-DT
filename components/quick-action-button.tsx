"use client"

import { cn } from "@/lib/utils"

interface QuickActionButtonProps {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  variant?: "pink" | "lavender" | "teal"
}

const variantStyles = {
  pink: "bg-[#E8CFCF] text-[#5A4545] hover:bg-[#E0C5C5]",
  lavender: "bg-[#D6D4F0] text-[#4A4860] hover:bg-[#CCC9E8]",
  teal: "bg-[#CFE8E6] text-[#3A5A58] hover:bg-[#C5E0DE]",
}

export function QuickActionButton({ icon, label, onClick, variant = "pink" }: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-200",
        "font-medium text-sm md:text-base",
        "active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D6D4F0]",
        variantStyles[variant]
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
