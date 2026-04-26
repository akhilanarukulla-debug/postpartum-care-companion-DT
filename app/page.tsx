"use client"

import { useState } from "react"
import { BackgroundPattern } from "@/components/background-pattern"
import { BottomNav } from "@/components/bottom-nav"
import { LoginScreen } from "@/components/screens/login-screen"
import { DashboardScreen } from "@/components/screens/dashboard-screen"
import { MoodScreen } from "@/components/screens/mood-screen"
import { WaterScreen } from "@/components/screens/water-screen"
import { RemindersScreen } from "@/components/screens/reminders-screen"
import { AnalyticsScreen } from "@/components/screens/analytics-screen"

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

// Sample data for analytics
const sampleMoodHistory = [
  { day: "Mon", mood: 4, label: "Okay" },
  { day: "Tue", mood: 5, label: "Happy" },
  { day: "Wed", mood: 3, label: "Sad" },
  { day: "Thu", mood: 4, label: "Okay" },
  { day: "Fri", mood: 5, label: "Happy" },
  { day: "Sat", mood: 4, label: "Okay" },
  { day: "Sun", mood: 5, label: "Happy" },
]

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
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [currentMood, setCurrentMood] = useState<{ mood: string; icon: string } | null>(null)
  const [waterData, setWaterData] = useState({ current: 5, goal: 12 })
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleSaveMood = (mood: string) => {
    setCurrentMood({ mood, icon: moodIcons[mood] || "😊" })
  }

  const handleUpdateWater = (current: number, goal: number) => {
    setWaterData({ current, goal })
  }

  const handleUpdateReminders = (updatedReminders: Reminder[]) => {
    setReminders(updatedReminders)
  }

  const handleNavigate = (screen: string) => {
    setActiveTab(screen)
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />
  }

  const activeReminders = reminders.filter((r) => !r.completed)

  return (
    <main className="min-h-screen bg-background">
      <BackgroundPattern />
      
      {activeTab === "dashboard" && (
        <DashboardScreen
          onNavigate={handleNavigate}
          moodData={currentMood}
          waterData={waterData}
          reminders={activeReminders.map((r) => ({ id: r.id, title: r.title, time: r.time }))}
        />
      )}

      {activeTab === "mood" && (
        <MoodScreen
          onSaveMood={handleSaveMood}
          currentMood={currentMood?.mood || null}
        />
      )}

      {activeTab === "water" && (
        <WaterScreen
          waterData={waterData}
          onUpdateWater={handleUpdateWater}
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
          moodHistory={sampleMoodHistory}
          waterHistory={sampleWaterHistory}
        />
      )}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  )
}
