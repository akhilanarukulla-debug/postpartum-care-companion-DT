"use client"

import { Smile, Droplets, Bell, ChevronRight, Sparkles } from "lucide-react"
import { QuickActionButton } from "@/components/quick-action-button"
import { DailyCheckin } from "@/components/daily-checkin"
import { StreakBadge } from "@/components/streak-badge"
import { InsightCard } from "@/components/insight-card"
import { SectionHeader } from "@/components/section-header"
import { EmptyState } from "@/components/empty-state"

interface DashboardScreenProps {
  onNavigate: (screen: string) => void
  moodData: { mood: string; icon: string } | null
  waterData: { current: number; goal: number }
  reminders: Array<{ id: string; title: string; time: string }>
  onQuickMood: (mood: string) => void
  moodStreak: number
  waterStreak: number
}

export function DashboardScreen({ 
  onNavigate, 
  moodData, 
  waterData, 
  reminders,
  onQuickMood,
  moodStreak,
  waterStreak
}: DashboardScreenProps) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const getInsightMessage = () => {
    if (waterData.current >= waterData.goal) {
      return "You&apos;ve reached your hydration goal today! Your body thanks you."
    }
    if (moodStreak >= 7) {
      return `Amazing! You&apos;ve been logging your mood for ${moodStreak} days straight.`
    }
    if (waterStreak >= 3) {
      return `Great work on your ${waterStreak}-day hydration streak! Keep it up.`
    }
    if (moodData?.mood === "happy") {
      return "Wonderful to see you&apos;re feeling happy today!"
    }
    return "Remember: taking care of yourself is not selfish, it&apos;s essential."
  }

  return (
    <div className="min-h-screen pb-24 px-4 py-6 max-w-lg mx-auto">
      {/* Greeting Section */}
      <header className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl font-semibold text-foreground mb-1 text-balance">
          {getGreeting()}
        </h1>
        <p className="text-muted-foreground">
          How are you feeling today?
        </p>
        
        {/* Streak Badges */}
        {(moodStreak > 0 || waterStreak > 0) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {moodStreak > 0 && <StreakBadge count={moodStreak} type="mood" size="sm" />}
            {waterStreak > 0 && <StreakBadge count={waterStreak} type="water" size="sm" />}
          </div>
        )}
      </header>

      {/* Daily Check-in Card */}
      <section className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
        <DailyCheckin 
          onSelectMood={onQuickMood} 
          currentMood={moodData?.mood || null} 
        />
      </section>

      {/* Insight Card */}
      <section className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <InsightCard type="general" message={getInsightMessage()} />
      </section>

      {/* Status Cards */}
      <section className="mb-8">
        <SectionHeader title="Today&apos;s Progress" subtitle="Track your wellness" />
        
        <div className="space-y-3">
          {/* Water Intake Card */}
          <button
            onClick={() => onNavigate("water")}
            className="w-full bg-card rounded-2xl p-5 shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md tap-scale-sm animate-in fade-in slide-in-from-bottom-4 duration-500 stagger-1"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#CFE8E6] rounded-xl flex items-center justify-center">
                <Droplets className="w-6 h-6 text-[#3A5A58]" />
              </div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Water intake</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">
                    {waterData.current}/{waterData.goal} glasses
                  </p>
                </div>
                {/* Animated Progress Bar */}
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden mt-1.5">
                  <div
                    className="h-full bg-[#CFE8E6] rounded-full animate-progress"
                    style={{ width: `${Math.min((waterData.current / waterData.goal) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Last Mood Card */}
          <button
            onClick={() => onNavigate("mood")}
            className="w-full bg-card rounded-2xl p-5 shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md tap-scale-sm animate-in fade-in slide-in-from-bottom-4 duration-500 stagger-2"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#D6D4F0] rounded-xl flex items-center justify-center">
                {moodData ? (
                  <span className="text-2xl">{moodData.icon}</span>
                ) : (
                  <Smile className="w-6 h-6 text-[#4A4860]" />
                )}
              </div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Last mood</p>
                <p className="font-medium text-foreground capitalize">
                  {moodData ? moodData.mood : "Not logged yet"}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Upcoming Reminders Card */}
          <button
            onClick={() => onNavigate("reminders")}
            className="w-full bg-card rounded-2xl p-5 shadow-sm transition-all duration-200 hover:shadow-md tap-scale-sm animate-in fade-in slide-in-from-bottom-4 duration-500 stagger-3"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E8CFCF] rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-[#5A4545]" />
                </div>
                <p className="text-sm text-muted-foreground">Upcoming reminders</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
            
            {reminders.length > 0 ? (
              <div className="space-y-2">
                {reminders.slice(0, 3).map((reminder) => (
                  <div key={reminder.id} className="flex items-center justify-between text-left">
                    <p className="text-sm font-medium text-foreground">{reminder.title}</p>
                    <p className="text-xs text-muted-foreground">{reminder.time}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-left">
                No upcoming reminders
              </p>
            )}
          </button>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 stagger-4">
        <SectionHeader title="Quick Actions" />
        <div className="flex flex-col gap-3">
          <QuickActionButton
            icon={<Smile className="w-5 h-5" />}
            label="Log Mood"
            onClick={() => onNavigate("mood")}
            variant="lavender"
          />
          <QuickActionButton
            icon={<Droplets className="w-5 h-5" />}
            label="Add Water"
            onClick={() => onNavigate("water")}
            variant="teal"
          />
          <QuickActionButton
            icon={<Bell className="w-5 h-5" />}
            label="View Reminders"
            onClick={() => onNavigate("reminders")}
            variant="pink"
          />
        </div>
      </section>
    </div>
  )
}
