"use client"

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { StreakBadge } from "@/components/streak-badge"
import { InsightCard } from "@/components/insight-card"
import { SectionHeader } from "@/components/section-header"
import { EmptyState } from "@/components/empty-state"
import { BarChart3, TrendingUp } from "lucide-react"

interface MoodEntry {
  day: string
  mood: number
  label: string
}

interface WaterEntry {
  day: string
  glasses: number
}

interface AnalyticsScreenProps {
  moodHistory: MoodEntry[]
  waterHistory: WaterEntry[]
  moodStreak?: number
  waterStreak?: number
}

const moodLabels: Record<number, string> = {
  5: "Happy",
  4: "Okay",
  3: "Sad",
  2: "Overwhelmed",
  1: "Tired",
}

const CustomTooltip = ({ active, payload, label, type }: { 
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
  type: "mood" | "water"
}) => {
  if (active && payload && payload.length) {
    const value = payload[0].value
    return (
      <div className="bg-card px-3 py-2 rounded-lg shadow-md border border-border animate-in fade-in zoom-in-95 duration-150">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">
          {type === "mood" ? moodLabels[value] || value : `${value} glasses`}
        </p>
      </div>
    )
  }
  return null
}

export function AnalyticsScreen({ 
  moodHistory, 
  waterHistory, 
  moodStreak = 0, 
  waterStreak = 0 
}: AnalyticsScreenProps) {
  const hasData = moodHistory.length > 0 || waterHistory.length > 0
  
  // Calculate average mood
  const avgMood = moodHistory.length > 0 
    ? (moodHistory.reduce((sum, entry) => sum + entry.mood, 0) / moodHistory.length).toFixed(1)
    : null
  
  // Calculate average water
  const avgWater = waterHistory.length > 0
    ? (waterHistory.reduce((sum, entry) => sum + entry.glasses, 0) / waterHistory.length).toFixed(1)
    : null

  const getInsightMessage = () => {
    if (moodStreak >= 7 && waterStreak >= 7) {
      return "Incredible consistency! You&apos;ve been tracking both mood and hydration for a week straight."
    }
    if (moodStreak >= 5) {
      return `Your ${moodStreak}-day mood tracking streak shows real commitment to self-awareness.`
    }
    if (waterStreak >= 5) {
      return `Your ${waterStreak}-day hydration streak is helping your body stay healthy.`
    }
    if (avgMood && parseFloat(avgMood) >= 4) {
      return "Your mood has been positive this week. Keep nurturing what brings you joy."
    }
    return "Tracking your wellness helps you understand patterns and make positive changes."
  }

  return (
    <div className="min-h-screen pb-24 px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <header className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl font-semibold text-foreground mb-1">
          Your Insights
        </h1>
        <p className="text-muted-foreground">
          Track your wellness journey over time
        </p>
        
        {/* Streak Badges */}
        {(moodStreak > 0 || waterStreak > 0) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {moodStreak > 0 && <StreakBadge count={moodStreak} type="mood" size="sm" />}
            {waterStreak > 0 && <StreakBadge count={waterStreak} type="water" size="sm" />}
          </div>
        )}
      </header>

      {!hasData ? (
        <EmptyState
          icon={<BarChart3 className="w-6 h-6" />}
          title="No data yet"
          description="Start tracking your mood and water intake to see your wellness patterns here."
          variant="lavender"
        />
      ) : (
        <>
          {/* Insight Card */}
          <section className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-50">
            <InsightCard type="streak" message={getInsightMessage()} />
          </section>

          {/* Stats Overview */}
          <section className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <div className="grid grid-cols-2 gap-4">
              {avgMood && (
                <div className="bg-card rounded-2xl p-4 shadow-sm">
                  <p className="text-xs text-muted-foreground mb-1">Avg. Mood</p>
                  <p className="text-2xl font-semibold text-foreground">{avgMood}</p>
                  <p className="text-xs text-muted-foreground mt-1">out of 5</p>
                </div>
              )}
              {avgWater && (
                <div className="bg-card rounded-2xl p-4 shadow-sm">
                  <p className="text-xs text-muted-foreground mb-1">Avg. Water</p>
                  <p className="text-2xl font-semibold text-foreground">{avgWater}</p>
                  <p className="text-xs text-muted-foreground mt-1">glasses/day</p>
                </div>
              )}
            </div>
          </section>

          {/* Mood Chart */}
          {moodHistory.length > 0 && (
            <section className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
              <div className="bg-card rounded-2xl p-5 shadow-sm">
                <SectionHeader title="Weekly Mood" subtitle="How you&apos;ve been feeling" />
                
                <div className="h-48 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={moodHistory} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <XAxis 
                        dataKey="day" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#7A7A7A' }}
                      />
                      <YAxis 
                        domain={[0, 5]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#7A7A7A' }}
                        ticks={[1, 2, 3, 4, 5]}
                      />
                      <Tooltip content={<CustomTooltip type="mood" />} />
                      <Line
                        type="monotone"
                        dataKey="mood"
                        stroke="#D6D4F0"
                        strokeWidth={3}
                        dot={{ fill: '#D6D4F0', strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 6, fill: '#D6D4F0', stroke: '#fff', strokeWidth: 2 }}
                        animationDuration={800}
                        animationEasing="ease-out"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Mood Legend */}
                <div className="flex flex-wrap justify-center gap-3 mt-4 text-xs text-muted-foreground">
                  <span>5 = Happy</span>
                  <span>4 = Okay</span>
                  <span>3 = Sad</span>
                  <span>2 = Overwhelmed</span>
                  <span>1 = Tired</span>
                </div>
              </div>
            </section>
          )}

          {/* Water Chart */}
          {waterHistory.length > 0 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <div className="bg-card rounded-2xl p-5 shadow-sm">
                <SectionHeader title="Weekly Hydration" subtitle="Glasses of water per day" />
                
                <div className="h-48 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={waterHistory} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <XAxis 
                        dataKey="day" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#7A7A7A' }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#7A7A7A' }}
                      />
                      <Tooltip content={<CustomTooltip type="water" />} />
                      <Bar 
                        dataKey="glasses" 
                        fill="#CFE8E6"
                        radius={[8, 8, 0, 0]}
                        animationDuration={800}
                        animationEasing="ease-out"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>
          )}

          {/* Supportive Message */}
          <div className="mt-6 p-5 bg-[#E8CFCF]/20 rounded-2xl text-center animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <p className="text-sm text-foreground text-pretty">
              Remember, every day is a new opportunity. You&apos;re doing an amazing job taking care of yourself.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
