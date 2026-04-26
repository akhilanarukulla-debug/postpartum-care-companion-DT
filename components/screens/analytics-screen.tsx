"use client"

import { useState } from "react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { StreakBadge } from "@/components/streak-badge"
import { InsightCard } from "@/components/insight-card"
import { SectionHeader } from "@/components/section-header"
import { EmptyState } from "@/components/empty-state"
import { BarChart3, X, MessageSquare, Smile, Meh, Frown, CloudRain, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MoodHistoryEntry } from "@/components/mood-history-item"

interface MoodChartEntry {
  day: string
  mood: number
  label: string
  note?: string
  entryId?: string
}

interface WaterEntry {
  day: string
  glasses: number
}

interface AnalyticsScreenProps {
  moodHistory: MoodChartEntry[]
  waterHistory: WaterEntry[]
  moodStreak?: number
  waterStreak?: number
  moodEntries?: MoodHistoryEntry[]
}

const moodLabels: Record<number, string> = {
  5: "Happy",
  4: "Okay",
  3: "Sad",
  2: "Overwhelmed",
  1: "Tired",
}

const moodIcons: Record<string, React.ReactNode> = {
  happy: <Smile className="w-5 h-5" />,
  okay: <Meh className="w-5 h-5" />,
  sad: <Frown className="w-5 h-5" />,
  overwhelmed: <CloudRain className="w-5 h-5" />,
  tired: <Moon className="w-5 h-5" />,
}

const moodColors: Record<string, string> = {
  happy: "bg-[#CFE8D6] text-[#3A5A58]",
  okay: "bg-[#D6D4F0] text-[#4A4860]",
  sad: "bg-[#E8CFCF] text-[#5A4545]",
  overwhelmed: "bg-[#F0E4D6] text-[#6B5A45]",
  tired: "bg-[#CFE8E6] text-[#3A5A58]",
}

interface MoodDetailModalProps {
  entry: MoodChartEntry
  onClose: () => void
}

function MoodDetailModal({ entry, onClose }: MoodDetailModalProps) {
  const moodKey = entry.label.toLowerCase()
  
  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">{entry.day}&apos;s Mood</h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors duration-150 tap-scale"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Mood Display */}
        <div className="flex items-center gap-4 mb-4">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center",
            moodColors[moodKey] || "bg-[#D6D4F0] text-[#4A4860]"
          )}>
            {moodIcons[moodKey] || <Smile className="w-6 h-6" />}
          </div>
          <div>
            <p className="text-lg font-medium text-foreground capitalize">{entry.label}</p>
            <p className="text-sm text-muted-foreground">Mood score: {entry.mood}/5</p>
          </div>
        </div>

        {/* Note Section */}
        {entry.note ? (
          <div className="bg-muted/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">Note</p>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {entry.note}
            </p>
          </div>
        ) : (
          <div className="bg-muted/30 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground">
              No note was added for this day
            </p>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-3 bg-[#E8CFCF] text-[#5A4545] rounded-xl font-medium hover:bg-[#E0C5C5] tap-scale transition-all duration-150"
        >
          Close
        </button>
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label, type }: { 
  active?: boolean
  payload?: Array<{ value: number; payload?: MoodChartEntry }>
  label?: string
  type: "mood" | "water"
}) => {
  if (active && payload && payload.length) {
    const value = payload[0].value
    const entry = payload[0].payload
    const hasNote = type === "mood" && entry?.note

    return (
      <div className="bg-card px-3 py-2 rounded-lg shadow-md border border-border animate-in fade-in zoom-in-95 duration-150">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">
          {type === "mood" ? moodLabels[value] || value : `${value} glasses`}
        </p>
        {hasNote && (
          <p className="text-xs text-[#4A4860] mt-1 flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            Tap to view note
          </p>
        )}
      </div>
    )
  }
  return null
}

export function AnalyticsScreen({ 
  moodHistory, 
  waterHistory, 
  moodStreak = 0, 
  waterStreak = 0,
}: AnalyticsScreenProps) {
  const [selectedEntry, setSelectedEntry] = useState<MoodChartEntry | null>(null)
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
      return "Incredible consistency! You've been tracking both mood and hydration for a week straight."
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

  const handleChartClick = (data: { activePayload?: Array<{ payload: MoodChartEntry }> }) => {
    if (data.activePayload && data.activePayload.length > 0) {
      setSelectedEntry(data.activePayload[0].payload)
    }
  }

  return (
    <div className="min-h-screen pb-24 px-4 py-6 max-w-lg mx-auto">
      {/* Mood Detail Modal */}
      {selectedEntry && (
        <MoodDetailModal 
          entry={selectedEntry} 
          onClose={() => setSelectedEntry(null)} 
        />
      )}

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
                <SectionHeader 
                  title="Weekly Mood" 
                  subtitle="Tap a point to view details" 
                />
                
                <div className="h-48 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={moodHistory} 
                      margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                      onClick={handleChartClick}
                    >
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
                        dot={{ fill: '#D6D4F0', strokeWidth: 0, r: 5, cursor: 'pointer' }}
                        activeDot={{ r: 8, fill: '#D6D4F0', stroke: '#fff', strokeWidth: 3, cursor: 'pointer' }}
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
