"use client"

import { useState, useCallback, useEffect } from "react"
import useSWR, { mutate } from "swr"
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

interface User {
  id: string
  name: string
  email: string
}

interface DashboardData {
  settings: {
    water_goal: number
    mood_streak: number
    water_streak: number
    show_onboarding: boolean
  }
  latestMood: {
    id: string
    mood: string
    note?: string
    created_at: string
  } | null
  waterData: {
    current: number
    goal: number
  }
  activeReminders: Array<{
    id: string
    title: string
    time: string
    type: string
    completed: boolean
  }>
  moodHistory: Array<{
    id: string
    mood: string
    note?: string
    created_at: string
  }>
  moodStreak: number
  waterStreak: number
}

interface AnalyticsData {
  moodStreak: number
  waterStreak: number
  moodEntries: Array<{
    id: string
    mood: string
    note?: string
    created_at: string
  }>
  waterHistory: Array<{
    date: string
    glasses: number
  }>
}

const moodIcons: Record<string, string> = {
  happy: "😊",
  okay: "😐",
  sad: "😢",
  overwhelmed: "😰",
  tired: "😴",
}

const moodValues: Record<string, number> = {
  happy: 5,
  okay: 4,
  sad: 3,
  overwhelmed: 2,
  tired: 1,
}

// SWR fetcher function
const fetcher = async (url: string) => {
  console.log("[v0] SWR fetcher called for:", url)
  const res = await fetch(url, { credentials: "include" })
  console.log("[v0] SWR fetcher response:", url, res.status)
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.")
    console.error("[v0] SWR fetcher error:", url, res.status)
    throw error
  }
  const data = await res.json()
  console.log("[v0] SWR fetcher data:", url, data)
  return data
}

// Convert database mood entries to MoodHistoryEntry format
function convertToMoodHistoryEntry(entry: { id: string; mood: string; note?: string; created_at: string }): MoodHistoryEntry {
  return {
    id: entry.id,
    mood: entry.mood,
    note: entry.note,
    timestamp: new Date(entry.created_at),
  }
}

// Generate mood chart data from mood entries
function generateMoodChartData(moodEntries: Array<{ id: string; mood: string; note?: string; created_at: string }>) {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Group by day and get the latest entry for each day
  const dayMap = new Map<string, { id: string; mood: string; note?: string; created_at: string }>()
  moodEntries.forEach(entry => {
    const dayName = dayNames[new Date(entry.created_at).getDay()]
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
    
    if (entry) {
      chartData.push({
        day: dayName,
        mood: moodValues[entry.mood] || 4,
        label: entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1),
        note: entry.note,
        entryId: entry.id,
      })
    }
  }
  
  return chartData
}

// Generate water chart data from water history
function generateWaterChartData(waterHistory: Array<{ date: string; glasses: number }>) {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  
  return waterHistory.map(entry => ({
    day: dayNames[new Date(entry.date).getDay()],
    glasses: entry.glasses,
  })).reverse()
}

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [authChecked, setAuthChecked] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      console.log("[v0] Checking auth status...")
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" })
        console.log("[v0] Auth check response:", res.status)
        if (res.ok) {
          const data = await res.json()
          console.log("[v0] Auth check success:", data.user)
          setUser(data.user)
          setShowOnboarding(false)
        } else {
          console.log("[v0] Auth check: No session")
        }
      } catch (error) {
        console.error("[v0] Auth check failed:", error)
      } finally {
        setAuthChecked(true)
      }
    }
    checkAuth()
  }, [])

  // Fetch dashboard data (only when logged in)
  const { data: dashboardData, isLoading: dashboardLoading } = useSWR<DashboardData>(
    user ? "/api/dashboard" : null,
    fetcher,
    { revalidateOnFocus: false }
  )

  // Fetch reminders data
  const { data: remindersData } = useSWR<Reminder[]>(
    user ? "/api/reminders" : null,
    fetcher,
    { revalidateOnFocus: false }
  )

  // Fetch analytics data
  const { data: analyticsData } = useSWR<AnalyticsData>(
    user && activeTab === "analytics" ? "/api/analytics" : null,
    fetcher,
    { revalidateOnFocus: false }
  )

  const handleLogin = async (email: string, password: string, isSignup: boolean): Promise<{ success: boolean; error?: string }> => {
    console.log("[v0] handleLogin called:", { email, isSignup })
    try {
      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login"
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Ensure cookies are included
      })
      
      const data = await res.json()
      console.log("[v0] handleLogin response:", { status: res.status, data })
      
      if (!res.ok) {
        return { success: false, error: data.error || "Authentication failed" }
      }
      
      // Set user state - this triggers SWR to fetch data
      // The cookie should be set by the browser from the Set-Cookie header
      setUser(data.user)
      setShowOnboarding(false)
      
      // Small delay to ensure cookie is stored before fetching data
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Revalidate all data after cookie is set
      console.log("[v0] handleLogin: Revalidating data...")
      await mutate("/api/dashboard")
      await mutate("/api/reminders")
      await mutate("/api/analytics")
      console.log("[v0] handleLogin: Revalidation complete")
      
      return { success: true }
    } catch (error) {
      console.error("[v0] handleLogin error:", error)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  const handleLogout = async () => {
    console.log("[v0] handleLogout called")
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
      console.log("[v0] handleLogout: Clearing user state")
      setUser(null)
      setShowOnboarding(true)
      // Clear all cached data
      mutate("/api/dashboard", undefined)
      mutate("/api/reminders", undefined)
      mutate("/api/analytics", undefined)
    } catch (error) {
      console.error("[v0] handleLogout error:", error)
    }
  }

  const handleSaveMood = useCallback(async (mood: string, note?: string) => {
    console.log("[v0] handleSaveMood called with mood:", mood, "note:", note)
    try {
      const res = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, note }),
        credentials: "include",
      })
      
      console.log("[v0] handleSaveMood response status:", res.status)
      const data = await res.json()
      console.log("[v0] handleSaveMood response data:", data)
      
      if (res.ok) {
        console.log("[v0] handleSaveMood: Success, revalidating...")
        // Revalidate dashboard and analytics data
        await mutate("/api/dashboard")
        await mutate("/api/analytics")
        console.log("[v0] handleSaveMood: Revalidation complete")
      } else {
        console.error("[v0] handleSaveMood: API error:", data.error)
      }
    } catch (error) {
      console.error("[v0] handleSaveMood failed:", error)
    }
  }, [])

  const handleUpdateWater = useCallback(async (glasses: number) => {
    console.log("[v0] handleUpdateWater called with glasses:", glasses)
    try {
      const res = await fetch("/api/water", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ glasses }),
        credentials: "include",
      })
      
      console.log("[v0] handleUpdateWater response status:", res.status)
      const data = await res.json()
      console.log("[v0] handleUpdateWater response data:", data)
      
      if (res.ok) {
        console.log("[v0] handleUpdateWater: Success, revalidating...")
        // Revalidate dashboard and analytics data
        await mutate("/api/dashboard")
        await mutate("/api/analytics")
        console.log("[v0] handleUpdateWater: Revalidation complete")
      } else {
        console.error("[v0] handleUpdateWater: API error:", data.error)
      }
    } catch (error) {
      console.error("[v0] handleUpdateWater failed:", error)
    }
  }, [])

  const handleUpdateWaterGoal = useCallback(async (goal: number) => {
    console.log("[v0] handleUpdateWaterGoal called with goal:", goal)
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ water_goal: goal }),
        credentials: "include",
      })
      
      if (res.ok) {
        mutate("/api/dashboard")
      }
    } catch (error) {
      console.error("Failed to update water goal:", error)
    }
  }, [])

  const handleUpdateReminders = useCallback(async (updatedReminders: Reminder[]) => {
    // Find the reminder that changed (for optimistic UI, we update immediately)
    mutate("/api/reminders", updatedReminders, false)
  }, [])

  const handleToggleReminder = useCallback(async (reminderId: string) => {
    console.log("[v0] handleToggleReminder called with id:", reminderId)
    try {
      const res = await fetch("/api/reminders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reminderId, action: "toggle" }),
        credentials: "include",
      })
      
      if (res.ok) {
        mutate("/api/reminders")
        mutate("/api/dashboard")
      }
    } catch (error) {
      console.error("Failed to toggle reminder:", error)
    }
  }, [])

  const handleAddReminder = useCallback(async (title: string, time: string, type: string) => {
    console.log("[v0] handleAddReminder called with title:", title, "time:", time, "type:", type)
    try {
      const res = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, time, type }),
        credentials: "include",
      })
      
      console.log("[v0] handleAddReminder response status:", res.status)
      const data = await res.json()
      console.log("[v0] handleAddReminder response data:", data)
      
      if (res.ok) {
        console.log("[v0] handleAddReminder: Success, revalidating...")
        await mutate("/api/reminders")
        await mutate("/api/dashboard")
        console.log("[v0] handleAddReminder: Revalidation complete")
      } else {
        console.error("[v0] handleAddReminder: API error:", data.error)
      }
    } catch (error) {
      console.error("[v0] handleAddReminder failed:", error)
    }
  }, [])

  const handleDeleteReminder = useCallback(async (reminderId: string) => {
    console.log("[v0] handleDeleteReminder called with id:", reminderId)
    try {
      const res = await fetch("/api/reminders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reminderId }),
        credentials: "include",
      })
      
      if (res.ok) {
        mutate("/api/reminders")
        mutate("/api/dashboard")
      }
    } catch (error) {
      console.error("Failed to delete reminder:", error)
    }
  }, [])

  const handleNavigate = (screen: string) => {
    console.log("[v0] handleNavigate called with:", screen)
    setActiveTab(screen)
  }

  // Show loading while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (showOnboarding && !user) {
    return <OnboardingScreen onGetStarted={() => setShowOnboarding(false)} />
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />
  }

  // Default values for when data is loading or empty
  const waterData = dashboardData?.waterData || { current: 0, goal: 8 }
  const moodStreak = dashboardData?.moodStreak ?? 0
  const waterStreak = dashboardData?.waterStreak ?? 0
  const reminders = (remindersData || []) as Reminder[]
  const activeReminders = reminders.filter((r) => !r.completed)

  // Convert mood data
  const latestMood = dashboardData?.latestMood
  const currentMood = latestMood 
    ? { mood: latestMood.mood, icon: moodIcons[latestMood.mood] || "😊", note: latestMood.note }
    : null
  const latestMoodEntry = latestMood ? convertToMoodHistoryEntry(latestMood) : null

  // Convert mood history
  const moodHistory: MoodHistoryEntry[] = (dashboardData?.moodHistory || []).map(convertToMoodHistoryEntry)

  // Analytics data
  const moodChartData = analyticsData?.moodEntries 
    ? generateMoodChartData(analyticsData.moodEntries)
    : []
  const waterChartData = analyticsData?.waterHistory 
    ? generateWaterChartData(analyticsData.waterHistory)
    : []

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
          latestMoodEntry={latestMoodEntry}
          isLoading={dashboardLoading}
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
          onUpdateGoal={handleUpdateWaterGoal}
          streak={waterStreak}
        />
      )}

      {activeTab === "reminders" && (
        <RemindersScreen
          reminders={reminders}
          onToggleReminder={handleToggleReminder}
          onAddReminder={handleAddReminder}
          onDeleteReminder={handleDeleteReminder}
        />
      )}

      {activeTab === "analytics" && (
        <AnalyticsScreen
          moodHistory={moodChartData}
          waterHistory={waterChartData}
          moodStreak={analyticsData?.moodStreak ?? moodStreak}
          waterStreak={analyticsData?.waterStreak ?? waterStreak}
          moodEntries={moodHistory}
        />
      )}

      {activeTab === "profile" && (
        <ProfileScreen
          userName={user.name || user.email?.split("@")[0] || "User"}
          waterGoal={waterData.goal}
          onUpdateWaterGoal={handleUpdateWaterGoal}
          onLogout={handleLogout}
          moodStreak={moodStreak}
          waterStreak={waterStreak}
        />
      )}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  )
}
