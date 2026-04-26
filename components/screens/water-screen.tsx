"use client"

import { useState } from "react"
import { Plus, Minus, Settings } from "lucide-react"
import { ProgressRing } from "@/components/progress-ring"
import { StreakBadge } from "@/components/streak-badge"
import { InsightCard } from "@/components/insight-card"
import { SectionHeader } from "@/components/section-header"

interface WaterScreenProps {
  waterData: { current: number; goal: number }
  onUpdateWater: (current: number, goal: number) => void
  streak?: number
}

export function WaterScreen({ waterData, onUpdateWater, streak = 0 }: WaterScreenProps) {
  const [showGoalEdit, setShowGoalEdit] = useState(false)
  const [tempGoal, setTempGoal] = useState(waterData.goal.toString())
  const [isAdding, setIsAdding] = useState(false)

  const progress = Math.min((waterData.current / waterData.goal) * 100, 100)

  const addWater = () => {
    setIsAdding(true)
    onUpdateWater(waterData.current + 1, waterData.goal)
    setTimeout(() => setIsAdding(false), 150)
  }

  const removeWater = () => {
    if (waterData.current > 0) {
      onUpdateWater(waterData.current - 1, waterData.goal)
    }
  }

  const saveGoal = () => {
    const newGoal = parseInt(tempGoal) || 8
    onUpdateWater(waterData.current, Math.max(1, newGoal))
    setShowGoalEdit(false)
  }

  const getInsightMessage = () => {
    if (waterData.current >= waterData.goal) {
      return "Congratulations! You&apos;ve reached your daily hydration goal. Your body is well-nourished."
    }
    if (waterData.current >= waterData.goal * 0.75) {
      return "Almost there! Just a few more glasses to reach your goal."
    }
    if (waterData.current >= waterData.goal * 0.5) {
      return "You&apos;re halfway there! Keep sipping throughout the day."
    }
    return "Staying hydrated helps with energy, mood, and recovery. Every glass counts!"
  }

  return (
    <div className="min-h-screen pb-24 px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <header className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-1">
              Water Tracker
            </h1>
            <p className="text-muted-foreground">
              Stay hydrated throughout the day
            </p>
          </div>
          <button
            onClick={() => setShowGoalEdit(!showGoalEdit)}
            className="p-3 rounded-xl bg-card hover:bg-muted tap-scale transition-all duration-150"
            aria-label="Edit water goal"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        {/* Streak Badge */}
        {streak > 0 && (
          <div className="mt-4">
            <StreakBadge count={streak} type="water" />
          </div>
        )}
      </header>

      {/* Goal Edit */}
      {showGoalEdit && (
        <div className="mb-6 p-4 bg-card rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <label htmlFor="water-goal" className="block text-sm font-medium text-muted-foreground mb-2">
            Daily water goal (glasses)
          </label>
          <div className="flex gap-3">
            <input
              id="water-goal"
              type="number"
              min="1"
              max="20"
              value={tempGoal}
              onChange={(e) => setTempGoal(e.target.value)}
              className="flex-1 px-4 py-3 bg-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-[#D6D4F0]"
            />
            <button
              onClick={saveGoal}
              className="px-6 py-3 bg-[#CFE8E6] text-[#3A5A58] rounded-xl font-medium hover:bg-[#C5E0DE] tap-scale transition-all duration-150"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Progress Ring */}
      <div className="flex flex-col items-center mb-8 animate-in fade-in zoom-in-95 duration-500 delay-100">
        <ProgressRing
          progress={progress}
          size={180}
          strokeWidth={12}
          label={`${waterData.current}/${waterData.goal}`}
          sublabel="glasses"
          animated={true}
        />
        <p className="mt-4 text-lg font-medium text-foreground">
          {waterData.current >= waterData.goal
            ? "Goal reached!"
            : `${waterData.goal - waterData.current} more to go`}
        </p>
      </div>

      {/* Water Control Buttons */}
      <div className="flex items-center justify-center gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <button
          onClick={removeWater}
          disabled={waterData.current === 0}
          className="w-16 h-16 rounded-full bg-card shadow-sm flex items-center justify-center hover:bg-muted tap-scale transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D6D4F0]"
          aria-label="Remove one glass"
        >
          <Minus className="w-6 h-6 text-foreground" />
        </button>

        <button
          onClick={addWater}
          className={`w-24 h-24 rounded-full bg-[#CFE8E6] shadow-lg flex flex-col items-center justify-center hover:bg-[#C5E0DE] tap-scale transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D6D4F0] ${isAdding ? "scale-95" : ""}`}
          aria-label="Add one glass"
        >
          <Plus className={`w-8 h-8 text-[#3A5A58] transition-transform duration-150 ${isAdding ? "scale-125" : ""}`} />
          <span className="text-xs font-medium text-[#3A5A58] mt-1">Add glass</span>
        </button>

        <div className="w-16 h-16" /> {/* Spacer for balance */}
      </div>

      {/* Daily Progress Bar */}
      <div className="bg-card rounded-2xl p-5 shadow-sm mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <SectionHeader title="Today&apos;s Progress" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Progress</span>
          <span className="text-sm font-medium text-foreground">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#CFE8E6] to-[#D6F0E8] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Insight Card */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
        <InsightCard type="water" message={getInsightMessage()} />
      </section>
    </div>
  )
}
