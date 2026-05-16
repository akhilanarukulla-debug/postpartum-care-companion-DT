"use client"

import { useState } from "react"
import { 
  User, 
  Target, 
  Bell, 
  Settings, 
  Shield, 
  Info, 
  LogOut,
  ChevronRight,
  Heart,
  Droplets,
  Smile
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SectionHeader } from "@/components/section-header"

interface ProfileScreenProps {
  userName: string
  waterGoal: number
  onUpdateWaterGoal: (goal: number) => void
  onLogout: () => void
  moodStreak: number
  waterStreak: number
}

interface MenuItemProps {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  value?: string
  hasArrow?: boolean
}

function MenuItem({ icon, label, onClick, value, hasArrow = true }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-between w-full px-4 py-3.5",
        "bg-card rounded-xl shadow-sm",
        "transition-all duration-150 ease-out",
        "active:scale-[0.98] active:shadow-none",
        "hover:shadow-md hover:-translate-y-0.5",
        "focus:outline-none focus:ring-2 focus:ring-[#D6D4F0] focus:ring-offset-2"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#F7F7F7] flex items-center justify-center">
          {icon}
        </div>
        <span className="font-medium text-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm text-muted-foreground">{value}</span>}
        {hasArrow && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </div>
    </button>
  )
}

export function ProfileScreen({ 
  userName, 
  waterGoal, 
  onUpdateWaterGoal, 
  onLogout,
  moodStreak,
  waterStreak
}: ProfileScreenProps) {
  const [showGoalEditor, setShowGoalEditor] = useState(false)
  const [tempGoal, setTempGoal] = useState(waterGoal)

  const handleSaveGoal = () => {
    onUpdateWaterGoal(tempGoal)
    setShowGoalEditor(false)
  }

  return (
    <div className="min-h-screen pb-24 pt-4 px-4 max-w-lg mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-foreground">Profile</h1>
      </header>

      {/* Profile Card */}
      <div className="bg-card rounded-2xl shadow-sm p-6 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-[#E8CFCF] flex items-center justify-center mb-3">
            <User className="w-10 h-10 text-[#5A4545]" />
          </div>
          
          <h2 className="text-lg font-semibold text-foreground">{userName}</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
            You are doing amazing <Heart className="w-3.5 h-3.5 text-[#E8CFCF] fill-[#E8CFCF]" />
          </p>
          
          {/* Streaks Summary */}
          <div className="flex items-center gap-6 mt-5 pt-5 border-t border-border w-full justify-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#E8CFCF]/50 flex items-center justify-center">
                <Smile className="w-4 h-4 text-[#5A4545]" />
              </div>
              <div className="text-left">
                <p className="text-lg font-semibold text-foreground">{moodStreak}</p>
                <p className="text-[10px] text-muted-foreground">day streak</p>
              </div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#CFE8E6]/50 flex items-center justify-center">
                <Droplets className="w-4 h-4 text-[#3A5A58]" />
              </div>
              <div className="text-left">
                <p className="text-lg font-semibold text-foreground">{waterStreak}</p>
                <p className="text-[10px] text-muted-foreground">day streak</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Personal Section */}
        <section className="animate-in fade-in slide-in-from-bottom-2 duration-300 stagger-1">
          <SectionHeader title="Personal" />
          <div className="space-y-2">
            <MenuItem
              icon={<User className="w-4 h-4 text-[#5A4545]" />}
              label="Personal Information"
            />
            <MenuItem
              icon={<Target className="w-4 h-4 text-[#3A5A58]" />}
              label="Daily Goals"
              value={`${waterGoal} glasses`}
              onClick={() => setShowGoalEditor(true)}
            />
          </div>
        </section>

        {/* Preferences Section */}
        <section className="animate-in fade-in slide-in-from-bottom-2 duration-300 stagger-2">
          <SectionHeader title="Preferences" />
          <div className="space-y-2">
            <MenuItem
              icon={<Settings className="w-4 h-4 text-[#4A4860]" />}
              label="Reminders Settings"
            />
            <MenuItem
              icon={<Bell className="w-4 h-4 text-[#5A4545]" />}
              label="Notifications"
            />
          </div>
        </section>

        {/* More Section */}
        <section className="animate-in fade-in slide-in-from-bottom-2 duration-300 stagger-3">
          <SectionHeader title="More" />
          <div className="space-y-2">
            <MenuItem
              icon={<Shield className="w-4 h-4 text-[#3A5A58]" />}
              label="Privacy"
            />
            <MenuItem
              icon={<Info className="w-4 h-4 text-[#4A4860]" />}
              label="About Us"
            />
          </div>
        </section>

        {/* Logout */}
        <section className="animate-in fade-in slide-in-from-bottom-2 duration-300 stagger-4">
          <button
            onClick={onLogout}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3.5",
              "bg-card rounded-xl shadow-sm",
              "transition-all duration-150 ease-out",
              "active:scale-[0.98]",
              "hover:bg-[#E8CFCF]/30",
              "focus:outline-none focus:ring-2 focus:ring-[#E8CFCF] focus:ring-offset-2"
            )}
          >
            <div className="w-9 h-9 rounded-full bg-[#E8CFCF]/30 flex items-center justify-center">
              <LogOut className="w-4 h-4 text-[#8B5A5A]" />
            </div>
            <span className="font-medium text-[#8B5A5A]">Log Out</span>
          </button>
        </section>
      </div>

      {/* Goal Editor Modal */}
      {showGoalEditor && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-2xl shadow-xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold text-foreground mb-4">Daily Water Goal</h3>
            
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={() => setTempGoal(Math.max(1, tempGoal - 1))}
                className="w-12 h-12 rounded-full bg-[#CFE8E6] text-[#3A5A58] font-bold text-xl active:scale-90 transition-transform"
              >
                -
              </button>
              <div className="text-center">
                <span className="text-4xl font-bold text-foreground">{tempGoal}</span>
                <p className="text-sm text-muted-foreground">glasses</p>
              </div>
              <button
                onClick={() => setTempGoal(tempGoal + 1)}
                className="w-12 h-12 rounded-full bg-[#CFE8E6] text-[#3A5A58] font-bold text-xl active:scale-90 transition-transform"
              >
                +
              </button>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowGoalEditor(false)}
                className="flex-1 py-3 rounded-xl border border-border text-foreground font-medium active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveGoal}
                className="flex-1 py-3 rounded-xl bg-[#CFE8E6] text-[#3A5A58] font-medium active:scale-95 transition-transform"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
