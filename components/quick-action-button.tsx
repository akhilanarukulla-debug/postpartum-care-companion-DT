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
        "flex items-center gap-3 px-5 py-4 rounded-xl",
        "font-medium text-sm md:text-base",
        "transition-all duration-150 ease-out",
        "active:scale-95 active:shadow-sm",
        "hover:-translate-y-0.5 hover:shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D6D4F0]",
        variantStyles[variant]
      )}
    >
      <span className="transition-transform duration-150 group-active:scale-90">{icon}</span>
      <span>{label}</span>
    </button>
  )
}
