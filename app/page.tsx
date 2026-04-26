"use client"

import { useState, useCallback } from "react"
import { BackgroundPattern } from "@/components/background-pattern"
import { BottomNav } from "@/components/bottom-nav"
import { OnboardingScreen } from "@/components/screens/onboarding-screen"
import { LoginScreen } from "@/components/screens/login-screen"
import { DashboardScreen } from "@/components/screens/dashboard-screen"
import { MoodScreen } from "@/components/screens/mood-screen"
import { WaterScreen } from "@/components/screens/water-screen"
import { RemindersScreen } from "@/components/screens/reminders-screen"
import { AnalyticsScreen } from "@/components/screens/analytics-screen"
import { ProfileScreen } from "@/components/screens/profile-screen"
import type { MoodHistoryEntry } from "@/components/mood-history-item"

interface Reminder {
  id: string
  title: string
  time: string
  type: "medication" | "self-care" | "appointment" | "hydration"
  completed: boolean
}

const moodIcons: Record<string, string> = {
  happy: "😊",
  okay: "😐",
  sad: "😢",
  overwhelmed: "😰",
  tired: "😴",
}

// Helper to generate sample mood history with notes
const generateSampleMoodHistory = (): MoodHistoryEntry[] => {
  const moods = ["happy", "okay", "sad", "overwhelmed", "tired"]
  const sampleNotes = [
    "Had a great morning with the baby. First smile today!",
    "Feeling a bit tired but managing well.",
    "Tough night with feedings, but partner helped a lot.",
    "",
    "Finally got some rest. Feeling more like myself.",
    "Baby slept for 4 hours straight!",
    "",
  ]
  
  const entries: MoodHistoryEntry[] = []
  const now = new Date()
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    date.setHours(9 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60))
    
    entries.push({
      id: `entry-${i}`,
      mood: moods[Math.floor(Math.random() * moods.length)],
      note: sampleNotes[i] || undefined,
      timestamp: date,
    })
  }
  
  return entries
}

// Sample data for analytics (with notes for chart interaction)
const generateMoodChartData = (history: MoodHistoryEntry[]) => {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const moodValues: Record<string, number> = {
    happy: 5,
    okay: 4,
    sad: 3,
    overwhelmed: 2,
    tired: 1,
  }

  // Group by day and get the latest entry for each day
  const dayMap = new Map<string, MoodHistoryEntry>()
  history.forEach(entry => {
    const dayName = dayNames[new Date(entry.timestamp).getDay()]
    if (!dayMap.has(dayName)) {
      dayMap.set(dayName, entry)
    }
  })

  // Create chart data for the last 7 days
  const today = new Date()
  const chartData = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dayName = dayNames[date.getDay()]
    const entry = dayMap.get(dayName)
    
    chartData.push({
      day: dayName,
      mood: entry ? moodValues[entry.mood] || 4 : 4,
      label: entry ? entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1) : "Okay",
      note: entry?.note,
      entryId: entry?.id,
    })
  }
  
  return chartData
}

const sampleWaterHistory = [
  { day: "Mon", glasses: 8 },
  { day: "Tue", glasses: 6 },
  { day: "Wed", glasses: 10 },
  { day: "Thu", glasses: 7 },
  { day: "Fri", glasses: 9 },
  { day: "Sat", glasses: 5 },
  { day: "Sun", glasses: 8 },
]

const initialReminders: Reminder[] = [
  { id: "1", title: "Take prenatal vitamins", time: "08:00", type: "medication", completed: false },
  { id: "2", title: "Gentle stretching", time: "10:00", type: "self-care", completed: false },
  { id: "3", title: "Postpartum checkup", time: "14:30", type: "appointment", completed: false },
  { id: "4", title: "Drink water", time: "12:00", type: "hydration", completed: true },
]

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [waterData, setWaterData] = useState({ current: 5, goal: 12 })
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders)
  
  // Mood history with notes
  const [moodHistory, setMoodHistory] = useState<MoodHistoryEntry[]>(generateSampleMoodHistory())
  
  // Streak tracking (in a real app, this would persist to storage)
  const [moodStreak, setMoodStreak] = useState(5)
  const [waterStreak, setWaterStreak] = useState(3)

  // Get the latest mood entry
  const latestMood = moodHistory.length > 0 ? moodHistory[0] : null
  const currentMood = latestMood 
    ? { mood: latestMood.mood, icon: moodIcons[latestMood.mood] || "😊", note: latestMood.note }
    : null

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleSaveMood = useCallback((mood: string, note?: string) => {
    const newEntry: MoodHistoryEntry = {
      id: `entry-${Date.now()}`,
      mood,
      note: note?.trim() || undefined,
      timestamp: new Date(),
    }
    
    setMoodHistory(prev => [newEntry, ...prev])
    // Increment streak when logging mood
    setMoodStreak(prev => prev + 1)
  }, [])

  const handleUpdateWater = (current: number, goal: number) => {
    setWaterData({ current, goal })
    // If goal is met, increment streak
    if (current >= goal && waterData.current < waterData.goal) {
      setWaterStreak(prev => prev + 1)
    }
  }

  const handleUpdateReminders = (updatedReminders: Reminder[]) => {
    setReminders(updatedReminders)
  }

  const handleNavigate = (screen: string) => {
    setActiveTab(screen)
  }

  if (showOnboarding) {
    return <OnboardingScreen onGetStarted={() => setShowOnboarding(false)} />
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />
  }

  const activeReminders = reminders.filter((r) => !r.completed)
  const moodChartData = generateMoodChartData(moodHistory)

  return (
    <main className="min-h-screen bg-background">
      <BackgroundPattern />
      
      {activeTab === "dashboard" && (
        <DashboardScreen
          onNavigate={handleNavigate}
          moodData={currentMood}
          waterData={waterData}
          reminders={activeReminders.map((r) => ({ id: r.id, title: r.title, time: r.time }))}
          onQuickMood={handleSaveMood}
          moodStreak={moodStreak}
          waterStreak={waterStreak}
          latestMoodEntry={latestMood}
        />
      )}

      {activeTab === "mood" && (
        <MoodScreen
          onSaveMood={handleSaveMood}
          currentMood={currentMood?.mood || null}
          streak={moodStreak}
          moodHistory={moodHistory}
        />
      )}

      {activeTab === "water" && (
        <WaterScreen
          waterData={waterData}
          onUpdateWater={handleUpdateWater}
          streak={waterStreak}
        />
      )}

      {activeTab === "reminders" && (
        <RemindersScreen
          reminders={reminders}
          onUpdateReminders={handleUpdateReminders}
        />
      )}

      {activeTab === "analytics" && (
        <AnalyticsScreen
          moodHistory={moodChartData}
          waterHistory={sampleWaterHistory}
          moodStreak={moodStreak}
          waterStreak={waterStreak}
          moodEntries={moodHistory}
        />
      )}

      {activeTab === "profile" && (
        <ProfileScreen
          userName="Mama"
          waterGoal={waterData.goal}
          onUpdateWaterGoal={(goal) => setWaterData(prev => ({ ...prev, goal }))}
          onLogout={() => setIsLoggedIn(false)}
          moodStreak={moodStreak}
          waterStreak={waterStreak}
        />
      )}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  )
}
