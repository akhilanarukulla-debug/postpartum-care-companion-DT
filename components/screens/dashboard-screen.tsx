"use client"

import { Smile, Droplets, Bell, ChevronRight, MessageSquare } from "lucide-react"
import { QuickActionButton } from "@/components/quick-action-button"
import { DailyCheckin } from "@/components/daily-checkin"
import { StreakBadge } from "@/components/streak-badge"
import { InsightCard } from "@/components/insight-card"
import { SectionHeader } from "@/components/section-header"
import type { MoodHistoryEntry } from "@/components/mood-history-item"

interface DashboardScreenProps {
  onNavigate: (screen: string) => void
  moodData: { mood: string; icon: string; note?: string } | null
  waterData: { current: number; goal: number }
  reminders: Array<{ id: string; title: string; time: string }>
  onQuickMood: (mood: string, note?: string) => void
  moodStreak: number
  waterStreak: number
  latestMoodEntry?: MoodHistoryEntry | null
}

export function DashboardScreen({ 
  onNavigate, 
  moodData, 
  waterData, 
  reminders,
  onQuickMood,
  moodStreak,
  waterStreak,
  latestMoodEntry
}: DashboardScreenProps) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const getInsightMessage = () => {
    if (waterData.current >= waterData.goal) {
      return "You've reached your hydration goal today! Your body thanks you."
    }
    if (moodStreak >= 7) {
      return `Amazing! You've been logging your mood for ${moodStreak} days straight.`
    }
    if (waterStreak >= 3) {
      return `Great work on your ${waterStreak}-day hydration streak! Keep it up.`
    }
    if (moodData?.mood === "happy") {
      return "Wonderful to see you're feeling happy today!"
    }
    return "Remember: taking care of yourself is not selfish, it's essential."
  }

  // Format note preview (max 50 chars)
  const notePreview = latestMoodEntry?.note 
    ? latestMoodEntry.note.length > 50 
      ? latestMoodEntry.note.slice(0, 50) + "..." 
      : latestMoodEntry.note
    : null

  // Format time for mood entry
  const formatMoodTime = (entry: MoodHistoryEntry | null | undefined) => {
    if (!entry) return null
    const date = new Date(entry.timestamp)
    const now = new Date()
    
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
    }
    
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday`
    }
    
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
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
        <SectionHeader title="Today's Progress" subtitle="Track your wellness" />
        
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

          {/* Last Mood Card - Enhanced with note preview */}
          <button
            onClick={() => onNavigate("mood")}
            className="w-full bg-card rounded-2xl p-5 shadow-sm flex items-start justify-between transition-all duration-200 hover:shadow-md tap-scale-sm animate-in fade-in slide-in-from-bottom-4 duration-500 stagger-2"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#D6D4F0] rounded-xl flex items-center justify-center flex-shrink-0">
                {moodData ? (
                  <span className="text-2xl">{moodData.icon}</span>
                ) : (
                  <Smile className="w-6 h-6 text-[#4A4860]" />
                )}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Last mood</p>
                  {latestMoodEntry && (
                    <span className="text-xs text-muted-foreground/70">
                      {formatMoodTime(latestMoodEntry)}
                    </span>
                  )}
                </div>
                <p className="font-medium text-foreground capitalize">
                  {moodData ? moodData.mood : "Not logged yet"}
                </p>
                
                {/* Note Preview */}
                {notePreview && (
                  <div className="flex items-start gap-1.5 mt-2">
                    <MessageSquare className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {notePreview}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
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
