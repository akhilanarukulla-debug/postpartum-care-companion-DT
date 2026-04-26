"use client"

import { ReactNode } from "react"

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  variant?: "pink" | "lavender" | "teal" | "peach"
}

const variantStyles = {
  pink: {
    iconBg: "bg-[#E8CFCF]/30",
    iconColor: "text-[#5A4545]",
    buttonBg: "bg-[#E8CFCF] hover:bg-[#E0C5C5]",
    buttonText: "text-[#5A4545]",
  },
  lavender: {
    iconBg: "bg-[#D6D4F0]/30",
    iconColor: "text-[#4A4860]",
    buttonBg: "bg-[#D6D4F0] hover:bg-[#CCC9E8]",
    buttonText: "text-[#4A4860]",
  },
  teal: {
    iconBg: "bg-[#CFE8E6]/30",
    iconColor: "text-[#3A5A58]",
    buttonBg: "bg-[#CFE8E6] hover:bg-[#C5E0DE]",
    buttonText: "text-[#3A5A58]",
  },
  peach: {
    iconBg: "bg-[#F0E4D6]/30",
    iconColor: "text-[#6A5A4A]",
    buttonBg: "bg-[#F0E4D6] hover:bg-[#E8DCC8]",
    buttonText: "text-[#6A5A4A]",
  },
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action,
  variant = "lavender" 
}: EmptyStateProps) {
  const styles = variantStyles[variant]

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className={`w-16 h-16 ${styles.iconBg} rounded-2xl flex items-center justify-center mb-4`}>
        <div className={styles.iconColor}>{icon}</div>
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2 text-balance">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-[250px] text-pretty">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className={`px-6 py-3 ${styles.buttonBg} ${styles.buttonText} rounded-xl font-medium active:scale-95 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D6D4F0]`}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
