"use client"

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

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
      <div className="bg-card px-3 py-2 rounded-lg shadow-md border border-border">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">
          {type === "mood" ? moodLabels[value] || value : `${value} glasses`}
        </p>
      </div>
    )
  }
  return null
}

export function AnalyticsScreen({ moodHistory, waterHistory }: AnalyticsScreenProps) {
  return (
    <div className="min-h-screen pb-24 px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <header className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Your Insights
        </h1>
        <p className="text-muted-foreground">
          Track your wellness journey over time
        </p>
      </header>

      {/* Mood Chart */}
      <section className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <div className="bg-card rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-medium text-muted-foreground mb-1">Weekly Mood</h2>
          <p className="text-xs text-muted-foreground mb-6">How you&apos;ve been feeling</p>
          
          <div className="h-48">
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

      {/* Water Chart */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <div className="bg-card rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-medium text-muted-foreground mb-1">Weekly Hydration</h2>
          <p className="text-xs text-muted-foreground mb-6">Glasses of water per day</p>
          
          <div className="h-48">
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
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Supportive Message */}
      <div className="mt-8 p-5 bg-[#E8CFCF]/30 rounded-2xl text-center animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <p className="text-sm text-foreground">
          Remember, every day is a new opportunity. You&apos;re doing an amazing job taking care of yourself. 💜
        </p>
      </div>
    </div>
  )
}
