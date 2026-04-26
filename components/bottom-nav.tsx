"use client"

import { Home, Smile, Droplets, Bell, BarChart3, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: "dashboard", icon: Home, label: "Home" },
  { id: "mood", icon: Smile, label: "Mood" },
  { id: "water", icon: Droplets, label: "Water" },
  { id: "reminders", icon: Bell, label: "Reminders" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
  { id: "profile", icon: User, label: "Profile" },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border shadow-lg z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-around py-2 px-4 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl",
                "transition-all duration-150 ease-out",
                "active:scale-90",
                "focus:outline-none",
                isActive
                  ? "text-[#5A4545] bg-[#E8CFCF] shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon 
                className={cn(
                  "w-5 h-5 transition-transform duration-150",
                  isActive && "scale-110"
                )} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
              <span className={cn(
                "text-[10px] font-medium transition-all duration-150",
                isActive && "font-semibold"
              )}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
